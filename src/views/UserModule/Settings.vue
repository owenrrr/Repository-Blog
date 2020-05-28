<template>
<div>
    <avatar :username="basic.username" style="margin-left: 47%; margin-bottom: 40px" color="rgb(255, 255, 255)"></avatar>
    <!-- <a-icon type="user" style="font-size: 50px; margin-left: 47% ;margin-bottom: 20px"/> -->
    <h1 class="h1display">Username : 
        <span v-if="state == 'show'" class="inlineattribute">{{basic.username}}</span>
        <span><a-input 
                v-if="state == 'modify'" 
                :placeholder="basic.username" 
                style="background: lightgray; width: 30%" 
                allow-clear 
                class="inlineattribute" 
                v-model="basic.username"/></span>
    </h1>
    <h1 class="h1display">Gender : 
        <span v-if="state == 'show'" class="inlineattribute">{{basic.sex}}</span>
        <span>
            <a-select default-value="Male" v-if="state == 'modify'" style="width: 20%; display: inline-block; margin-left: 42px;" @change="handleChange">
                <a-select-option value="Male">Male</a-select-option>
                <a-select-option value="Female">Female</a-select-option>
            </a-select>
        </span>
        <span v-if="state == 'show'" class="inlineattribute">(0: Female 1: Male)</span>
    </h1>
    <h1 class="h1display">Age : 
        <span v-if="state == 'show'" class="inlineattribute">{{basic.age}}</span>
        <span>
            <a-input 
            v-if="state == 'modify'" 
            :placeholder="basic.age" 
            style="background: lightgray; width:20%; display: inline-block; margin-left: 68px;" 
            allow-clear 
            v-model="basic.age"/>
        </span>
    </h1>
    <h1 class="h1display">Password : 
        <span v-if="state == 'show'" class="inlineattribute">{{basic.password}}</span>
        <span>
            <a-input 
            v-if="state == 'modify'" 
            :placeholder="basic.password" 
            style="background: lightgray; width: 30%; display: inline-block; margin-left: 27px;" 
            allow-clear 
            v-model="basic.password"/>
        </span>
    </h1>
    <div>
        <a-button v-if="state == 'show'" type="danger" style="margin-left: 45%" @click="stateModify">Modify</a-button>
        <a-button v-if="state == 'modify'" style="margin-left: 35%; margin-top: 20px" @click="stateCancel">Cancel</a-button>
        <a-button v-if="state == 'modify'" type="primary" style="margin-left: 10%" @click="stateConfirm">Confirm</a-button>
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
            basic: {
                userid: null,
                username: '',
                sex: 'Male',
                age: 0,
                password: '',
            },
            state: 'show',
            duplicate:{
                userid: null,
                username: '',
                sex: 'Male',
                age: 0,
                password: '',
            },
        }
    },
    components:{
        Avatar,
    },
    mounted(){
        this.constructor()  // 获取账户的资料
    },
    actions(){
    },
    methods: {
        constructor(){
            let userList
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                console.log("Excute the constructor function!")
              userList = res.data.users.users
              this.basic.userid = this.$store.getters.getUserid
              console.log(this.basic.username)
              for (var user of userList){
                if (user.userid == this.basic.userid){
                    this.basic.password = user.password
                    this.basic.username = user.username
                    if (user.sex != null){
                        this.basic.sex = user.sex
                    }
                    if (user.age != null){
                        this.basic.age = user.age
                    }
                }
              }
            })
        },
        stateConfirm(){
            if (this.basic.age < 0 || this.basic.age > 120){
                this.$message.warning('Age is not allowed.', 3);
                this.stateCancel()
            }else{
                console.log("Here is handleUsernamecheck before")
                this.handleUsernameCheck()
            }
            
        },
        stateModify(){
            const data = this.basic
            this.duplicate = data
            this.state = 'modify'
        },
        stateCancel(){
            this.basic = this.duplicate
            this.state = 'show'
        },
        handleChange(value){
            this.basic.sex = value
        },
        handleUsernameCheck(){
            let userList
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
            userList = res.data.users.users
            for (var user of userList){
                if (user.username == this.basic.username && user.userid != this.basic.userid){
                    console.log("Execute false")
                    return Promise.reject()
                }
            }
                this.$message.success('Modify successfully !', 3)
                console.log(this.basic.username)
                console.log(this.basic.userid)
                this.changeUser()
                this.state = 'show'
            }).catch(() => {
                this.$message.warning('Username is used.', 3);
                this.stateCancel()
            })
        },
        changeUser(){
            console.log(this.basic)
            if (this.basic.sex == "Male"){
                axios.post('http://localhost:3000/user/updateuser', {
                    username: this.basic.username,
                    age: this.basic.age,
                    sex: 1,
                    password: this.basic.password,
                    userid: this.basic.userid,
                })
            }else{
                axios.post('http://localhost:3000/user/updateuser', {
                    username: this.basic.username,
                    age: this.basic.age,
                    sex: 0,
                    password: this.basic.password,
                    userid: this.basic.userid,
                })
            }
            
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