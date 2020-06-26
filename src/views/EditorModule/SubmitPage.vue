<template>
<!-- <form action="[URL]" method="post"> -->
<div >
    <h1 style="text-align:center">提交成功!</h1>
    <h1 style="text-align:center; margin: 20px 0px">当前页面将在<p style="display: inline-block">{{ secs }}</p>秒后跳转</h1>
</div>
  
<!-- </form> -->
</template>

<script>

export default {

    data() {
        return {
            secs: 0,
        };
    },
    mounted (){
        this.secs = 3
        this.autoDec()
    },
    methods:{
        autoDec(){
            this.secs--
            if (this.secs <= 0){
                this.jumpToEdit()
            }else{
                setTimeout(this.autoDec, 1000)
            } 
        },
        jumpToEdit(){
            this.$router.push('/MyBlog/basicEditor').catch(err => {err})
        },
    }
}

</script>

<style scoped>

</style>
