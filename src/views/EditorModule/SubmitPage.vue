<template>
<!-- <form action="[URL]" method="post"> -->
<div>
    <h1 style="display: inline-block" >Success Submit!</h1>
    <h1 style="display: inline-block" >The page will be automatically changed in <p>{{ secs }}</p> seconds</h1>

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
        this.autoDec()
    },
    methods:{
        autoDec(){
            console.log("This is inside function.")
           this.secs = 5
           for (var i=0; i<5; i++) {
            (function (i) {
                setTimeout(() => this.secs--, 1000*i)
                console.log("operate on : " + this.secs + "secs .")
             })(i)
             if (i == 4) this.jumpToEdit()
            }     
        },
        jumpToEdit(){
            console.log("operate in jumpfunc")
            this.$router.push('/MyBlog/basicEditor').catch(err => {err})
        },
    }
}

</script>

