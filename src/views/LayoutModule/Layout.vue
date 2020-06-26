<template>
    <a-layout id="components-layout-demo-fixed">
        <Header></Header>
        <a-layout-content class="main-content">
            <div class="con">
                <transition name="fade-transform" mode="out-in">
                    <router-view style="min-height: 550px"/>
                </transition>
            </div>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
            Design ©2018 Created by lxyeah
        </a-layout-footer>
    </a-layout>
</template>
<style>

</style>

<script>
    import Header from './Header'
    export default {
        name: "Layout",
        components: {
            Header
        }
    }
</script>
<style scoped>
    .main-content {
        padding: 0 50px;
        margin: 64px auto auto;
        width: 80%;
        min-height: 590px;

    }
    .con {
        background: #fff;
        padding: 24px;
        min-height: 550px;
        overflow:hidden;
        margin-top: 2%;
    }
</style>