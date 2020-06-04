<template>
<!-- <form action="[URL]" method="post"> -->
<div>
    <h1 style="display: inline-block" >Title :</h1>
    <a-input style="display: inline-block" placeholder="title" v-model="title"></a-input>
    <h1 style="display: inline-block; margin: 20px 0px" >Body : </h1>
    <div>
        <div name="editor" id="app" />
        <a-button
            size="large"
            type="primary"
            @click="submit"
            style="display:block; margin:0px auto"
        >Submit</a-button>
    </div>
</div>
  
<!-- </form> -->
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import CKEditor from '@ckeditor/ckeditor5-vue'
import axios from 'axios'

export default{
    data() {
        return {
            userid: null,
            title: '',
            Data : 'Context here',
        };
    },
    mounted(){
        this.userid = this.$store.getters.getUserid
        this.addEditor()
    },
    methods: {
        addEditor(){
            ClassicEditor
                .create( document.querySelector( '#app' ))
                .then( editor => {
                    window.editor = editor;
                } )
                .catch( error => {
                    console.error( 'There was a problem initializing the editor.', error );
                } );
        },
        submit(){
            this.Data = window.editor.getData()
            console.log(window.editor)
            console.log(this.Data)

            // axios operation

            this.addPaper()
        },
        addPaper(){
            const addpaper = {userid: null, title: null, createtime: null, content: null}
            addpaper.userid = this.userid
            addpaper.title = this.title
            var tmp = this.getServerTime()
            addpaper.createtime = tmp  //$.ajax({async:false}).getResponseHeader("Date")
            addpaper.content = this.Data
            console.log("Now is " + addpaper.createtime)
            axios.post('http://localhost:3000/paper/addpaper', addpaper)
        },
        getServerTime(){
            var d = new Date()
            var year = d.getFullYear()
            var month = ('0' + (d.getMonth() + 1)).slice(-2)
            var day = ('0' + (d.getDate())).slice(-2)
            var hour = ('0' + (d.getHours())).slice(-2)
            var minutes = ('0' + (d.getMinutes())).slice(-2)
            var seconds = ('0' + (d.getSeconds())).slice(-2)
            return year + "-" + month + "-" + day + " " + hour + "-" + minutes + "-" + seconds
        },
    },
    actions:{
    },
    components:{
        // ckeditor: CKEditor.component
    }
}
</script>


<style>
    .ck-editor__main{
        width:100%;
        padding-right: 0;
        margin-bottom: 50px;
        float: right;
    }

    .ck-editor__editable {
        min-height: 200px;
    }
</style>

    
