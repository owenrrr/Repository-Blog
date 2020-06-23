<template>
<div>
     <child :paperid="paperid"></child>
</div>
</template>
<script>
import child from './article'
export default {

    data() {
        return {

            paperid: null,
        }
    },
    components:{
        child
    }

}

</script>

<style>
.searchInput {
    width: 200px;
    float: right;
}
.inline-blo {
    display: inline-block;
    width: 40%;
}
</style>