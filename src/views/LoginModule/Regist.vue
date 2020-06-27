<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <span class="head">My Blog</span>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <div :style="{ background: 'lightgray', padding: '100px', minHeight: '590px' }">
        <span class="head1">My Blog</span>
        <a-form
                id="components-form-demo-normal-login"
                :form="form"
                class="login-form"
                @submit="handleRegisterSubmit"
                :style="{width: '300px', margin: '0 auto'}"
        >
          <a-form-item>
            <a-input
              size="large"
              type="email"
              placeholder="邮箱"
              v-decorator="[
                  'registerUserMail',
                  {rules: [{ required: true, type: 'email', message: '请输入合法邮箱' }, { validator: this.handleUserEmail }], validateTrigger: 'blur'}]"
            >
              <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              placeholder="用户名"
              v-decorator="[
                  'registerUsername',
                  {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'blur'}]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              placeholder="密码"
              v-decorator="[
                    'registerPassword', 
                    {rules: [{ required: true, message: ' ' }, { validator: this.handlePassword }], validateTrigger: 'blur'}]">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              placeholder="验证密码"
              v-decorator="[
                    'registerPasswordconfirm', 
                    {rules: [{ required: true, message: ' ' }, { validator: this.handlePasswordCheck }], validateTrigger: 'blur'}]">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item style="margin-top: 20px" class="center">
            <a-button
              size="large"
              type="primary"
              :loading="registerLoading"
              html-type="submit"
            >注册</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Design by LZY in 2020.5.15
    </a-layout-footer>
  </a-layout>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Regist',
  
  data(){
    return {
        colorList: ['#2828FF','#00BB00','#FF5809','#F9F900','#AE57A4','#FF0000','#FF60AF','#8E8E8E','#9F35FF','#00FFFF'],
        basic : {
            username : '',
            password: '',
            email: '',
            color: '',
        },
        registerLoading : false,
        registerPW: true,
        registerUN: true,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'regist' });
  },
  methods :{
      handleRegisterSubmit(e){
        e.preventDefault();

        this.form.validateFields(async (err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);

            if (this.checkRegistInfo()) {
              this.$message.success('注册成功!');
              this.basic.username = this.form.getFieldValue('registerUsername')
              this.basic.color = this.getcolor()
              await this.addUser()
              this.form.resetFields()
              await this.$router.push('/')
            }
            else {
              this.form.resetFields()
              this.$message.warning('注册失败，请完成表格', 3);
            }
          }
        });
      },
      getcolor(){
        return this.colorList[Math.floor(Math.random()*10)]
      },
      async addUser(){
        console.log(this.basic)
        let res =  await axios.post('http://localhost:3000/user/adduser',this.basic)
        console.log(res)
      },
      checkRegistInfo(){
        return this.registerPW && this.registerUN;
      },
      handlePassword(rule, value, callback) {
          if (value.length < 6){
              callback(new Error("密码必须大于6位"))
              this.registerPW = false
          }
          this.basic.password = value
          this.registerPW = true
          callback()
        
      },
      handlePasswordCheck(rule, value, callback){
          if (!value){
              callback(new Error("请输入密码"))
              if (this.registerPW){
                this.registerPW = false
              }
          }else if (value && this.basic.password && value.trim() !== this.basic.password.trim()){
              callback(new Error("请输入相同密码"))
              if (this.registerPW){
                this.registerPW = false
              }
          }
          callback()
      },
      async handleUserEmail(rule, value, callback){
        let res = await axios.get('http://localhost:3000/user/checkEmail', {params: {email: value}})
        console.log(res);
        if (res.data) {
          console.log("Execute true")
          this.registerUN = true
          this.basic.email = value
          callback()
        }
        else {
          this.registerUN = false
          callback(new Error("邮箱已存在"))
        }
      }
  }
}

</script>


<style>
  .head1 {
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    color: #444444;
    font-size: 30px;
    font-style:italic;
    margin-left: 560px;
  }

#login {

  background-color:lightgray;
  padding: 50px 100px 80px 100px;
}

.form-item a {
  font-size: 1cm;
}
.title {
  height: 64px;
  padding: 0px 50px;
  background-color: #2c3e50;
}
.title a i{
  text-align: center;
  font-size: 40px;
  font-family: "Arial";
  color: aliceblue;
  
}
.center {
  text-align: center;
}
.head {
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    color: whitesmoke;
    font-size: 40px;
    font-style:italic;
  }

#app {
  height: 100%;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>