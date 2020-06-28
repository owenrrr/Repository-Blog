<template>
    <div class="main">
        <div class="list">
            <a-input-search placeholder="搜索文章" v-model="value" enter-button @search="onSearch" style="margin-bottom: 20px"/>
            <a-list item-layout="vertical" size="large" :data-source="listData">
                <!-- <div slot="footer"><b>ant design vue</b> footer part</div> -->
                <a-list-item slot="renderItem" key="item.title" slot-scope="item" class="list-item">
                    <a-list-item-meta>
                        <!-- 先试试查看文章细看页面有无错误 更动click及herf :href="item.href"-->
                        <a slot="title" @click="commitPaperId(item.paperId)">{{ item.title }}</a>
                        <a-avatar slot="avatar" size="large" :style="{backgroundColor: item.color}">{{item.userName}}</a-avatar>
                    </a-list-item-meta>
                    <template>
                        <span>
                            <a-icon type="star-o" style="margin-right: 8px" />
                            {{ actions[item.index].text1 }}
                        </span>
                        <span>
                            <a-icon type="like-o" style="margin-right: 8px" />
                            {{ actions[item.index].text2 }}
                        </span>
                        <span>
                            <a-icon type="message" style="margin-right: 8px" />
                            {{ actions[item.index].text3 }}
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
import {mapMutations} from 'vuex'

    export default {
        name: "BlogList",
        data() {
            return {
                listData : [],
                actions :[],
                paperList: [],
                current: 1,
                total: 0,
                value: ''
            };
        },
        async mounted(){
            await this.setPaperList()
            await this.constructors(this.paperList)
        },
        methods:{
            ...mapMutations([
                'set_paperId'
            ]),
            async onSearch(value){
                await this.search(value)
                await this.constructors(this.paperList)
            },
            async onChange(page) {
                this.current = page
                let res = await axios.get('http://localhost:3000/paper/getsearch',
                    {
                        params:{
                            current: this.current,
                            content: this.value
                        }
                    })
                console.log(res);
                this.paperList=res.data.list
                await this.constructors(this.paperList)
            },
            async search(){
                console.log("searching...................................")
                let res = await axios.get('http://localhost:3000/paper/getsearch',
                    {
                            params:{
                                current: this.current,
                                content: this.value
                            }
                    })
                console.log(res);
                this.paperList=res.data.list
                this.total = res.data.total
            },
            async commitPaperId(paperId){
                this.$store.commit('set_paperId', Number(paperId))
                await this.$router.push({name: 'Article'}).catch((err) => console.log(err))
            },
            constructors(paperList){
                console.log("This is in constructor")
                this.setActions(paperList)
                this.setListData(paperList)
            },
            async setPaperList(){
                console.log(this.current)
                let res = await axios.get('http://localhost:3000/paper/getsearch',
                    {
                            params: {
                                current: this.current,
                                content: this.value
                            }
                        })
                console.log("This is in setPaperList")
                console.log(res)
                this.paperList = res.data.list
                this.total = res.data.total
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
                let index = 0
                console.log("This is in setListData")
                for (let paper of paperList){
                    let tmp = {
                        paperId: paper.paperId,
                        userId: paper.userId,
                        title: paper.title,
                        starNum: paper.starNum,
                        likeNum: paper.likeNum,
                        commentNum: paper.commentNum,
                        createTime: paper.createTime,
                        userName: null,
                        color: '',
                        index:index,
                    }
                    index++
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

    .list {
        align-self: flex-start;
        width: 100%;
    }

    .page {
        align-self: flex-end;
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }

    .list-item {
        border: #eeeeee solid;
        box-shadow: 10px 10px 5px #dddddd;
        padding: 20px 20px;
        border-radius: 30px;
        margin-bottom: 10px;
        background-color: #bbbbbb;
    }
</style>
