<template>
    <div >
        <div class="follower">
            <div class="left">
                <a-page-header
                        class="title"
                        title="我的关注"
                />
                <div
                >
                    <a-list :data-source="data1">
                        <a-list-item
                                slot="renderItem" slot-scope="item"
                                class="follow-list-item"
                        >
                            <a-list-item-meta :description="item.email">
                                <a slot="title" @click="jumpToAnother(item)">{{ item.userName }}</a>
                                <a-avatar
                                        slot="avatar"
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                />
                            </a-list-item-meta>
                            <a-button type="danger" @click="removeFollow(item.userId)">取消关注</a-button>
                        </a-list-item>
                    </a-list>
                </div>
                <div class="page1" >
                    <a-pagination v-model="current1" :total="total1" pageSize="3" @change="onChange1" style="margin-left: 37%"/>
                </div>
            </div>
            <div class="right">
                <a-page-header
                        class="title"
                        title="添加关注"
                >
                    <template slot="extra">
                        <a-input-search
                                placeholder="输入好友邮箱或姓名"
                                enter-button
                                v-model="input"
                                style="width: 100%;"
                                @search="onSearch"
                        />
                    </template>
                </a-page-header>

                <div
                >
                    <a-list :data-source="data2">
                        <a-list-item slot="renderItem" slot-scope="item" class="follow-list-item">
                            <a-list-item-meta :description="item.email">
                                <a slot="title">{{ item.userName }}</a>
                                <a-avatar slot="avatar" size="large" :style="{backgroundColor: item.color}">{{item.userName}}</a-avatar>
                            </a-list-item-meta>
                            <a-button type="primary" @click="follow(item.userId)">关注</a-button>
                        </a-list-item>
                    </a-list>
                    <div class="page2" >
                        <a-pagination v-model="current2" :total="total2" pageSize="3" @change="onChange2" style="margin-left: 37%"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import axios from 'axios'
    import {mapGetters} from "vuex";

    export default{
        name: 'Followers',
        data() {
            return {
                total1: 0,
                current1: 1,
                total2: 0,
                current2: 1,
                data1: [],
                data2: [],
                loading1: false,
                busy1: false,
                loading2: false,
                busy2: false,
                input: '',
                myFollowersNum: 0,
                searchUsersNum: 0,
            };
        },
        async mounted() {
            this.data1 = await this.fetchDataMyFollowers()
            this.data2 = await this.fetchDataAddFollowers()
        },
        computed: {
            ...mapGetters([
                'getUserId'
            ]),
        },
        methods: {
            async onChange1(page1){
                this.current1 = page1
                this.data1 = await this.fetchDataMyFollowers()
            },
            async onChange2(page2){
                this.current2 = page2
                this.data2 = await this.fetchDataAddFollowers()
            },
            async follow(userId){
                await axios.post('http://localhost:3000/follow/addFollow',{
                    userId:this.getUserId,
                    followId:userId
                })
                this.$message.success('关注成功', 2)
                this.data1 = await this.fetchDataMyFollowers()
                this.data2 = await this.fetchDataAddFollowers()
            },
            async removeFollow(userId){
                var msg = "您确定要取消关注吗？"
                if(confirm(msg)==true){
                    await axios.post('http://localhost:3000/follow/removeFollow',{
                        userId:this.getUserId,
                        followId:userId
                    })
                    this.$message.success('取消关注成功', 2)
                }
                this.data1 = await this.fetchDataMyFollowers()
                this.data2 = await this.fetchDataAddFollowers()
            },
            async fetchDataMyFollowers() {
                let res = await axios.get('http://localhost:3000/follow/getFollows', {
                    params: {
                        userId: this.$route.params.userId,
                        current: this.current1
                    }
                })
                this.total1 = res.data.total
                return res.data.pageData
            },
            async fetchDataAddFollowers() {
                let res = await axios.get('http://localhost:3000/user/searchUser', {
                    params: {
                        searchInfo: this.input,
                        current: this.current2,
                        array: this.data1
                    }
                })

                /*let temp = []
                for(let i=0; i<res.data.pageData.length; i++){
                    if(!this.isInArray(this.data1,res.data.pageData[i])){
                        temp.push(res.data.pageData[i])
                    }
                }*/

                this.total2 = res.data.total
                return res.data.pageData
            },
            /*isInArray(arr,value){
                for(let j=0; j<arr.length; j++){
                    if(value.userId==arr[j].userId){
                        return true
                    }
                }
                return false
            },*/
            async onSearch() {
                let res = await axios.get('http://localhost:3000/user/searchUser', {
                    params: {
                        searchInfo: this.input,
                        current: this.current2,
                        array: this.data1,
                    }
                })
                console.log(res.data)
                this.data2 = res.data
            },
            jumpToAnother(item) {
                this.$router.push({
                    name: 'userLayout',
                    params: {
                        userId: item.userId,
                        firstPage: '1'
                    }
                })
                console.log(item)
            }
        },
    }
</script>

<style>
    .follower {
        display: flex;
        align-content: center;
        justify-content: center;
        min-height: 480px;
        margin-bottom: 20px;

    }

    .left{
        width: 40%;
        margin-right: 5%;
        border: #dddddd solid 1px;
        border-radius: 10px;
        background-color: #dddddd;
    }

    .right {
        width: 40%;
        margin-left: 5%;
        border: #dddddd solid 1px;
        border-radius: 10px;
        background-color: #dddddd;
    }

    .title {
        border: 1px solid #dddddd;
        border-radius: 10px 10px 0 0;
        background-color: #cccccc;
    }

    .follow-list-item {
        margin: 10px 8px;
        border: #dddddd 1px solid;
        border-radius: 10px 10px 10px 10px;
        padding: 5px;
        background-color: #eeeeee;
        box-shadow: 5px 5px 2px #aaaaaa;
    }

</style>