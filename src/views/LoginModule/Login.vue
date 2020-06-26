<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <span class="head">My Blog</span>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px'}" class="con">
      <div :style="{ background: 'lightgray', padding: '100px', minHeight: '590px' }">
        <span class="head1">My Blog</span>
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
                'mail',
                {rules: [
                        { type: 'email',message: '请输入合法邮箱!'},
                        { required: true, message: '邮箱不能为空!'},
                        ],
                        validateTrigger: 'blur'
                }
              ]"
              placeholder="邮箱"
            >
              <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                { rules: [
                    { required: true, message: '密码不能为空!'},
                    { whitespace: true, message: '密码不允许有空格!' },
                  ]
                }
              ]"
              @blur="validatePassword"
              type="password"
              placeholder="密码"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="login-form-button">
              登录
            </a-button>
            或
            <router-link :to = "{ path : '/regist'}">立即注册</router-link>
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

  .head1 {
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    color: #444444;
    font-size: 30px;
    font-style:italic;
    margin-left: 560px;
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
  .con {
    min-height: 600px;
  }
</style>


<script>
  import axios from 'axios'
  import {setToken} from '@/util/auth.js'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'set_userInfo',
        'set_userId'
      ]),
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields(async (err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            await this.returnCheckBool(values)
          }
        });
      },
      async returnCheckBool(values){
        let param = {
          email: values.mail,
          password: values.password
        }
        let res = await axios.post('http://localhost:3000/user/login', param)
        console.log(res)
        if (res.data) {
          this.$message.success('登录成功', 2)
          this.form.resetFields()
          let get = await axios.get('http://localhost:3000/user/getUserByEmail', {params: {email: values.mail}})
          let userInfo = get.data
          console.log(userInfo)
          setToken(userInfo.userId)
          this.$store.commit('set_userId', userInfo.userId)
          this.$store.commit('set_userInfo', userInfo)
          console.log(this.userInfo)
          await this.$router.push('/MyBlog')
        }
        else {
          this.$message.error('登录失败，邮箱或密码错误', 3)
        }
      },
      validatePassword(e) {
        if (e.target.value.length < 6) {
          const error = [{
            message: '密码不能少于6位!',
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
              message: '密码不能大于20位!',
            }]
            this.form.setFields({
              password: {
                value: e.target.value,
                errors: error
              }
            })
          }
        }
      },
    },
  };
</script>
