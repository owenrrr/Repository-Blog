<template>
    <a-list
            class="comment-list"
            :header="`${data.length} replies`"
            item-layout="horizontal"
            :data-source="data"
    >
        <a-list-item slot="renderItem" slot-scope="item">
            <a-comment :author="item.author" :avatar="item.avatar">
                <template slot="actions">
                    <span v-for="action in item.actions" :key="action">{{ action }}</span>
                </template>
                <p slot="content">
                    {{ item.content }}
                </p>
                <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                    <span style="color: grey">{{ item.datetime.fromNow() }}</span>
                </a-tooltip>
            </a-comment>
        </a-list-item>
        <a-input style="width:80% ; height:40px ; margin:5px 10px ; display: inline-block" type="text" placeholder="comment" v-model="content"></a-input>
        <a-button type="primary" @click="submitcomment">submit</a-button>
    </a-list>
</template>
<script>
    import moment from 'moment';
    import axios from 'axios'
    export default {
        data() {
            return {
                data: [
                    {
                        actions: ['Reply to'],
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content:
                            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                        datetime: moment().subtract(1, 'days'),
                    },
                    {
                        actions: ['Reply to'],
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content:
                            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                        datetime: moment().subtract(2, 'days'),
                    },
                ],
                moment,
                content:'',
            };
        },

        methods:{


            submitcomment(){
                console.log("submit")
                console.log(this.content)
                this.addcomment()
                this.$message.success('Submit success!', 2)
            },

            addcomment(){
                console.log("This is addcomment operation")
                const addcomment={userId:null,paperId:null,content:null,createTime:null}
                addcomment.userId=this.$store.getters.getUserid
                addcomment.content=this.content
                var time=this.getServerTime()
                addcomment.createTime=time
                addcomment.paperId=this.$store.getters.getPaperid
                console.log(addcomment)
                axios.post('http://localhost:3000/blog_comment/add_blog_comment',addcomment)
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

        }
    };
</script>
