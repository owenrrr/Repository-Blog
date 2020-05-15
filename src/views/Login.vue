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
                { rules: [{ required: true, message: 'Please input the password!'}]}
              ]"
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
            <a href="">
              Register Now
            </a>
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
  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
    },
  };
</script>
