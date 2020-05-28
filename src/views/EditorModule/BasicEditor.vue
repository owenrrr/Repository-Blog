<template>
<!-- <form action="[URL]" method="post"> -->
<div>
    <div id="app">
    <!-- <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor> -->
    <p>{{Data}}</p>
  </div>
  <a-button
      size="large"
      type="primary"
      @click="submit"
      style="float: right"
    >Submit</a-button>
</div>
  
<!-- </form> -->
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import CKEditor from '@ckeditor/ckeditor5-vue'

export default{
    data() {
        return {
            Data : 'Context here',
        };
    },
    mounted(){
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
        }
    },
    actions:{
    },
    components:{
        // ckeditor: CKEditor.component
    }
}
</script>
    
