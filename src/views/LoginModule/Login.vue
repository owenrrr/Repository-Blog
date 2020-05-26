<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <span class="head">My Blog</span>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <div :style="{ background: 'lightgray', padding: '100px', minHeight: '380px' }">
        <a-form
                id="components-form-demo-normal-login"
                :form="form"
                class="login-form"
                @submit="handleSubmit"
                :style="{width: '300px', margin: '0 auto'}"
        >
          <a-form-item>
            <a-input
              v-decorator="[
                'username',
                {rules: [{ required: true, message: 'Please input the account!'}]}
              ]"
              placeholder="Account"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                { rules: [
                    { required: true, message: 'Please input the password!'},
                    { whitespace: true, message: 'Passwords are not allowed to have spaces!' },
                  ]
                }
              ]"
              @blur="validatePassword"
              type="password"
              placeholder="Password"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: true,
                }
              ]"
            >
              Remember me
            </a-checkbox>
            <a class="login-form-forgot" href="">
              Forget Password
            </a>
            <a-button type="primary" html-type="submit" class="login-form-button">
              LOGIN
            </a-button>
            Or
            <router-link :to = "{ path : '/regist'}">Register Now</router-link>
            <!--<router-view></router-view>-->
          </a-form-item>
        </a-form>
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Design by LXY in 2020.5.13
    </a-layout-footer>
  </a-layout>
</template>

<style>

  #components-layout-demo-fixed .logo{
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px 16px 0;
    float: left;
  }

  .head {
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    color: whitesmoke;
    font-size: 40px;
    font-style:italic;
  }

  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>


<script>
import axios from 'axios'
  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    data() {
      return {
      }
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.checkLoginInfo(values)
            // if (this.checkLoginInfo(values)) {
            //   this.$message.success('Login Success! Welcom Back ' + this.form.getFieldValue('username') + '!', 3);
            //   this.$router.push('/MyBlog')
            // }
            // else {
            //   this.form.resetFields()
            //   this.$message.warning('Login Failed! Wrong account or password.', 3);
            // }
          }
        });
      },
      checkLoginInfo(values) {
        this.returnCheckBool(values)
      },
      returnCheckBool(values){
        let userList
        axios.get('http://localhost:3000/user/getuserlist').then((res) => {
          userList = res.data.users.users
          for (var user of userList){
            if (user.username === values.username && user.password === values.password){
              console.log("Execute true")
              return Promise.reject()
            }
          }
          console.log("Execute false")
          this.form.resetFields()
          this.$message.warning('Login Failed! Wrong account or password.', 3);
        }).catch(() => {
          this.$message.success('Login Success! Welcom Back ' + this.form.getFieldValue('username') + '!', 3);
          this.$router.push('/MyBlog')
        })
      },
      validatePassword(e) {
        if (e.target.value.length < 6) {
          const error = [{
            message: 'Password cannot be less than 6 digits!',
          }]
          this.form.setFields({
            password: {
              value: e.target.value,
              errors: error
            }
          })
        }
        else {
          if (e.target.value.length > 20) {
            const error = [{
              message: 'Password cannot be more than 20 digits!',
            }]
            this.form.setFields({
              password: {
                value: e.target.value,
                errors: error
              }
            })
          }
        }
      }
    },
  };
</script>
