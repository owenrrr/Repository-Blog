<template>
  <div>
    <div class="title">
      <a><i>- - - - - - - - - - - - - - - My Blog - - - - - - - - - - - - - - -</i></a>
    </div>
    <div id="login">
    <!-- <a-form-item>
      <div style="padding: 0px 0px 10px 0px" class="form-item">
        <a>Regist</a>
      </div>  
    </a-form-item> -->
    <a-form :form="registerform">
        <a-form-item>
      <div style="padding: 10px 0px 10px 0px">
        <a-input
          size="large"
          type="email"
          placeholder="Mail"
          style="width: 600px"
          v-decorator="[
              'registerUserMail', 
              {rules: [{ required: true, type: 'email', message: 'Please input the mail' }], validateTrigger: 'blur'}]">
          <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </div>  
    </a-form-item>
    <a-form-item>
      <div style="padding: 10px 0px 10px 0px">
        <a-input
          size="large"
          placeholder="Username"
          style="width: 600px"
          v-decorator="[
              'registerUsername', 
              {rules: [{ required: true, message: 'Please input the username' }, { validator: this.handleUsername }], validateTrigger: 'blur'}]">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </div>
    </a-form-item>
    <a-form-item>
      <div style="padding: 10px 0px 10px 0px">
        <a-input
          size="large"
          type="password"
          placeholder="password"
          style="width: 600px"
          v-decorator="[
                'registerPassword', 
                {rules: [{ required: true, message: 'Please input the password' }, { validator: this.handlePassword }], validateTrigger: 'blur'}]">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </div>
    </a-form-item>
    <a-form-item>
      <div style="padding: 10px 0px 10px 0px">
        <a-input
          size="large"
          type="password"
          placeholder="Confirm Password"
          style="width: 600px"
          v-decorator="[
                'registerPasswordconfirm', 
                {rules: [{ required: true, message: 'Please input the password' }, { validator: this.handlePasswordCheck }], validateTrigger: 'blur'}]">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </div>
    </a-form-item>
    <a-form-item style="margin-top: 20px">
      <a-button
        size="large"
        type="primary"
        ghost="true"
        :loading="registerLoading"
        @click="handleRegister()"
      >Submit</a-button>
    </a-form-item>
    </a-form>
  </div>
  </div>
  
</template>

<script>
// import axios from 'axios'
export default {
  name: 'Regist',
  
  data(){
    return {
        basic : {
            email: '',
            username : '',
            password: '',

        },
        registerLoading : false,

        registerform: this.$form.createForm(this),
    }
  },

  methods :{
      handlePassword(rule, value, callback) {
          if (value.length <= 6){
              callback(new Error("Password length must longer than 6"))
          }
          this.basic.password = value;
          callback();
        
      },
      handlePasswordCheck(rule, value, callback){
          if (!value){
              callback(new Error("Please input your password!"))
          }else if (value && this.basic.password && value.trim() != this.basic.password.trim()){
              callback(new Error("Please input the same password!"))
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
        if (value == "Owen"){
            callback(new Error("Username is used."))
        }
          this.basic.username = value
          callback()         
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
  background-color:black;
}
.title a {
  font-size: 1.5cm;
  font-family: "Arial";
  color: aliceblue;
  
}
</style>