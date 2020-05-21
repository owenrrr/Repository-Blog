<template>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="left-content">
            <span class="head" @click="jumpToHome">My Blog</span>
            <a-input-search placeholder="搜My Blog" enter-button @search="onSearch" class="search"/>
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
            <a-menu-item key="4" @click="jumpToUser">
                <a-icon type="user"/>个人
            </a-menu-item>
        </a-menu>
    </a-layout-header>
</template>

<script>
    export default {
        name: "Header",
        methods: {
            jumpToHome() {
                this.$router.push({name: 'BlogList'})
            },
            jumpToEdit() {

            },
            jumpToStar() {

            },
            jumpToUser() {

            },
            onSearch() {

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
