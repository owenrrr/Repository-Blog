<template>
<div>
    <p style="height: 100px; width: 100%; color:blueviolet; font-size: 50px; font-family:PingFangSC-Regular,Verdana,Arial;">{{ paper.title }}</p>
    <h1 style="font-style:oblique; margin: 20px 0px; display: inline-block">{{ username }}</h1>
    <h2 style="display: inline-block">by {{ paper.createtime }}</h2>
    <div>
        {{ paper.content }}
    </div>
    <span :key="type">
        <a-icon :type="star" style="margin-right: 8px" />
          {{ paper.starnum }}
    </span>
    <span :key="type">
        <a-icon :type="like" style="margin-right: 8px" />
          {{ paper.likenum }}
    </span>
    <span :key="type">
        <a-icon :type="message" style="margin-right: 8px" />
          {{ paper.commentnum }}
    </span>
    <a-back-top />
    Click
    <strong style="color: blue"> Here </strong>
    backTop.
</div>
</template>

<script>
import axios from 'axios'
export default{
    data(){
        return {
            props:['paperid'],

            paper: null,
            username: null,
        }
    },
    methods:{
        constructor(){
            this.getPaper()
            this.getUsername(this.paper.userid)
            console.log("This is in constructor()")
            console.log("Paper:" + this.paper.title + " ; Username :" + this.username)
        },
        getPaper(){
            axios.get('http://localhost:3000/paper/getpaper', this.paperid).then((res) => {
                console.log("This is in getpaper()")
                this.paper = res.data.paper
                console.log("This paper is paperid:" + this.paperid)
                console.log("This paper title is :" + this.paper.title)
            }).catch((err) => {
                console.log(err)
                this.$message.warning("This paper is not found!" ,3)
            })
        },
        getUsername(userid){
            let userlist
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                console.log("This is in getUsername()")
                userlist = res.data.users.users
                for (var user of userlist){
                    if (user.userid == userid){
                        this.username = user.username
                        break
                    }
                }
                console.log("Username :" + this.username)
            })
        },
    },
    mounted(){
        this.constructor()
    },

}

</script>

<style>

</style>