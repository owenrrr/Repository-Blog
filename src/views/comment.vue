<template>
    <a-list
            class="comment-list"
            :header="`共有 ${data.length} 条回复`"
            item-layout="horizontal"
            :data-source=showData
    >
        <a-list-item slot="renderItem" slot-scope="item" :id="item.blogCommentId">
            <a-comment :author="item.author" :avatar="item.avatar" style="width: 100%">
                <template slot="actions">
                    <a href="#reply" v-for="action in item.actions" :key="action" @click="reply(item)">{{ action }}</a>
                </template>
                <div slot="content">
                    <div v-if="item.commentType">@<a :href="'#' + item.replyCommentId">{{item.replyCommentName}}</a></div>
                    {{ item.content }}
                </div>
                <a-tooltip slot="datetime">
                    <span style="color: grey">{{ item.datetime}}</span>
                </a-tooltip>
            </a-comment>
        </a-list-item>
        <a-input id="reply" style="width:80% ; height:40px ; margin:5px 10px ; display: inline-block" type="text" :placeholder="replyHolder" v-model="content" defaultValue=content></a-input>
        <a-button type="primary" @click="submitcomment">submit</a-button>
    </a-list>
</template>
<script>

    import axios from 'axios'

    export default {
        data() {
            return {
                data: [
                    {
                        actions: ['Reply to'],
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: '',
                        datetime: '',
                        commentType: 0,
                        replyCommentId: 0,
                    }
                ],
                content:'',
                commentlist:[],
                username:[],
                userlist:[],
                paper: {},
                replyHolder: '输入评论',
                replyState: false,
                replyUser: '',
                replyId: 0,
            };
        },

        computed:{
            showData:{
                get: function(){
                    return this.data
                },
                set: function(commentlist){
                    this.data.splice(0)
                    for(let i=0;i<commentlist.length;i++){
                        let date = commentlist[i].blogCommentCreateTime.split("T")
                        let date_ymd = date[0]
                        let date_hms = date[1].substring(0,8)
                        let comment = {
                            actions: ['Reply to'],
                            author: commentlist[i].username,
                            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                            content: commentlist[i].blogCommentContent,
                            datetime: date_ymd+" "+date_hms,
                            commentType: commentlist[i].commentType,
                            replyCommentId: commentlist[i].replyCommentId,
                            blogCommentId: commentlist[i].blogCommentId,
                            replyCommentName: commentlist[i].replyCommentName
                        }
                        this.data.push(comment)
                    }
                }
            }
        },

        methods:{


            async getPaper(){
                let paperlist
                let res = await axios.get('http://localhost:3000/paper/getpaperlist').catch((err) => {
                    console.log(err)
                    this.$message.warning("This paper is not found!" ,3)
                })
                console.log('getPaper()')
                console.log(res)
                this.paperid = this.$store.getters.getPaperid
                paperlist = res.data.papers.papers
                for (var paper of paperlist){
                    if (paper.paperid === this.paperid){
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
                var a1 = this.paper.createtime.split("T")
                this.date_ymd = a1[0]
                this.date_hms = a1[1].substring(0,8)

            },


            async getUserlist(){
                console.log("getting userlist")

                let res = await axios.get('http://localhost:3000/user/getuserlist')

                this.userlist=res.data.userList

                console.log(this.userlist)
            },


            async setcommentlist(){
                console.log('setcommentlist')
                let res = await axios.get('http://localhost:3000/blog_comment/get_user_comments',{params:{paperId:this.$store.getters.getPaperid}})
                console.log("setting comments")
                this.commentlist=res.data.commentList
                console.log(this.commentlist);
                for(let i=0;i<this.commentlist.length;i++){
                    for(let j=0;j<this.userlist.length;j++){
                        if(this.userlist[j].userid===this.commentlist[i].userId){
                            let comment ={
                                username:this.userlist[j].username,
                                blogCommentContent: this.commentlist[i].blogCommentContent,
                                blogCommentCreateTime: this.commentlist[i].blogCommentCreateTime,
                                commentType: this.commentlist[i].commentType,
                                replyCommentId: this.commentlist[i].replyCommentId,
                                blogCommentId: this.commentlist[i].blogCommentId,

                            }
                            console.log(comment);
                            this.commentlist[i]=comment
                            break
                        }
                    }
                }
                for (let i = 0; i < this.commentlist.length; i++) {
                    if (this.commentlist[i].commentType === 0) {
                        this.commentlist[i].replyCommentName = null
                    }
                    else if (this.commentlist[i].commentType === 1) {
                        let replyId = this.commentlist[i].replyCommentId
                        let comment;
                        for (let j = 0; j < this.commentlist.length; j++) {
                            if (replyId === this.commentlist[j].blogCommentId) {
                                comment = this.commentlist[j]
                                break
                            }
                        }
                        this.commentlist[i].replyCommentName = comment.username
                    }
                }
                console.log(this.commentlist)
            },


            async submitcomment(){
                console.log("submit")
                console.log(this.content)
                console.log(this.commentlist);
                await this.addcomment()
            },


            async addcomment(){
                this.paper.commentnum++
                console.log("This is addcomment operation")
                const addcomment={userId:null,paperId:null,content:null,createTime:null,commentType:null,replyCommentId:null}
                addcomment.userId=this.$store.getters.getUserid
                addcomment.content= this.content
                var time=this.getServerTime()
                addcomment.createTime=time
                addcomment.paperId=this.$store.getters.getPaperid
                addcomment.commentType = this.replyState ? 1 : 0
                addcomment.blogCommentId = this.replyId === 0 ? null : this.replyId
                console.log(addcomment)

                this.replyState = false
                this.replyHolder = '输入评论'
                this.replyId = 0

                await axios.post('http://localhost:3000/blog_comment/add_blog_comment',addcomment)
                let res = await axios.get('http://localhost:3000/blog_comment/get_user_comments',{params:{paperId:this.$store.getters.getPaperid}})
                console.log("getting comments")
                let comments = res.data.commentList
                console.log(comments)
                console.log(this.userlist)
                for(let i=0;i<comments.length;i++){
                    for(let j=0;j<this.userlist.length;j++){
                        if(this.userlist[j].userid=== comments[i].userId){
                            let comment ={
                                username:this.userlist[j].username,
                                blogCommentContent: comments[i].blogCommentContent,
                                blogCommentCreateTime: comments[i].blogCommentCreateTime,
                                commentType: comments[i].commentType,
                                replyCommentId: comments[i].replyCommentId,
                                blogCommentId: comments[i].blogCommentId
                            }
                            console.log(comment);
                            this.commentlist[i]=comment
                            break
                        }
                    }
                }
                for (let i = 0; i < this.commentlist.length; i++) {
                    if (this.commentlist[i].commentType === 0) {
                        this.commentlist[i].replyCommentName = null
                    }
                    else if (this.commentlist[i].commentType === 1) {
                        let replyId = this.commentlist[i].replyCommentId
                        let comment;
                        for (let j = 0; j < this.commentlist.length; j++) {
                            if (replyId === this.commentlist[j].blogCommentId) {
                                comment = this.commentlist[j]
                                break
                            }
                        }
                        this.commentlist[i].replyCommentName = comment.username
                    }
                }
                console.log(this.commentlist)
                this.showData=this.commentlist
                this.$message.success('Submit success!', 2)
                this.content=''
                await this.savePaperState()

            },


            getServerTime(){
                var d = new Date()
                var year = d.getFullYear()
                var month = ('0' + (d.getMonth() + 1)).slice(-2)
                var day = ('0' + (d.getDate())).slice(-2)
                var hour = ('0' + ((d.getHours() + 8) % 24)).slice(-2)  // UTC +08:00
                var minutes = ('0' + (d.getMinutes())).slice(-2)
                var seconds = ('0' + (d.getSeconds())).slice(-2)
                return year + "-" + month + "-" + day + " " + hour + "-" + minutes + "-" + seconds
            },

            savePaperState(){
                console.log(typeof(this.paper.paperid))
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

            reply(item){
                console.log("reply")
                this.replyHolder = "Reply to " + item.author + " :"
                this.replyState = true
                this.replyUser = item.author
                this.replyId = item.blogCommentId
                console.log(this.replyId)
            }

        },


        async mounted(){
            await this.getPaper()
            await this.getUserlist()
            await this.setcommentlist()
            this.showData=this.commentlist
        }


    };
</script>
