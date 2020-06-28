<template>
    <div class="comment">
        <a-list
            class="comment-list"
            :header="`共有 ${data.length} 条回复`"
            item-layout="horizontal"
            :data-source=showData
        >
            <a-list-item slot="renderItem" slot-scope="item" :id="'id' + item.blogCommentId" class="list-item">
                <a-comment :author="item.author" :avatar="item.avatar" style="width: 100%">
                    <template slot="actions">
                        <span v-for="action in item.actions" :key="action" @click="reply(item)" style="color: dodgerblue">{{ action }}</span>
                    </template>
                    <div slot="content" style="width: 100%">
                        <span v-if="item.commentType" @click="toTargetComment(item)" style="color: dodgerblue">{{'@' + item.replyCommentName}}</span>
                        {{ item.content }}
                    </div>
                    <a-tooltip slot="datetime">
                        <span style="color: grey">{{item.datetime}}</span>
                    </a-tooltip>
                </a-comment>
            </a-list-item>
        </a-list>
        <div class="comment-footer">
            <a-input id="reply" style="width:90% ; height:40px ; margin:5px 10px ; display: inline-block" type="text" :placeholder="replyHolder" v-model="content" defaultValue=content></a-input>
            <a-button type="primary"  @click="submitComment">提交</a-button>
        </div>
    </div>
</template>
<script>

    import axios from 'axios'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                data: [

                ],
                content:'',
                commentList:[],
                paper: {},
                replyHolder: '输入评论',
                replyState: false,
                replyUser: '',
                replyId: 0,
            };
        },

        computed:{
            ...mapGetters([
                'activePaperId',
                'getUserId'
            ]),
            showData:{
                get: function(){
                    return this.data
                },
                set: function(commentList){
                    this.data.splice(0)
                    for(let i=0;i<commentList.length;i++){
                        let date = commentList[i].blogCommentCreateTime.split("T")
                        let date_ymd = date[0]
                        let date_hms = date[1].substring(0,8)
                        let comment = {
                            actions: ['Reply to'],
                            author: commentList[i].userName,
                            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                            content: commentList[i].blogCommentContent,
                            datetime: date_ymd+" "+date_hms,
                            commentType: commentList[i].commentType,
                            replyCommentId: commentList[i].replyCommentId,
                            blogCommentId: commentList[i].blogCommentId,
                            replyCommentName: commentList[i].replyCommentName
                        }
                        this.data.push(comment)
                    }
                    console.log(this.data)
                }
            }
        },

        methods:{


            async getPaper(){
                let res = await axios.get('http://localhost:3000/paper/getpaper', {params: {paperId: this.activePaperId}})
                console.log('getPaper()')
                console.log(res)
                this.paper = res.data
                let time = this.paper.createTime.split("T")
                this.date_ymd = time[0]
                this.date_hms = time[1].substring(0,8)

            },


            async setCommentList(){
                console.log('setCommentList')
                let res = await axios.get('http://localhost:3000/blog_comment/get_user_comments',
                    {
                                params:{
                                    paperId:this.activePaperId
                                }
                    })
                console.log("setting comments")
                this.commentlist = res.data.commentList
                console.log(this.commentlist);
            },


            async submitComment(){
                console.log("submit")
                console.log(this.content)
                console.log(this.commentlist);
                await this.addComment()
            },


            async addComment(){
                this.paper.commentNum++
                console.log("This is addComment operation")
                const addComment={userId:null,paperId:null,content:null,createTime:null,commentType:null,replyCommentId:null}
                addComment.userId=this.getUserId
                addComment.content= this.content
                addComment.createTime=this.getServerTime()
                addComment.paperId=this.activePaperId
                addComment.commentType = this.replyState ? 1 : 0
                addComment.replyCommentId = this.replyId === 0 ? null : this.replyId
                console.log(addComment)

                this.replyState = false
                this.replyHolder = '输入评论'
                this.replyId = 0

                await axios.post('http://localhost:3000/blog_comment/add_blog_comment',addComment)
                let res = await axios.get('http://localhost:3000/blog_comment/get_user_comments',
                    {
                                params:{
                                    paperId:this.activePaperId
                                }
                    })
                console.log("getting comments")
                this.commentlist = res.data.commentList
                console.log(this.commentlist)
                this.showData=this.commentlist
                this.$message.success('评论成功!', 2)
                this.content=''
                await this.savePaperState()

            },


            getServerTime(){
                let d = new Date()
                let year = d.getFullYear()
                let month = ('0' + (d.getMonth() + 1)).slice(-2)
                let day = ('0' + (d.getDate())).slice(-2)
                let hour = ('0' + ((d.getHours() + 8) % 24)).slice(-2)  // UTC +08:00
                let minutes = ('0' + (d.getMinutes())).slice(-2)
                let seconds = ('0' + (d.getSeconds())).slice(-2)
                return year + "-" + month + "-" + day + " " + hour + "-" + minutes + "-" + seconds
            },

            async savePaperState(){
                await axios.post('http://localhost:3000/paper/updatePaperComment',{
                    paperId: this.activePaperId,
                    commentNum: this.paper.commentNum,
                })
                console.log("This is in save-paper-state operation")

            },

            reply(item){
                console.log("reply")
                this.replyHolder = "Reply to " + item.author + " :"
                this.replyState = true
                this.replyUser = item.author
                this.replyId = item.blogCommentId
                console.log(this.replyId)
                let dom = document.querySelector('#reply')
                dom.scrollIntoView({
                    block: "center",
                    behavior: 'smooth'
                })
                let reply = document.getElementById('reply')
                reply.focus()
            },

            toTargetComment(item) {
                console.log('hello')
                let dom = document.querySelector('#id' + item.replyCommentId)
                dom.scrollIntoView({
                    block: "center",
                    behavior: 'smooth'
                })
            }

        },


        async mounted(){
            await this.getPaper()
            await this.setCommentList()
            this.showData=this.commentlist
        }


    };
</script>

<style scoped>
    .comment {
        border: #dddddd 1px solid;
    }
    .comment-list {
        margin: 10px;
    }
    .comment-footer {

    }
    .list-item {
        border: #dddddd solid;
        box-shadow: 10px 10px 5px #cccccc;
        padding: 20px 20px;
        border-radius: 30px;
        margin-bottom: 10px;
        margin-top: 10px;
    }

</style>
