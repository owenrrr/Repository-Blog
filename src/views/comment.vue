<template>
    <a-list
            class="comment-list"
            :header="`${data.length} replies`"
            item-layout="horizontal"
            :data-source=showData
    >
        <a-list-item slot="renderItem" slot-scope="item">
            <a-comment :author="item.author" :avatar="item.avatar">
                <template slot="actions">
                    <span v-for="action in item.actions" :key="action">{{ action }}</span>
                </template>
                <p slot="content">
                    {{ item.content }}
                </p>
                <a-tooltip slot="datetime">
                    <span style="color: grey">{{ item.datetime}}</span>
                </a-tooltip>
            </a-comment>
        </a-list-item>
        <a-input style="width:80% ; height:40px ; margin:5px 10px ; display: inline-block" type="text" placeholder="comment" v-model="content"></a-input>
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

                content:'',
                commentlist:[],
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
                        let comment = {
                            actions: ['Reply to'],
                            author: commentlist[i].userId,
                            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                            content: commentlist[i].blogCommentContent,
                            datetime: commentlist[i].blogCommentCreateTime
                        }
                        this.data.push(comment)
                    }
                }
            }
        },

        methods:{


            getUsername(userid){
                let userlist
                axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                    console.log("This is in getUsername()")
                    userlist = res.data.users.users
                    for (var user of userlist){
                        if (user.userid === userid){
                            console.log(user.username)
                            return user.username
                        }
                    }
                })
            },

            setcommentlist(){
                return axios.get('http://localhost:3000/blog_comment/get_user_comments',{params:{paperId:this.$store.getters.getPaperid}}).then((res)=>{
                    console.log("getting comments")
                    console.log(res);
                    this.commentlist=res.data.comments.commentList
                    console.log(this.commentlist);
                })
            },


            async submitcomment(){
                console.log("submit")
                console.log(this.content)
                console.log(this.commentlist);
                await this.addcomment()
            },

            async addcomment(){
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
                        console.log(res);
                        this.commentlist=res.data.comments.commentList
                        console.log(this.commentlist);
                        this.showData=this.commentlist
                        this.$message.success('Submit success!', 2)
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

        },

        async mounted(){
            await this.setcommentlist()
            this.showData=this.commentlist
        }
    };
</script>
