<template>
    <div>
        <div class="left">
            左边
        </div>
        <div class="right">
            <BlogList></BlogList>
        </div>
    </div>
</template>

<script>
    import BlogList from './BlogList'

    export default {
        name: "Home",
        components: {
            BlogList
        }
    }
</script>

<style scoped>
    .left {
        width: 20%;
        float: left;
    }
    .right {
        width: 75%;
        float: right;
    }
</style>
