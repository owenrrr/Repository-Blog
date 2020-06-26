<template>
    <div>
        <a-menu  mode="horizontal" defaultSelectedKeys="0">
            <a-menu-item key="0"> <a-icon type="star" />我的收藏</a-menu-item>
        </a-menu>
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
              <a-icon type="star-o" style="margin-right: 8px" theme="twoTone" />
              {{ actions[item.index].text1 }}
            </span>
                    <span>
              <a-icon type="like-o" style="margin-right: 8px" theme="twoTone"/>
              {{ actions[item.index].text2 }}
            </span>
                    <span>
              <a-icon type="message" style="margin-right: 8px"/>
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
                allpaper: []
            };
        },


        async mounted(){
            await this.setAllpaper()
            await this.setUserList()
            await this.setPaperList()
            await this.constructors(this.userList,this.paperList)
        },


        methods:{

            commitpaperid(paperid){
                this.$store.commit('setPaperid', paperid)
                this.$router.push({name: 'Article'}).catch((err) => {err})
            },

            constructors(userlist, paperlist){
                console.log("This is in constructor")
                this.setActions(paperlist)
                this.setListData(paperlist,userlist)
            },

            setAllpaper(){
               console.log("setAllpaper")
               return axios.get('http://localhost:3000/paper/getpaperlist').then((res) => {
                   this.allpaper = res.data.papers.papers
                   console.log(this.allpaper);
               })
            },

            setUserList(){
                return axios.get('http://localhost:3000/user/getuserlist').then((res)=>{
                    console.log("getting userlist")
                    console.log(res);
                    this.userList=res.data.userList
                    console.log(this.userList)
                })
            },

            setPaperList(){
                let paperidlist
                console.log("This is in setPaperList")
                return axios.get('http://localhost:3000/favorite/getpaperlist',{params:{userId: this.$store.getters.getUserid}}).then((res) => {
                    paperidlist = res.data.papers.paperList
                    console.log(paperidlist);
                }).then(()=>{
                    for(let i=0; i<paperidlist.length; i++){
                        for(let j=0; j<this.allpaper.length; j++){
                            if(paperidlist[i]==this.allpaper[j].paperid){
                                console.log("pushing")
                                console.log(this.allpaper[j])
                                this.paperList.push(this.allpaper[j])
                                break
                            }
                        }
                    }
                })
            },

            setActions(paperlist){
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
                console.log("This is in setListData")
                let index = 0
                for (var paper of paperList){
                    var tmp = {paperid: paper.paperid, userid: paper.userid, title: paper.title, starnum: paper.starnum, likenum: paper.likenum, commentnum: paper.commentnum, createtime: paper.createtime, username: null , index: index}
                    index++
                    for (var user of userList){
                        if (tmp.userid == user.userid){
                            tmp.username = user.username
                            this.listData.push(tmp)
                            break;
                        }
                    }
                }
                console.log("This is after setListData :")
                console.log(this.listData);
            },
        },


    }
</script>

<style scoped>

</style>