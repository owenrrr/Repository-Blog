<template>
<!-- <form action="[URL]" method="post"> -->
<div>
    <h1 style="display: inline-block" >标题 :</h1>
    <a-input style="display: inline-block" placeholder="请输入标题" v-model="title"></a-input>
    <h1 style="display: inline-block; margin: 20px 0px" >内容 : </h1>
    <div>
        <div name="editor" id="app" />
        <a-button
            size="large"
            type="primary"
            @click="submit"
            style="display:block; margin:0px auto"
        >提交</a-button>
    </div>
</div>
  
<!-- </form> -->
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import CKEditor from '@ckeditor/ckeditor5-vue'
import axios from 'axios'
import {mapGetters} from 'vuex'

export default{
    data() {
        return {
            title: '',
            Data : 'Context here',
        };
    },
    mounted(){
        this.addEditor()
    },
    computed: {
        ...mapGetters([
            'getUserId'
        ])
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
            this.$message.success('Submit success!', 2);
            this.jumptosubmitpage()
        },
        addPaper(){
            console.log("This is addPaper operation")
            const addpaper = {userId: null, title: null, createTime: null, content: null}
            addpaper.userId = this.getUserId
            addpaper.title = this.title
            var tmp = this.getServerTime()
            addpaper.createTime = tmp  //$.ajax({async:false}).getResponseHeader("Date")
            addpaper.content = this.Data
            console.log("Now is " + addpaper.createTime)
            axios.post('http://localhost:3000/paper/addpaper', addpaper)
        },
        getServerTime(){
            var d = new Date()
            var year = d.getFullYear()
            var month = ('0' + (d.getMonth() + 1)).slice(-2)
            var day = ('0' + (d.getDate())).slice(-2)
            var hour = ('0' + ((d.getHours() + 8) % 24)).slice(-2)  // UTC +08:00
            var minutes = ('0' + (d.getMinutes())).slice(-2)
            var seconds = ('0' + (d.getSeconds())).slice(-2)
            return year + "-" + month + "-" + day + " " + hour + "-" + minutes + "-" + seconds
        },
        jumptosubmitpage(){
            this.$router.push('/MyBlog/submitpage').catch(err => {err})
        }
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

    
