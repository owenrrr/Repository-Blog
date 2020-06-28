<template>
<div>
    <!--<avatar :username="basic.userName" style="margin-left: 47%; margin-bottom: 40px" color="rgb(255, 255, 255)"></avatar>-->
    <a-avatar slot="avatar" size="large" :style="{backgroundColor: this.userInfo.color}" style="margin-left: 48%; margin-bottom: 0px">{{basic.userName}}</a-avatar>
    <a-form :form="form" style="margin-top: 40px; margin-left: 450px">

        <a-form-item label="用户名" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1  }">
            <a-input
                    placeholder="请填写用户名"
                    v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名' }] }]"
                    v-if="modifyInfo"
            />
            <span v-else>{{ userInfo.userName }}</span>
        </a-form-item>

        <a-form-item label="邮箱" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1 }">
            <span>{{ userInfo.email }}</span>
        </a-form-item>

        <a-form-item label="性别" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1 }">
            <a-select default-value="无" v-if="modifyInfo" v-decorator="['sex', { rules: [{ required: true, message: '请选择性别' }] }]">
                <a-select-option value="无">
                    无
                </a-select-option>
                <a-select-option value="男">
                    男
                </a-select-option>
                <a-select-option value="女">
                    女
                </a-select-option>
            </a-select>
            <span v-else>{{ userInfo.sex}}</span>
        </a-form-item>

        <a-form-item label="年龄" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1 }">
            <a-input
                    placeholder="请填年龄"
                    v-decorator="['age', { rules: [{ required: true, message: '请输入年龄' }] }]"
                    v-if="modifyInfo"
            />
            <span v-else>{{ userInfo.age}}</span>
        </a-form-item>

        <a-form-item label="自我介绍" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1 }">
            <a-input
                    placeholder="请输入自我介绍"
                    v-decorator="['description', { rules: [{ required: true, message: '请输入介绍' }] }]"
                    v-if="modifyInfo"
            />
            <span v-else>{{ userInfo.description}}</span>
        </a-form-item>

        <a-form-item label="密码" :label-col="{ span: 3 }" :wrapper-col="{ span: 8, offset: 1 }" v-if="modifyPassword">
            <a-input
                    placeholder="请输入旧密码"
                    v-decorator="['oldpassword', { rules: [{ required: true, message: '请输入旧密码' }] }]"
            />
            <a-input
                    placeholder="请输入新密码"
                    v-decorator="['newpassword', { rules: [{ required: true, message: '请输入新密码' }] }]"
            />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 12, offset: 5 }" v-if="modifyPassword&&modifyInfo">
            <a-button type="primary" @click="saveModifyPassword">
                确定修改密码
            </a-button>
            <a-button type="default" style="margin-left: 30px" @click="cancelModifyPassword">
                取消
            </a-button>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 8, offset: 4 }" v-if="modifyInfo&&!modifyPassword">
            <a-button type="primary" @click="ModifyPassword">
                修改密码
            </a-button>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 12, offset: 5 }" v-if="modifyInfo">
            <a-button type="primary" @click="saveModifyInfo">
                保存
            </a-button>
            <a-button type="default" style="margin-left: 30px" @click="cancelModifyInfo">
                取消
            </a-button>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 8, offset: 4 }" v-else>
            <a-button type="primary" @click="ModifyInfo" v-if="Number(getUserId) === Number(this.$route.params.userId)">
                修改信息
            </a-button>
        </a-form-item>


    </a-form>
</div>
</template>

<script>
    /*import Avatar from 'vue-avatar'*/
    import axios from 'axios'
    import {mapGetters} from 'vuex'
    export default {
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
        name : 'Settings',
    data(){
        return{
            modifyInfo:false,
            modifyPassword:false,
            basic: {
                userId: 0,
                userName: '',
                sex: '',
                description: '',
                age: '',
                password: '',
            },
            userInfo: {},
            state: 'show',
            duplicate:{
                userId: 0,
                userName: '',
                sex: '',
                description: '',
                age: '',
                oldpassword: '',
                newpassword: '',
            },
        }
    },
    computed: {
        ...mapGetters([
            'getUserId'
        ])
    },
    /*components:{
        Avatar,
    },*/
    async mounted(){
        await this.constructor()  // 获取账户的资料
    },
    methods: {
        ModifyInfo(){
            this.modifyInfo=true
        },
        ModifyPassword(){
            this.modifyPassword=true
        },
        saveModifyInfo(){
            this.form.validateFields((err,values) => {
                if(!err) {
                    console.log("saving info..........")
                    this.duplicate.userId = this.basic.userId
                    this.duplicate.userName = this.form.getFieldValue('userName')
                    this.duplicate.sex = this.form.getFieldValue('sex')
                    this.duplicate.description = this.form.getFieldValue('description')
                    this.duplicate.age = this.form.getFieldValue('age')
                    this.duplicate.oldpassword = this.basic.password
                    this.duplicate.newpassword = this.basic.password
                    this.modifyInfo=false
                    if(this.modifyPassword)this.modifyPassword=false
                    this.Confirm()
                    console.log(values);
                }
            })
        },
        cancelModifyInfo(){
            if(this.modifyPassword)this.modifyPassword=false
            this.modifyInfo=false
        },
        saveModifyPassword(){
            console.log(this.basic)
            this.duplicate.oldpassword = this.form.getFieldValue('oldpassword')
            this.duplicate.newpassword = this.form.getFieldValue('newpassword')
            this.duplicate.age = this.basic.age
            this.duplicate.description = this.basic.description
            this.duplicate.sex = this.basic.sex
            this.duplicate.userId = this.basic.userId
            this.duplicate.userName = this.basic.userName
            this.modifyPassword=false
            this.Confirm()
        },
        cancelModifyPassword(){
            this.modifyPassword=false
        },

        async constructor(){
            let res = await axios.get('http://localhost:3000/user/getUserById', {params: {userId: this.$route.params.id}})
            this.userInfo = res.data
            console.log(this.userInfo)
            this.basic.userId = this.userInfo.userId
            this.basic.userName = this.userInfo.userName
            this.basic.age = this.userInfo.age
            if (this.userInfo.sex === null) {
                this.basic.sex = '无'
            }
            else {
                this.basic.sex = this.userInfo.sex
            }
            this.basic.password = this.userInfo.password
            this.basic.description = this.userInfo.description === '' ? '这个人很懒，还没有留下什么。' : this.userInfo.description
            console.log(this.basic)
        },

        async Confirm(){
            if (this.duplicate.age < 0 || this.duplicate.age > 120){
                this.$message.warning('非法年龄', 3);
                this.cancelModifyInfo()
            }else if(this.duplicate.oldpassword!=this.basic.password){
                this.$message.warning('密码错误', 3);
                this.cancelModifyPassword()
            }else{
                console.log("Updating..........")
                await this.Update()
            }
        },

        async Update(){
            await axios.post('http://localhost:3000/user/updateuser', {
                userName: this.duplicate.userName,
                age: this.duplicate.age,
                sex: this.duplicate.sex,
                description: this.duplicate.description,
                password: this.duplicate.newpassword,
                userId: this.duplicate.userId,
            })
            this.$message.success('修改成功', 2)
            this.constructor()

        },

    },
}
</script>

<style>

</style>