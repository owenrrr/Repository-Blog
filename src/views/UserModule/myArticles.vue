<template>
     <div>
         <span class="head">My Articles</span>
     </div>
</template>

<script>
     import axios from 'axios'

     export default {
          name: "myArticles",
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
               /*await this.setAllpaper()
               await this.setUserList()
               await this.setPaperList()
               await this.constructors(this.userList,this.paperList)*/
              console.log('hello mounted')
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
    .head {
        font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
        color: whitesmoke;
        font-size: 40px;
        font-style:italic;
        width: 30%;
        margin-right: 10%;
    }
</style>