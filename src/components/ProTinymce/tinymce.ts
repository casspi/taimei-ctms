// ==========tinymce.js==========
// Any plugins you want to setting has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/
// colorpicker/contextmenu/textcolor plugin is now built in to the core editor, please remove it from your editor configuration

export const plugins = [
  'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern help emoticons autosave autoresize',
]

export const toolbar = [
  `code undo redo 
  | cut copy paste pastetext 
  | forecolor lineheight backcolor bold italic underline strikethrough link anchor 
  | alignleft aligncenter alignright alignjustify outdent indent 
  | bullist numlist 
  | styleselect formatselect fontselect fontsizeselect 
  | blockquote subscript superscript removeformat 
  | table image media charmap emoticons hr pagebreak insertdatetime print preview 
  | fullscreen`,
]
