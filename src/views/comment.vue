<template>
<div>
    <avatar :username="username" style="margin: 0px 0px; display:inline-block; float:left" color="rgb(255, 255, 255)"></avatar>
    <a-input style="margin: 5px 10px; display:inline-block; float: left; width: 80%; height: 40px" placeholder="write..."></a-input>
    <a-button type="primary" style="float: left; top: 8px">submit</a-button>
    <div>
        <a-list item-layout="horizontal" :data-source="data">
    <a-list-item style ="width: 100%" slot="renderItem" slot-scope="item">
      <a-list-item-meta
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      >
        <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
        <a-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </a-list-item-meta>
    </a-list-item>
  </a-list>
    </div>
</div>
</template>
    
<script>
import axios from 'axios'
import Avatar from 'vue-avatar'

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
export default {

    name: 'comment',

    data(){
        return {
            username: '',
            userid: '',
            listdata:[],
            data,
        }
    },
    methods:{
        getUser(){
            axios.get('http://localhost:3000/user/getuserlist').then((res) => {
                this.userid = this.$store.getters.getUserid
                var userlist = res.data.users.users
                for (var user of userlist){
                    if (user.userid == this.userid){
                        this.username = user.username
                        break
                    }
                }
            })
        },
        getData(){

        },
    },
    mounted(){
        Promise.all([this.getUser(), ])
    },
    components:{
        Avatar
    }
}

</script>

<style>


</style>