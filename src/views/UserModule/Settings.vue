<template>
<div>
    <avatar :username="basic.userName" style="margin-left: 47%; margin-bottom: 40px" color="rgb(255, 255, 255)"></avatar>
    <!-- <a-icon type="user" style="font-size: 50px; margin-left: 47% ;margin-bottom: 20px"/> -->
    <h1 class="h1display">用户名 :
        <span v-if="state === 'show'" class="inlineattribute">{{basic.userName}}</span>
        <span><a-input 
                v-if="state === 'modify'"
                :placeholder="basic.userName"
                style="background: lightgray; width: 30%" 
                allow-clear 
                class="inlineattribute" 
                v-model="basic.userName"/></span>
    </h1>
    <h1 class="h1display">性别 :
        <span v-if="state === 'show'" class="inlineattribute">{{basic.sex}}</span>
        <span>
            <a-select default-value="2" v-if="state === 'modify'" style="width: 20%; display: inline-block; margin-left: 42px;" @change="handleChange">
                <a-select-option value="2">无</a-select-option>
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="0">女</a-select-option>
            </a-select>
        </span>
    </h1>
    <h1 class="h1display">年龄 :
        <span v-if="state === 'show'" class="inlineattribute">{{basic.age}}</span>
        <span>
            <a-input 
            v-if="state === 'modify'"
            :placeholder="duplicate.age"
            style="background: lightgray; width:20%; display: inline-block; margin-left: 68px;" 
            allow-clear 
            v-model="duplicate.age"/>
        </span>
    </h1>
    <h1 class="h1display">密码 :
        <span v-if="state === 'show'" class="inlineattribute">{{basic.password}}</span>
        <span>
            <a-input 
            v-if="state === 'modify'"
            :placeholder="basic.password" 
            style="background: lightgray; width: 30%; display: inline-block; margin-left: 27px;" 
            allow-clear 
            v-model="basic.password"/>
        </span>
    </h1>
    <h1 class="h1display">个性签名 :
        <span v-if="state === 'show'" style="align-text: center; display: inline-block; margin-right: 150px">{{basic.description}}</span>
        <span>
            <a-textarea
                v-if="state === 'modify'"
                v-model="basic.description"
                placeholder="Description"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                style="background: lightgray; display: inline-block;"
            />
        </span>
    </h1>
    <div>
        <a-button v-if="state === 'show'" type="danger" style="margin-left: 45%" @click="stateModify">修改信息</a-button>
        <a-button v-if="state === 'modify'" style="margin-left: 35%; margin-top: 20px" @click="stateCancel">取消</a-button>
        <a-button v-if="state === 'modify'" type="primary" style="margin-left: 10%" @click="stateConfirm">确认</a-button>
    </div>
</div>
</template>

<script>
    import Avatar from 'vue-avatar'
    import axios from 'axios'
    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
    name : 'Settings',
    data(){
        return{
            basic: {
                userId: 0,
                userName: '',
                sex: '',
                description: '',
                age: 0,
                password: '',
            },
            state: 'show',
            duplicate:{
                userId: 0,
                userName: '',
                sex: '',
                description: '',
                age: 0,
                password: '',
            },
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    components:{
        Avatar,
    },
    async mounted(){
        await this.constructor()  // 获取账户的资料
    },
    methods: {
        ...mapMutations([

        ]),
        ...mapActions([
            'getUserInfo'
        ]),
        async constructor(){
            await this.$store.dispatch('getUserInfo')
            console.log(this.userInfo)
            this.basic.userId = this.userInfo.userId
            this.basic.userName = this.userInfo.userName
            this.basic.age = this.userInfo.age
            if (this.userInfo.sex === null) {
                this.basic.sex = null
            }
            else {
                this.basic.sex = this.userInfo.sex === 0 ? '女' : '男'
            }
            this.basic.password = this.userInfo.password
            this.basic.description = this.userInfo.description === null ? '这个人很懒，还没有留下什么。' : this.userInfo.description
            console.log(this.basic)
        },
        async stateConfirm(){
            if (this.basic.age < 0 || this.basic.age > 120){
                this.$message.warning('非法年龄', 3);
                this.stateCancel()
            }else{
                console.log("Here is handleUsernamecheck before")
                await this.handleUsernameCheck()
            }
            
        },
        stateModify(){
            this.duplicate = this.basic
            this.duplicate.sex = 2
            this.state = 'modify'
        },
        stateCancel(){
            if (this.duplicate.sex === 2) {
                this.basic.sex = null
            }
            else if (this.duplicate.sex === 0) {
                this.basic.sex = '女'
            }
            else if (this.duplicate.sex === 1) {
                this.basic.sex = '男'
            }
            console.log(this.duplicate)
            this.basic = this.duplicate

            console.log(this.basic)
            this.state = 'show'
        },
        handleChange(value){
            console.log(value)
            this.duplicate.sex = Number(value)
        },
        async handleUsernameCheck(){
            console.log(this.basic)
            await axios.post('http://localhost:3000/user/updateuser', {
                userName: this.duplicate.userName,
                age: this.duplicate.age === null ? 0 : this.duplicate.age,
                sex: this.duplicate.sex,
                description: this.duplicate.description,
                password: this.duplicate.password,
                userId: this.duplicate.userId,
            })
            this.stateCancel()

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