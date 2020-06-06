<template>
<div id="components-layout-demo-basic">
<a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout>
        <a-layout-header>
            <div style="float: left; font-size: 50px; width: 100%; color:blueviolet;"><i style="float: left; margin-top: 20px">{{ paper.title }}</i></div>
            <div style="float: left; font-size: 15px; width: 100%;">
                <p style="float: left; margin-right: 200px; font-size: 25px">{{ username }}</p>
                <div>
                    <span style="margin-right: 20px; float: right;">
                        <a-icon type="calendar" style="margin-right: 10px;" />{{ date_ymd + " " + date_hms }}
                    </span>
                    <span style="margin-right: 20px; float: right;">
                        <a-icon type="star" style="margin-right: 10px" @click="addStar(starstate)"/>{{ paper.starnum }}
                    </span>
                    <span style="margin-right: 20px; float: right;">
                        <a-icon type="like" style="margin-right: 10px" @click="addLike(liekstate)"/>{{ paper.likenum }}
                    </span>
                </div>
            </div>
        </a-layout-header>
        <a-layout-content>
            <div v-html="paper.content" style="float: left; margin-left: 50px;">
            </div>
            <div style="float: left; width: 100%; position: relative; top: 200px">
                <a-back-top />Click
                    <strong style="color:lightgray"> Here </strong>
                backTop.
            </div>
        </a-layout-content>
        <a-layout-footer>Design ©2020 Created by Lzy</a-layout-footer>
    </a-layout>
</a-layout>
</div>
<!-- <div>
    <p style="height: 100px; width: 100%; color:blueviolet; font-size: 50px; font-family:PingFangSC-Regular,Verdana,Arial;">{{ paper.title }}</p>
    <h1 style="font-style:oblique; margin: 20px 0px; display: inline-block">{{ username }}</h1>
    <h2 style="display: inline-block">by {{ paper.createtime }}</h2>
    <div>
        <h1  v-html="paper.content"></h1>
    </div>
    <span>
        <a-icon type="star" style="margin-right: 8px" />
          {{ paper.starnum }}
    </span>
    <span>
        <a-icon type="like" style="margin-right: 8px" />
          {{ paper.likenum }}
    </span>
    <span>
        <a-icon type="message" style="margin-right: 8px" />
          {{ paper.commentnum }}
    </span>
    <a-back-top />
    Click
    <strong style="color: blue"> Here </strong>
    backTop.
</div> -->
</template>

<script>
import axios from 'axios'
export default{
    data(){
        return {
            paperid: 0,
            paper: {},
            username: '',
            date_ymd:'',
            date_hms:'',
            starstate: 0, // 0: 没加 ; 1：有加
            liekstate: 0,
        }
    },
    methods:{
        constructor(){
            console.log("This is in constructor()")
            this.paperid = this.$store.getters.getPaperid
            console.log()
            this.getPaper()
            console.log("Paper:" + this.paper.title + " ; Username :" + this.username)
        },
        getPaper(){
            let paperlist
            axios.get('http://localhost:3000/paper/getpaperlist').then((res) => {
                console.log("This is in getpaper()")
                paperlist = res.data.papers.papers
                for (var paper of paperlist){
                    if (paper.paperid == this.paperid){
                        var tmp = {paperid: null, userid: null, title: null, starnum: null, likenum: null, commentnum: null, createtime: null, content: null}
                        tmp.paperid = this.paperid
                        tmp.userid = paper.userid
                        tmp.title = paper.title
                        tmp.starnum = paper.starnum
                        tmp.likenum = paper.likenum
                        tmp.commentnum = paper.commentnum
                        tmp.createtime = paper.createtime
                        tmp.content = paper.content
                        this.paper = tmp
                        break;
                    }
                }
                console.log("This paper is paperid:" + this.paperid)
                console.log("This paper title is :" + this.paper.title)
                console.log("This is content:" + this.paper.content)
                var a1 = this.paper.createtime.split("T")
                this.date_ymd = a1[0]
                this.date_hms = a1[1].substring(0,8)
                console.log(this.date_ymd)
                console.log(this.date_hms)
                this.getUsername(this.paper.userid)
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
        // addStar(){
        //     if (this.starstate == 0){
        //         this.paper.starnum++
        //         this.starstate = 1
        //         setTimeout(this.$message.success("Store Success !", 2), 2000).then(() => {
        //             // axios.post(/add)

        //         })

                

        //     }else{
        //         this.paper.starnum--
        //         this.starstate = 0
                
        //     }
            
        // },
        // addLike(){
        //     this.paper.likenum++
        // },
    },
    mounted(){
        this.constructor()
    },

}

</script>

<style>
/* body::-webkit-scrollbar {
    display:none
} */
#components-layout-demo-basic {
  text-align: center;
}
.ant-layout::-webkit-scrollbar {
    display: none;
}
#components-layout-demo-basic .ant-layout-footer,
#components-layout-demo-basic .ant-layout-header {
    min-height: 150px;
    background-color:lightgray;
}
/* #components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
} */
#components-layout-demo-basic .ant-layout-sider {
  /* 'C:/Users/Owen Liu/Desktop/Repository-Blog/src/assets/tree.jpg' */
  line-height: 120px;
  min-height: 700px;
  background: url('../assets/water.jpg');
  background-size: cover;
}
#components-layout-demo-basic .ant-layout-content {
  background-color:aliceblue;
  min-height: 120px;
  line-height: 120px;
}
/* #components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
} */
/* #components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
} */
</style>