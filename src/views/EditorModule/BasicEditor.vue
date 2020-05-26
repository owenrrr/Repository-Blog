<template>
<form action="[URL]" method="post">
  <div id="app">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    <a-button
      size="large"
      type="primary"
      html-type="submit"
      @click="submit"
      style="float: right"
    >Submit</a-button>
  </div>
  
</form>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue'

export default{

    name: 'app',
    data() {
        return {
            editor: ClassicEditor,
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {
                // The configuration of the editor.
            }
        };
    },
    methods: {
        submit(){
            console.log(this.editorData)
        }
    },
    actions:{
    },
    components:{
        ckeditor: CKEditor.component
    }
}
</script>
    
