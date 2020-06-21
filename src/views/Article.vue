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
                    <span style="margin-right: 20px; float: right;" >
                        <a-icon type="star" v-bind:theme="isfavourite()" style="margin-right: 10px" @click="addStar"/>{{ paper.starnum }}
                    </span>
                    <span style="margin-right: 20px; float: right;">
                        <a-icon type="like" v-bind:theme="islike()" style="margin-right: 10px"  @click="addLike"/>{{ paper.likenum }}
                    </span>
                </div>
            </div>
        </a-layout-header>
        <a-layout-content>
            <div v-html="paper.content" style="float: left; margin-left: 50px; width:80%;" align="left">
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            <comment style="width: 100%; height: auto; display: inline-block"></comment>
            <div style="display: inline-block">Design ©2020 Created by Lzy</div>
        </a-layout-footer>
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
import comment from './comment'
export default{
    data(){
        return {
            paperid: 0,
            paper: {},
            username: '',
            date_ymd:'',
            date_hms:'',
            starstate: 0, // 0: 没加 ; 1：有加
            likestate: 0,
            like: [],
            favourite: []
        }
    },
    methods:{

        async setlike(){
            const res = await axios.get('http://localhost:3000/like/getuserlist',{params:{paperId:this.$store.getters.getPaperid}})
            this.like = res.data.users.userList
        },

        async setfavourite(){
            const res = await axios.get('http://localhost:3000/favorite/getuserlist',{params:{paperId:this.$store.getters.getPaperid}})
            this.favourite = res.data.users.userList
        },

        checkstate(){
            let user = this.$store.getters.getUserid
            for(let i=0; i<this.like.length; i++){
                if(user==this.like[i].userId){
                    this.likestate=1
                    break
                }
            }
            for(let i=0; i<this.favourite.length; i++){
                if(user==this.favourite[i].userId){
                    this.starstate=1
                    break
                }
            }
        },

        isfavourite(){
            if(this.starstate==1){
                return "twoTone"
            }
            else{
                return "outlined"
            }
        },

        islike(){
            if(this.likestate==1){
                return "twoTone"
            }
            else{
                return "outlined"
            }
        },

        getPaper(){
            let paperlist
            return axios.get('http://localhost:3000/paper/getpaperlist').then((res) => {
                console.log("This is in getpaper()")
                this.paperid = this.$store.getters.getPaperid
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
                    if (user.userid === userid){
                        this.username = user.username
                        break
                    }
                }
                console.log("Username :" + this.username)
            })
        },
        addStar(){
            if (this.starstate === 0){
                console.log("This is starstate = 0 operation")
                this.$message.success("Store Success !", 2)
                console.log("Userid : " + this.$store.getters.getUserid)
                axios.post('http://localhost:3000/favorite/addfavorite', {
                    paperId: this.paper.paperid, 
                    userId: this.$store.getters.getUserid, 
                    createTime: this.date_ymd + " " + this.date_hms,
                }).then(() => {
                    console.log("This is in add-star operation")
                    this.paper.starnum++
                    this.starstate = 1
                }).then(() => {this.savePaperState()})

            }else{
                axios.post('http://localhost:3000/favorite/removefavorite', {
                    userId: this.$store.getters.getUserid,
                    paperId: this.paper.paperid,
                }).then(() => {
                    console.log("This is in cancel-star operation")
                    this.paper.starnum--
                    this.starstate = 0
                }).then(() => {this.savePaperState()})
            }
        },

        addLike(){
            if(this.likestate==0){
                console.log("This is likestate = 0 operation")
                this.$message.success("Like Success!", 2)
                console.log("Userid : "+this.$store.getters.getUserid)
                axios.post('http://localhost:3000/like/addlike',{
                    paperId:this.paper.paperid,
                    userId:this.$store.getters.getUserid,
                    createTime:this.date_ymd+" "+this.date_hms,
                }).then(()=>{
                    console.log("This is in add like operation")
                    this.paper.likenum++
                    this.likestate = 1
                }).then(()=>{this.savePaperState()})
            }
            else{
                this.$message.success("Like Removed",2)
                axios.post('http://localhost:3000/like/removelike',{
                    paperId:this.paper.paperid,
                    userId:this.$store.getters.getUserid,
                }).then(()=>{
                    console.log("This is in remove like operation")
                    this.paper.likenum--
                    this.likestate = 0
                }).then(()=>{this.savePaperState()})
            }
        },

        savePaperState(){
            console.log(typeof(this.paper.paperid))
            //  在此组件中只会出现star,like,comment改变，其余不变
            axios.post('http://localhost:3000/paper/updatepaper',{
                paperid: this.paper.paperid,
                userid: this.paper.userid,
                starnum: this.paper.starnum,
                likenum: this.paper.likenum,
                commentnum: this.paper.commentnum,
                title: this.paper.title,
                createtime: this.date_ymd + " " + this.date_hms,
                content: this.paper.content
            }).then(()=>{
                console.log("This is in save-paper-state operation")
            })
        },
        getstar(){
            return axios.get('http://localhost:3000/favorite/getuserlist',{params:{
                paperId: this.paperid
            }}).then((res) => {
                console.log("This is in get-star operation")
                console.log(res)
                var userlist = res.data.users.userlist
                console.log(userlist)
                var userid = this.$store.getters.getUserid
                for (var user of userlist){
                    if (userid === user.userId){
                        console.log('user has already stared this paper');
                        this.starstate = 1
                    }
                }
                console.log("paper hasn't been stored by this user");
                this.starstate = 0;
            }).catch((err) => {
                console.log(err)
            })
        },
        getlike(){
            return axios.get('http://localhost:3000/like/getuserlist',
                { params: { paperId: this.paperId}}
            ).then((res) => {
                console.log("This is in get-like operation");
                console.log(res);
                let userList = res.data.users.userList;
                console.log(userList);
                let userId = this.$store.getters.getUserid;
                for (let user of userList) {
                    if (userId === user) {
                        console.log('user has already liked this paper');
                        this.liekstate = 1;
                    }
                }
                console.log("paper hasn't been stored by this user");
                this.liekstate = 0;
            }).catch(err => {
                console.log(err);
            });
        },
    },
    async mounted(){
        await this.setlike()
        await this.setfavourite()
        this.checkstate()
        await this.getPaper();
        await this.getstar();
        await this.getlike();
    },
    components:{
        comment,
    }

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