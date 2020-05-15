<template>
  <div>
    <div class="title">
      <a><i>My Blog</i></a>
    </div>
    <div id="login">
    <a-form-item>
      <div style="padding: 0px 0px 10px 0px" class="form-item">
        <a>Regist</a>
      </div>  
    </a-form-item>
    <a-form-item>
      <div style="padding: 10px 0px 10px 0px">
        <a-input
          size="large"
          type="email"
          placeholder="Mail"
          style="width: 600px">
          <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </div>  
    </a-form-item>
    <a-form-item>
      <div style="padding: 10px 0px 10px 0px">
        <a-input
          size="large"
          placeholder="Username"
          style="width: 600px">
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
          style="width: 600px">
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
          style="width: 600px">
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
  </div>
  </div>
  
</template>

<script>
export default {
  name: 'about',
  
  data(){
    return {
      registerLoading : false,
    }
  },

  methods(){

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



