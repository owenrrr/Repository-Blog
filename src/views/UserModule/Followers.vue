<template>
    <div >
        <div class="follower">
            <div class="left">
                <div class="follow-header">
                    <a-page-header
                            class="title"
                            title="我的关注"
                    />
                    <div style="height: 340px;"
                    >
                        <a-list :data-source="data1">
                            <a-list-item
                                    slot="renderItem" slot-scope="item"
                                    class="follow-list-item"
                            >
                                <a-list-item-meta :description="item.email">
                                    <a slot="title" @click="jumpToAnother(item)">{{ item.userName }}</a>
                                    <a-avatar slot="avatar" size="large" :style="{backgroundColor: item.color}">{{item.userName}}</a-avatar>
                                </a-list-item-meta>
                                <a-button type="danger" @click="removeFollow(item.userId)">取消关注</a-button>
                            </a-list-item>
                        </a-list>
                    </div>
                </div>
                <div class="follow-page-one" >
                    <a-pagination v-model="current1" :total="total1" :pageSize="5" @change="onChange1" style="margin-left: 37%"/>
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
                    <div style="height: 340px;">
                    <a-list :data-source="data2">
                        <a-list-item slot="renderItem" slot-scope="item" class="follow-list-item">
                            <a-list-item-meta :description="item.email">
                                <a slot="title">{{ item.userName }}</a>
                                <a-avatar slot="avatar" size="large" :style="{backgroundColor: item.color}">{{item.userName}}</a-avatar>
                            </a-list-item-meta>
                            <a-button type="primary" @click="follow(item.userId)">关注</a-button>
                        </a-list-item>
                    </a-list>
                    </div>
                    <div class="follow-page-two" >
                        <a-pagination v-model="current2" :total="total2" :pageSize="5" @change="onChange2" style="margin-left: 37%"/>
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
                        userId: this.$route.params.id,
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
                        userId: this.getUserId,
                    }
                })
                this.total2 = res.data.total
                return res.data.pageData
            },
            async onSearch() {
                let res = await axios.get('http://localhost:3000/user/searchUser', {
                    params: {
                        searchInfo: this.input,
                        current: this.current2,
                        userId: this.getUserId,
                    }
                })
                console.log(res.data.pageData)
                this.data2 = res.data.pageData
            },
            jumpToAnother(item) {
                this.$router.push({
                    name: 'anotherLayout',
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
        height: 500px;
    }

    .follow-page-one {
        position: relative;
        bottom: -30px;
    }

    .follow-page-two {
        position: relative;
        bottom: -30px;
    }

    .right {
        width: 40%;
        margin-left: 5%;
        border: #dddddd solid 1px;
        border-radius: 10px;
        background-color: #dddddd;
        height: 500px;
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