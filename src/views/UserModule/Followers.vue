<template>
    <div >
        <div class="follower">
            <div class="left">
                <a-page-header
                        class="title"
                        title="我的关注"
                />
                <div
                        v-infinite-scroll="handleInfiniteOnLoad"
                        class="demo-infinite-container-one"
                        :infinite-scroll-disabled="busy"
                        :infinite-scroll-distance="10"
                >
                    <a-list :data-source="data">
                        <a-list-item
                                slot="renderItem" slot-scope="item"
                                @mouseenter="changeActive($event, item)"
                                @mouseleave="removeActive($event, item)"
                        >
                            <a-list-item-meta :description="item.email">
                                <a slot="title" :href="item.href">{{ item.name.last }}</a>
                                <a-avatar
                                        slot="avatar"
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                />
                            </a-list-item-meta>
                            <a-button type="danger" v-if="item.state === 1">取消关注</a-button>
                        </a-list-item>
                        <div v-if="loading && !busy" class="demo-loading-container-one">
                            <a-spin />
                        </div>
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

                                style="width: 100%;"
                        />
                    </template>
                </a-page-header>

                <div
                        v-infinite-scroll="handleInfiniteOnLoad"
                        class="demo-infinite-container-two"
                        :infinite-scroll-disabled="busy"
                        :infinite-scroll-distance="10"
                >
                    <a-list :data-source="data">
                        <a-list-item slot="renderItem" slot-scope="item">
                            <a-list-item-meta :description="item.email">
                                <a slot="title" :href="item.href">{{ item.name.last }}</a>
                                <a-avatar
                                        slot="avatar"
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                />
                            </a-list-item-meta>
                            <a-button type="primary">关注</a-button>
                        </a-list-item>
                        <div v-if="loading && !busy" class="demo-loading-container-two">
                            <a-spin />
                        </div>
                    </a-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    //import axios from 'axios'
    import reqwest from 'reqwest';
    import infiniteScroll from 'vue-infinite-scroll';
    const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
    export default{
        name: 'Followers',
        directives: { infiniteScroll },
        data() {
            return {
                data: [],
                loading: false,
                busy: false,
            };
        },
        beforeMount() {
            this.fetchData(res => {
                this.data = res.results;
            });
        },
        methods: {
            fetchData(callback) {
                reqwest({
                    url: fakeDataUrl,
                    type: 'json',
                    method: 'get',
                    contentType: 'application/json',
                    success: res => {
                        callback(res);
                    },
                });
            },
            handleInfiniteOnLoad() {
                const data = this.data;
                this.loading = true;
                if (data.length > 14) {
                    this.$message.warning('Infinite List loaded all');
                    this.busy = true;
                    this.loading = false;
                    return;
                }
                this.fetchData(res => {
                    this.data = data.concat(res.results);
                    this.loading = false;
                });
            },
            changeActive(e, item) {

                console.log('光标移入')
                item.state = 1
                console.log(item)
            },
            removeActive(e, item) {

                console.log('光标移出')
                item.state = 0
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
        min-height: 500px;
    }

    .left{
        width: 40%;
        margin-right: 5%;
        border: #dddddd solid 1px;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .right {
        width: 40%;
        margin-left: 5%;
        border: #dddddd solid 1px;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .title {
        border: 1px solid rgb(235, 237, 240);
        border-radius: 10px 10px 0 0;
        background-color: #eeeeee;
    }

    .demo-infinite-container-one {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px;
        height: 500px;
    }
    .demo-loading-container-one {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }

    .demo-infinite-container-two {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px;
        height: 500px;
    }
    .demo-loading-container-two {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }
</style>