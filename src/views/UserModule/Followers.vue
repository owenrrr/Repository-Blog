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
                                <a slot="title" :href="item.href">{{ item.userName }}</a>
                                <a-avatar
                                        slot="avatar"
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                />
                            </a-list-item-meta>
                            <a-button type="danger" >取消关注</a-button>
                        </a-list-item>
                    </a-list>
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
                                <a slot="title" :href="item.href">{{ item.userName }}</a>
                                <a-avatar
                                        slot="avatar"
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                />
                            </a-list-item-meta>
                            <a-button type="primary">关注</a-button>
                        </a-list-item>
                    </a-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import axios from 'axios'

    export default{
        name: 'Followers',
        data() {
            return {
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
        async beforeMount() {
            this.data1 = await this.fetchDataMyFollowers()
            this.data2 = await this.fetchDataAddFollowers()
        },
        methods: {
            async fetchDataMyFollowers() {
                let res = await axios.get('http://localhost:3000/follow/getFollows', {
                    params: {
                        userId: this.$route.params.userId,
                    }
                })
                console.log(res.data)
                return res.data
            },
            async fetchDataAddFollowers() {
                let res = await axios.get('http://localhost:3000/user/searchUser', {
                    params: {
                        searchInfo: this.input,
                    }
                })
                console.log(res.data)
                return res.data
            },
            async onSearch() {
                let res = await axios.get('http://localhost:3000/user/searchUser', {
                    params: {
                        searchInfo: this.input,
                    }
                })
                console.log(res.data)
                this.data2 = res.data
            }
            /*changeActive(e, item) {

                console.log('光标移入')
                item.state = 1
                console.log(item)
            },
            removeActive(e, item) {

                console.log('光标移出')
                item.state = 0
                console.log(item)
            }*/
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
        border-radius: 10px 10px 10px 10px;
        background-color: #aaaaaa;
        box-shadow: 2px 2px 1px #aaaaaa;
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