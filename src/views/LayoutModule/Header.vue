<template>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="left-content">
            <span class="head" @click="jumpToHome">My Blog</span>
        </div>
        <a-menu
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
            <a-menu-item key="3" @click="jumpToStar">
                <a-icon type="star"/>收藏
            </a-menu-item>
            <a-menu-item key="4" @click="jumpToSetting">
                <a-dropdown>
                    <a @click="e => e.preventDefault()">
                         <a-icon type="user" /> 个人
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item key="1" @click="jumpToSetting">
                            个人信息
                        </a-menu-item>
                        <a-menu-item key="2" @click="jumpToMyArticles">
                            我的文章
                        </a-menu-item>
                        <a-menu-item key="3" @click="logOut">
                            登出
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </a-menu-item>
        </a-menu>
    </a-layout-header>
</template>

<script>
    export default {
        name: "Header",
        methods: {
            jumpToHome() {
                this.$router.push({name: 'BlogList'}).catch(err => {err})
            },
            jumpToEdit() {
                this.$router.push('/MyBlog/basicEditor').catch(err => {err})
            },
            jumpToStar() {
                this.$router.push('/MyBlog/favourite').catch(err => {err})
            },
            jumpToSetting() {
                this.$router.push({name: 'Settings'})
            },
            jumpToMyArticles() {
                this.$router.push('/myArticles')
            },
            logOut() {
                console.log("Logout")
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
