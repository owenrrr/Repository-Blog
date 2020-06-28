<template>
    <div>
        <div class="article-header">
            <a-button type="default" @click="back"><a-icon type="left"/>返回上一页</a-button>
            <div style=" font-size: 30px; margin-top: 20px"><i>{{ paper.title }}</i></div>
            <div class="atom">
                <div class="atom-atom">
                    <p style="font-size: 15px">{{'作者: ' + userName }}</p>
                    <a-button style="margin-left: 10px" type="dashed" v-if="followState&&!isMe" @click="removeFollow">已关注</a-button>
                    <a-button style="margin-left: 10px" type="primary" v-if="!followState&&!isMe" @click="follow">关注作者</a-button>
                </div>
                <div>
                    <span style="margin-right: 20px; float: right;">
                        <a-icon type="calendar" style="margin-right: 10px;" />{{ date_ymd + " " + date_hms }}
                    </span>
                    <span style="margin-right: 20px; float: right;" >
                        <a-icon type="star" v-bind:theme="isFavorite()" style="margin-right: 10px" @click="addStar"/>{{ paper.starNum }}
                    </span>
                    <span style="margin-right: 20px; float: right;">
                        <a-icon type="like" v-bind:theme="isLike()" style="margin-right: 10px"  @click="addLike"/>{{ paper.likeNum }}
                    </span>
                </div>
            </div>
        </div>
        <div v-html="paper.content" class="content">
        </div>
        <div style="min-height: 300px">
            <comment style="width: 100%;"></comment>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import comment from './comment'
    import {mapGetters} from 'vuex'

    export default{
        data(){
            return {
                isMe: false,
                paper: {},
                userName: '',
                date_ymd:'',
                date_hms:'',
                starState: false, // 0: 没加 ; 1：有加
                likeState: false,
                followState: false,
            }
        },
        computed: {
            ...mapGetters([
                'activePaperId',
                'getUserId'
            ])
        },
        methods:{

            async checkisMe(){
                const res = await axios.get('http://localhost:3000/paper/getauthorId',{params:{paperId:this.activePaperId}})
                let author = res.data
                if(this.getUserId==author){
                    this.isMe = true
                }
            },

            back(){
                this.$router.back()
            },

            async isFollow(){
                const res1 = await axios.get('http://localhost:3000/paper/getauthorId',{params:{paperId:this.activePaperId}})
                let followid = res1.data
                const res2 = await axios.get('http://localhost:3000/follow/check', {params:{userId:this.getUserId,followId:followid}})
                this.followState = res2.data ? true : false
            },

            async removeFollow(){
                var msg = "您确定要取消关注吗？"
                if(confirm(msg)==true){
                    this.followState=false
                    const res = await axios.get('http://localhost:3000/paper/getauthorId',{params:{paperId:this.activePaperId}})
                    let followid = res.data
                    console.log(followid);
                    await axios.post('http://localhost:3000/follow/removeFollow',{
                        userId:this.getUserId,
                        followId:followid
                    })
                    this.$message.success('取消关注成功', 2)
                }
            },

            async follow(){
                this.followState=true
                const res = await axios.get('http://localhost:3000/paper/getauthorId',{params:{paperId:this.activePaperId}})
                let followid = res.data
                await axios.post('http://localhost:3000/follow/addFollow',{
                    userId:this.getUserId,
                    followId:followid
                })
                this.$message.success('关注成功', 2)
            },

            async setLikeState(){
                const res = await axios.get('http://localhost:3000/like/checkLike',
                    {
                                params:{
                                    paperId: this.activePaperId,
                                    userId: this.getUserId
                                }
                    })
                console.log(res)
                this.likeState = res.data ? 1 : 0
            },

            async setFavoriteState(){
                const res = await axios.get('http://localhost:3000/favorite/checkFavorite',
                    {
                                params:{
                                    paperId: this.activePaperId,
                                    userId: this.getUserId
                                }
                    })
                console.log(res)
                this.starState = res.data ? 1 : 0
            },

            isFavorite(){
                if(this.starState===1){
                    return "twoTone"
                }
                else{
                    return "outlined"
                }
            },

            isLike(){
                if(this.likeState===1){
                    return "twoTone"
                }
                else{
                    return "outlined"
                }
            },

            async getPaper(){
                let res = await axios.get('http://localhost:3000/paper/getpaper', {params: {paperId: this.activePaperId}})
                console.log("This is in getPaper()")
                console.log(res)
                this.paper = res.data
                console.log("This paper paperId is :" + this.paperId)
                console.log("This paper title is :" + this.paper.title)
                console.log("This is content:" + this.paper.content)
                let time = this.paper.createTime.split("T")
                this.date_ymd = time[0]
                this.date_hms = time[1].substring(0,8)
                console.log(this.date_ymd)
                console.log(this.date_hms)
                await this.getUsername()

            },

            async getUsername(){
                let userInfo
                let res = await axios.get('http://localhost:3000/user/getUserById', {params: {userId: this.paper.userId}})
                console.log("This is in getUsername()")
                userInfo = res.data
                console.log(userInfo)
                this.userName = userInfo.userName
                console.log("Username :" + this.userName)
            },

            async addStar(){
                if (this.starState === 0){
                    console.log("This is starState = 0 operation")
                    this.$message.success("已收藏", 2)
                    console.log("userId : " + this.getUserId)
                    await axios.post('http://localhost:3000/favorite/addfavorite', {
                        paperId: this.activePaperId,
                        userId: this.getUserId,
                        createTime: this.date_ymd + " " + this.date_hms,
                    })
                    console.log("This is in add-star operation")
                    this.paper.starNum++
                    this.starState = 1
                    await this.savePaperState()

                }else{
                    console.log("This is starState = 1 operation")
                    this.$message.success("取消收藏", 2)
                    await axios.post('http://localhost:3000/favorite/removefavorite', {
                        userId: this.getUserId,
                        paperId: this.activePaperId,
                    })
                    console.log("This is in cancel-star operation")
                    this.paper.starNum--
                    this.starState = 0
                    await this.savePaperState()
                }
            },

            async addLike(){
                if(this.likeState === 0){
                    console.log("This is likeState = 0 operation")
                    this.$message.success("已点赞", 2)
                    console.log("userId : "+this.getUserId)
                    await axios.post('http://localhost:3000/like/addlike',{
                        paperId:this.activePaperId,
                        userId:this.getUserId,
                        createTime:this.date_ymd+" "+this.date_hms,
                    })
                    console.log("This is in add like operation")
                    this.paper.likeNum++
                    this.likeState = 1
                    await this.savePaperState()
                }
                else{
                    console.log("This is likeState = 1 operation")
                    this.$message.success("取消点赞",2)
                    await axios.post('http://localhost:3000/like/removelike',{
                        paperId:this.activePaperId,
                        userId:this.getUserId,
                    })
                    console.log("This is in remove like operation")
                    this.paper.likeNum--
                    this.likeState = 0
                    await this.savePaperState()
                }
            },

            async savePaperState(){
                //  在此组件中只会出现star,like,comment改变，其余不变
                await axios.post('http://localhost:3000/paper/updatePaperLikeAndStar',{
                    paperId: this.activePaperId,
                    starNum: this.paper.starNum,
                    likeNum: this.paper.likeNum,
                })
                console.log("This is in save-paper-state operation")

            },

        },
        async mounted(){
            await this.checkisMe()
            await this.isFollow()
            await this.setLikeState()
            await this.setFavoriteState()
            await this.getPaper();
        },
        components:{
            comment,
        }

    }

</script>

<style>
    .atom {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .atom-atom {
        display: flex;
        justify-content: center;
        align-items: baseline;
    }
    .content {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #eeeeee;
        font-size: 16px;
        color: #2c3e50;
        min-height: 500px;
        padding: 20px;
        border: #dddddd 1px solid;
    }
    .content h1, h2, h3{
        text-align: center;
        font-size: 30px;
    }

    .article-header {
        border: #dddddd 1px solid;
        padding: 10px;
        min-height: 200px;
    }


</style>