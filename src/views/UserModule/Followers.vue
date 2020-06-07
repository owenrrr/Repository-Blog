/* eslint-disable vue/no-unused-vars */
<template>
<div>
    <div class="inline-blo">
        <h1 style="font-size: 20px; margin-left: 70px; margin-right: 70px; font: YouYuan">Recommended List</h1>
        <a-list item-layout="horizontal" :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta
                    :description= "item.description"
                >
                    <a slot="title">{{ item.title }}</a>
                    <a-avatar
                    slot="avatar"
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                </a-list-item-meta>
            </a-list-item>
        </a-list>
    </div>
    <div style="display: inline-block; width: 40%; float: right; margin-top: 10px; margin-right: 10px">
        <a-input-search placeholder="Input username..." allow-clear class="searchInput" @search="onSearch" />
        <a-button style="margin-bottom: 10px; margin-right: 10px" v-if="state == 'search'" @click="stateshow">Back</a-button>
    </div>
</div>
</template>

<script>
// description= "item.description"
import axios from 'axios'
export default{
    name: 'Followers',
    data() {
        return {
            data: [],
            userid: null,
            defaultData: [],
            state: "show",  // show, search
        }
    },
    mounted(){
        this.constructor()
        console.log(this.data)
    },
    methods:{
        constructor(){
            let userList
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                console.log("Excute the constructor function! in constructor")
                userList = res.data.users.users
                console.log(userList)
                this.userid = this.$store.getters.getUserid
                console.log(this.userid)
              for (var user of userList){
                if (user.userid === this.userid){
                   continue
                }
                let tmp = {title: null, description: null}
                tmp.title = user.username
                tmp.description = (user.description == null? "He/She is too lazy, nothing left ( ˘•ω•˘ )": user.description)
                this.data.push(tmp)
              }
              console.log(this.data)
            })

        },
        onSearch(value){
            let userList
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                console.log(value)
                if (this.state === 'show'){
                    for (var t of this.data){  
                        //先备份defaultlist
                        this.defaultData.push(t)
                    }
                }
                console.log("Excute the constructor function! in onSearch")
                userList = res.data.users.users
                let tmp = {title: null, description: null}
              for (var user of userList){
                if (user.username == value){
                    tmp.title = user.username
                    tmp.description = (user.description == null? "He/She is too lazy, nothing left ( ˘•ω•˘ )": user.description)
                    this.data.length = 0 // 清空数组
                    this.data.push(tmp)
                    break
                }
              }
              console.log("Here is search of data")
              console.log(this.data)
              console.log(this.defaultData)
              if (this.data.length == this.defaultData){
                  this.$message.warning("'" + value + "' is not exist. ", 3);
              }
              this.state = 'search'
            })
        },
        stateshow(){
            this.data.length = 0 // 清空data
            for (var t of this.defaultData){
                this.data.push(t)
            } 
            this.defaultData.length = 0 //清空defaultData   
            console.log("Execute stateshow function and the data is :" + this.data)
            this.state = 'show'
        },
    },
}
</script>

<style>
.searchInput {
    width: 200px; 
    float: right; 
}
.inline-blo {
    display: inline-block;
    width: 40%;
}
</style>