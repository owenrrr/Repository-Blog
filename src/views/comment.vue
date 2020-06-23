<template>
    <a-list
            class="comment-list"
            :header="`${data.length} replies`"
            item-layout="horizontal"
            :data-source=showData
            :pagination="pagination"
    >
        <a-list-item slot="renderItem" slot-scope="item">
            <a-comment :author="item.author" :avatar="item.avatar">
                <template slot="actions">
                    <a href="#reply" v-for="action in item.actions" :key="action" @click="reply">{{ action }}</a>
                </template>
                <p slot="content" style="width:60%" align="left">
                    {{ item.content }}
                </p>
                <a-tooltip slot="datetime">
                    <span style="color: grey">{{ item.datetime}}</span>
                </a-tooltip>
            </a-comment>
        </a-list-item>
        <a-input id="reply" style="width:80% ; height:40px ; margin:5px 10px ; display: inline-block" type="text" placeholder="Enter comment" v-model="content" defaultValue=content></a-input>
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
                        datetime: ''
                    }
                ],
                pagination: {
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 5,
                },
                content:'',
                commentlist:[],
                username:[],
                userlist:[],
                paper: {},
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
                            datetime: date_ymd+" "+date_hms
                        }
                        this.data.push(comment)
                    }
                }
            }
        },

        methods:{


            getPaper(){
                let paperlist
                return axios.get('http://localhost:3000/paper/getpaperlist').then((res) => {
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
                    var a1 = this.paper.createtime.split("T")
                    this.date_ymd = a1[0]
                    this.date_hms = a1[1].substring(0,8)
                }).catch((err) => {
                    console.log(err)
                    this.$message.warning("This paper is not found!" ,3)
                })
            },


            getUserlist(){
                return axios.get('http://localhost:3000/user/getuserlist').then((res)=>{
                    console.log("getting userlist")
                    this.userlist=res.data.users.users
                    console.log(this.userlist)
                })
            },


            setcommentlist(){
                return axios.get('http://localhost:3000/blog_comment/get_user_comments',{params:{paperId:this.$store.getters.getPaperid}}).then((res)=>{
                    console.log("setting comments")
                    this.commentlist=res.data.comments.commentList
                    console.log(this.commentlist);
                    for(let i=0;i<this.commentlist.length;i++){
                        for(let j=0;j<this.userlist.length;j++){
                            if(this.userlist[j].userid==this.commentlist[i].userId){
                                let comment ={
                                    username:this.userlist[j].username,
                                    blogCommentContent: this.commentlist[i].blogCommentContent,
                                    blogCommentCreateTime: this.commentlist[i].blogCommentCreateTime
                                }
                                console.log(comment);
                                this.commentlist[i]=comment
                                break
                            }
                        }
                    }
                })
            },


            async submitcomment(){
                console.log("submit")
                console.log(this.content)
                console.log(this.commentlist);
                await this.addcomment()
            },


            addcomment(){
                this.paper.commentnum++
                console.log("This is addcomment operation")
                const addcomment={userId:null,paperId:null,content:null,createTime:null}
                addcomment.userId=this.$store.getters.getUserid
                addcomment.content=this.content
                var time=this.getServerTime()
                addcomment.createTime=time
                addcomment.paperId=this.$store.getters.getPaperid
                console.log(addcomment)
                axios.post('http://localhost:3000/blog_comment/add_blog_comment',addcomment).then(() => {
                    axios.get('http://localhost:3000/blog_comment/get_user_comments',{params:{paperId:this.$store.getters.getPaperid}}).then((res)=>{
                        console.log("getting comments")
                        this.commentlist=res.data.comments.commentList
                        for(let i=0;i<this.commentlist.length;i++){
                            for(let j=0;j<this.userlist.length;j++){
                                if(this.userlist[j].userid==this.commentlist[i].userId){
                                    let comment ={
                                        username:this.userlist[j].username,
                                        blogCommentContent: this.commentlist[i].blogCommentContent,
                                        blogCommentCreateTime: this.commentlist[i].blogCommentCreateTime
                                    }
                                    console.log(comment);
                                    this.commentlist[i]=comment
                                    break
                                }
                            }
                        }
                        this.showData=this.commentlist
                        this.$message.success('Submit success!', 2)
                        this.content=''
                    }).then(()=>{
                        this.savePaperState()
                    })
                })
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

            reply(){
                console.log("reply")
                this.content = "Reply to Owen :"

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
