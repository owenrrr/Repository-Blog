<template>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="left-content">
            <span class="head" @click="jumpToHome">My Blog</span>
        </div>
        <a-menu
                v-model="current"
                theme="dark"
                mode="horizontal"
                :default-selected-keys="['1']"
                :style="{ lineHeight: '64px', float: 'right' }"
        >
            <a-menu-item key="1" @click="jumpToHome">
                <a-icon type="home" />首页
            </a-menu-item>
            <a-menu-item key="2" @click="jumpToEdit">
                <a-icon type="edit"/>创作
            </a-menu-item>
            <a-menu-item key="3" @click="jumpToSetting">
                <a-dropdown>
                    <a @click="e => e.preventDefault()">
                         <a-icon type="user" /> 个人
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item key="1" @click="jumpToSetting">
                            <a-icon type="user"></a-icon>
                            个人信息
                        </a-menu-item>
                        <a-menu-item key="2" @click="jumpToMyArticles">
                            <a-icon type="profile"></a-icon>
                            我的文章
                        </a-menu-item>
                        <a-menu-item key="3" @click="jumpToStar">
                            <a-icon type="star"/>
                            我的收藏
                        </a-menu-item>
                        <a-menu-item key="4" @click="jumpToFollowers">
                            <a-icon type="team"/>
                            我的关注
                        </a-menu-item>
                        <a-menu-item key="5" @click="logOut" style="text-align: center">
                            <a-icon type="poweroff"></a-icon>
                            退出账号
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </a-menu-item>
        </a-menu>
    </a-layout-header>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "Header",
        computed: {
            ...mapGetters([
                'getUserId'
            ])
        },
        data() {
            return {
                current: ["1"]
            };
        },
        methods: {
            ...mapActions([
                'logOut'
            ]),
            jumpToHome() {
                this.current = ["1"]
                this.$router.push({name: 'BlogList'}).catch(err => {err})
            },
            jumpToEdit() {
                this.current = ["2"]
                this.$router.push('/MyBlog/basicEditor').catch(err => {err})
            },
            jumpToStar() {
                this.current = ["3"]
                console.log('star')
                this.$router.push({
                    name: 'userLayout' ,
                    params: {
                        userId: this.getUserId,
                        firstPage: '3'
                    }
                }).catch(err => console.log(err))
            },
            jumpToSetting() {
                this.current = ["3"]
                console.log('setting')
                this.$router.push({
                    name: 'userLayout',
                    params: {
                        userId: this.getUserId,
                        firstPage: '1'
                    }
                }).catch(err => console.log(err))
            },
            jumpToMyArticles() {
                this.current = ["3"]
                console.log("myArticles")
                this.$router.push({
                    name: 'userLayout',
                    params: {
                        userId: this.getUserId,
                        firstPage: '2'
                    }
                })
            },
            jumpToFollowers() {
                this.current = ["3"]
                console.log('followers')
                this.$router.push({
                    name: 'userLayout',
                    params: {
                        userId: this.getUserId,
                        firstPage: '4'
                    }
                })
            },
            async logOut() {
                await this.$store.dispatch('logOut')
                this.$message.success('退出成功')
                await this.$router.push('/login')
            }
        },
    }
</script>

<style scoped>
    .left-content {
        float: left;
        width: 50%;
    }
    .head {
        font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
        color: whitesmoke;
        font-size: 40px;
        font-style:italic;
        width: 30%;
        margin-right: 10%;
    }
    .search {
        width: 40%;
        margin-top: 16px;
    }
</style>
