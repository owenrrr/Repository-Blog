<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <span class="head">My Blog</span>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <div :style="{ background: 'lightgray', padding: '100px', minHeight: '380px' }">
        <a-form
                id="components-form-demo-normal-login"
                :form="registerform"
                class="login-form"
                @submit="handleRegisterSubmit"
                :style="{width: '300px', margin: '0 auto'}"
        >
          <a-form-item>
            <a-input
              size="large"
              type="email"
              placeholder="Mail"
              v-decorator="[
                  'registerUserMail',
                  {rules: [{ required: true, type: 'email', message: 'Invalid Mail' }], validateTrigger: 'blur'}]"
            >
              <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              placeholder="Username"
              v-decorator="[
                  'registerUsername',
                  {rules: [{ required: true, message: 'Invalid Username' }, { validator: this.handleUsername }], validateTrigger: 'blur'}]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              placeholder="password"
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
              placeholder="Confirm Password"
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
            >Submit</a-button>
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
        basic : {
            sex: null,
            age: null,
            username : '',
            password: '',
        },
        registerLoading : false,
        registerPW: true,
        registerUN: true,

        registerform: this.$form.createForm(this),  //create form to get input-data
    }
  },

  methods :{
      handleRegisterSubmit(e){
        e.preventDefault();

        this.registerform.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);

            if (this.checkRegistInfo()) {
              this.$message.success('Regist Success!');
              this.addUser()  
              this.$router.push('/')
            }
            else {
              this.form.resetFields()
              this.$message.warning('Regist Failed! Fullfill the form please.', 3);
            }
          }
        });
      },
      addUser(){
        axios.post('http://localhost:3001/user/adduser',this.basic)
      },
      checkRegistInfo(){
        if (this.registerPW && this.registerUN){
          return true
        }else{
          return false
        }
      },
      handlePassword(rule, value, callback) {
          if (value.length < 6){
              callback(new Error("Password length must longer than 6"))
              this.registerPW = false
          }
          this.basic.password = value
          this.registerPW = true
          callback()
        
      },
      handlePasswordCheck(rule, value, callback){
          if (!value){
              callback(new Error("Please input your password!"))
              if (this.registerPW){
                this.registerPW = false
              }
          }else if (value && this.basic.password && value.trim() != this.basic.password.trim()){
              callback(new Error("Please input the same password!"))
              if (this.registerPW){
                this.registerPW = false
              }
          }
          callback()
      },
      handleUsername(rule, value, callback){
          // interface http://localhost:8083/returnUsername need return Username array
        //   axios.get('http://localhost:8083/returnUsername').then(res => {
        //       for (var i=0; i<res.length; i++){
        //           if (res[i].trim() == value.trim()){
        //               callback(new Error("Username is used."))
        //           }
        //       }
        //   } )
        let userList
        axios.get('http://localhost:3000/user/getuserlist').then((res) => {
          userList = res.data.users.users
          for (var user of userList){
            if (user.username === value.username){
              console.log("Execute false")
              return Promise.reject()
            }
          }
          console.log("Execute true")
          this.registerUN = true
          this.basic.username = value
          callback()
        }).catch( () => {
          this.registerUN = false
          callback(new Error("Username is used."))
        })
        // if (value == "Owen"){
        //   this.registerUN = false
        //     callback(new Error("Username is used."))
        // }
        //   this.basic.username = value
        //   callback()         
      }
  }
}

</script>


<style>

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