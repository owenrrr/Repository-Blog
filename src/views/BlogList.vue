<template>
    <div>
        <a-input-search placeholder="Search for related Blogs" enter-button @search="onSearch"/>
    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
        <!-- <div slot="footer"><b>ant design vue</b> footer part</div> -->
        <a-list-item slot="renderItem" key="item.title" slot-scope="item">
             <!-- v-for="{ type1, text1, type2, text2, type3, text3 } in actions" slot="actions" -->
            <img
                    slot="extra"
                    width="272"
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
            <a-list-item-meta :description="item.username">
                <!-- 先试试查看文章细看页面有无错误 更动click及herf :href="item.href"-->
                <a slot="title" @click="commitpaperid(item.paperid)">{{ item.title }}</a>
                <!-- <a-avatar slot="avatar" :src="item.avatar" /> -->
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
</template>

<script>
import axios from 'axios'

    export default {
        name: "BlogList",
        data() {
            return {
                listData : [],
                pagination: {
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                },
                actions :[],
                userList: [],
                paperList: [],
            };
        },
        async mounted(){
            await this.setUserList()
            await this.setPaperList()
            await this.constructors(this.userList,this.paperList)
        },
        methods:{
            async onSearch(value){
                await this.search(value)
                await this.constructors(this.userList,this.paperList)
            },
            search(text){
                console.log("searching...................................")
                return axios.get('http://localhost:3000/paper/getsearch',{params:{content:text}}).then((res)=>{
                    console.log(res);
                    this.paperList=res.data.List
                })
            },
            commitpaperid(paperid){
                this.$store.commit('setPaperid', paperid)
                this.$router.push({name: 'Article'}).catch((err) => {err})
            },
            constructors(userlist, paperlist){
                console.log("This is in constructor")
                this.setActions(paperlist)
                this.setListData(paperlist,userlist)
            },
            setUserList(){
                return axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                    console.log("This is in setUserList")

                    this.userList = res.data.userList
                    console.log(this.userList);
                })
            },
            setPaperList(){
                return axios.get('http://localhost:3000/paper/getpaperlist').then((res) => {
                    console.log("This is in setPaperList")
                    this.paperList = res.data.papers.papers
                })
            },
            setActions(paperlist){
                this.actions = []
                console.log("This is in setActions")
                console.log(paperlist)
                for (var paper of paperlist){
                    var tmp = {text1 :null, text2 :null, text3 :null}
                    tmp.text1 = paper.starnum
                    tmp.text2 = paper.likenum
                    tmp.text3 = paper.commentnum
                    console.log("star:" + paper.starnum + "like: " + paper.likenum + "comment: " + paper.commentnum)
                    this.actions.push(tmp)
                }
                console.log("This is after setActions : ")
                console.log(this.actions)
            },
            setListData(paperList,userList){
                this.listData = []
                let index = 0
                console.log("This is in setListData")
                for (var paper of paperList){
                    var tmp = {paperid: paper.paperid, userid: paper.userid, title: paper.title, starnum: paper.starnum, likenum: paper.likenum, commentnum: paper.commentnum, createtime: paper.createtime, username: null, index:index}
                    index++
                    for (var user of userList){
                        if (tmp.userid == user.userid){
                            tmp.username = user.username
                            this.listData.push(tmp)
                            break;
                        }
                    }
                }
                console.log("This is after setListData :" + this.listData)
            },

        },
        
        
    }
</script>

<style scoped>

</style>
