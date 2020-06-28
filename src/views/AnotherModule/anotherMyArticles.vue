<template>
    <div class="main">
        <div class="list">
            <a-list item-layout="vertical" size="large" :data-source="listData">
                <a-list-item slot="renderItem" key="item.title" slot-scope="item" class="articles-list-item">
                    <a-list-item-meta>
                        <!-- 先试试查看文章细看页面有无错误 更动click及herf :href="item.href"-->
                        <a slot="title" @click="commitPaperId(item.paperId)">{{ item.title }}</a>
                        <a-avatar slot="avatar" size="large" :style="{backgroundColor: item.color}">{{item.userName}}</a-avatar>
                    </a-list-item-meta>
                    <template>
                        <span>
                            <a-icon type="star-o" style="margin-right: 8px"/>
                            {{ actions[item.index].text1 }}
                        </span>
                        <span>
                            <a-icon type="like-o" style="margin-right: 8px"/>
                            {{ actions[item.index].text2 }}
                        </span>
                        <span>
                            <a-icon type="message" style="margin-right: 8px"/>
                            {{ actions[item.index].text3 }}
                        </span>
                        <span>
                            <a-button type="danger"  v-if="Number(getUserId) === Number(currentUserId)" :ghost="true" style="float: right" @click="deleteArticle(item.paperId)">删除文章</a-button>
                        </span>
                    </template>
                </a-list-item>
            </a-list>
        </div>
        <div class="page" >
            <a-pagination v-model="current" :total="total" @change="onChange" />
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "anotherMyArticles",
        data() {
            return {
                listData : [],
                current: 1,
                total: 0,
                actions :[],
                userList: [],
                paperList: [],
                currentUserId: this.$route.params.id
            };
        },

        computed: {
            ...mapGetters([
                'getUserId'
            ])
        },

        async mounted(){
            await this.setPaperList()
            await this.constructors(this.paperList)
        },


        methods:{
            ...mapMutations([
                'set_paperId'
            ]),

            async deleteArticle(paperId){
                var msg = "您确定要删除吗？"
                if(confirm(msg)==true){
                    await axios.post('http://localhost:3000/paper/deletepaper', {paperId:paperId})
                    await this.setPaperList()
                    await this.constructors(this.paperList)
                    this.$message.success('删除成功', 2)
                }
            },

            async onChange(page) {
                this.current =page
                await this.setPaperList()
                await this.constructors(this.paperList)
            },

            async commitPaperId(paperId){
                this.$store.commit('set_paperId', Number(paperId))
                await this.$router.push({name: 'Article'}).catch((err) => console.log(err))
            },

            async constructors(paperList){
                console.log("This is in constructor")
                this.setActions(paperList)
                await this.setListData(paperList)
            },

            async setPaperList(){
                console.log("This is in setPaperList")
                let res = await axios.get('http://localhost:3000/paper/getmypapers',
                    {
                        params:{
                            userId: this.currentUserId,
                            current: this.current
                        }
                    })
                this.paperList = res.data.paperList
                this.total = res.data.total
                console.log(this.paperList);
            },

            setActions(paperList){
                this.actions = []
                console.log("This is in setActions")
                console.log(paperList)
                for (let paper of paperList){
                    let tmp = {text1 :null, text2 :null, text3 :null}
                    tmp.text1 = paper.starNum
                    tmp.text2 = paper.likeNum
                    tmp.text3 = paper.commentNum
                    console.log("star:" + paper.starNum + "like: " + paper.likeNum + "comment: " + paper.commentNum)
                    this.actions.push(tmp)
                }
                console.log("This is after setActions : ")
                console.log(this.actions)
            },

            async setListData(paperList){
                this.listData = []
                console.log("This is in setListData")
                let index = 0
                for (let paper of paperList){
                    let tmp = {
                        paperId: paper.paperId,
                        userId: paper.userId,
                        title: paper.title,
                        starNum: paper.starNum,
                        likeNum: paper.likeNum,
                        commentNum: paper.commentNum,
                        createTime: paper.createTime,
                        userName: null ,
                        color: '',
                        index: index
                    }
                    index++
                    console.log(tmp.userId)
                    let res = await axios.get('http://localhost:3000/user/getUserById', {params: {userId: tmp.userId}})
                    tmp.userName = res.data.userName
                    tmp.color = res.data.color
                    this.listData.push(tmp)
                }
                console.log("This is after setListData :")
                console.log(this.listData);
            },
        },


    }
</script>

<style scoped>
    .main {
        display: flex;
        min-height: 550px;
        flex-flow: row wrap;
    }

    .header {
        margin-bottom: 10px;
    }

    .list {
        align-self: flex-start;
        width: 100%;
    }

    .articles-list-item {
        border: #dddddd solid;
        box-shadow: 10px 10px 5px #dddddd;
        padding: 20px 20px;
        border-radius: 30px;
        margin-bottom: 10px;
        background-color: #bbbbbb;
        margin-left: 10px;
        margin-right: 10px;
    }

    .page {
        align-self: flex-end;
        width: 100%;
        text-align: center;
    }
</style>