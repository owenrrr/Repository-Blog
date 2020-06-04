<template>
<!-- <form action="[URL]" method="post"> -->
<div>
    <h1 style="text-align:center">Success Submit!</h1>
    <h1 style="text-align:center; margin: 20px 0px">The page will be automatically changed in <p style="display: inline-block">{{ secs }}</p> seconds</h1>

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
        this.secs = 5
        this.autoDec()
    },
    methods:{
        autoDec(){
            this.secs--
            console.log("This is inside function.")
            console.log("this is secs:" + this.secs)

            if (this.secs <= 0){
                this.jumpToEdit()
            }else{
                setTimeout(this.autoDec, 1000)
            } 
        },
        jumpToEdit(){
            console.log("operate in jumpfunc")
            this.$router.push('/MyBlog/basicEditor').catch(err => {err})
        },
    }
}

</script>

