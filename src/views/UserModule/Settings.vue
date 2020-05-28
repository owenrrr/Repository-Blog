<template>
<div>
    <avatar :username="username" style="margin-left: 47%; margin-bottom: 40px" color="rgb(255, 255, 255)"></avatar>
    <!-- <a-icon type="user" style="font-size: 50px; margin-left: 47% ;margin-bottom: 20px"/> -->
    <h1 class="h1display">Username : <span class="inlineattribute">{{username}}</span></h1>
    <h1 class="h1display">Gender : <span class="inlineattribute">{{sex}}</span></h1>
    <h1 class="h1display">Age : <span class="inlineattribute">{{age}}</span></h1>
    <h1 class="h1display">Password : <span style="display: inline-block; margin-bottom: 50px">{{password}}</span></h1>
    <div>
        <a-button type="danger" style="margin-left: 35%">Modify</a-button>
        <a-button type="primary" style="margin-left: 10%">Confirm</a-button>
    </div>
</div>
</template>

<script>
import Avatar from 'vue-avatar'
import axios from 'axios'
export default {
    name : 'Settings',
    data(){
        return{
            username: '',
            sex: 'Male',
            age: 0,
            password: '',
        }
    },
    components:{
        Avatar,
    },
    mounted(){
        this.constructor()  // 获取账户的资料
    },
    methods: {
        constructor(){
            let userList
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                console.log("Excute the constructor function!")
              userList = res.data.users.users
              this.username = this.$store.getters.getUsername
              console.log(this.username)
              for (var user of userList){
                if (user.username === this.username){
                    this.password = user.password
                    if (user.sex != null){
                        this.sex = user.sex
                    }
                    if (user.age != null){
                        this.age = user.age
                    }
                }
              }
            })
        },
    },
}
</script>

<style>
 .h1display {
     font-size: 17px; 
     margin-left: 38%;
     margin-bottom: 20px;
}
 .inlineattribute{
     display: inline-block; 
     margin-left: 20px;
     /* background-color: dimgray; */
 }
</style>