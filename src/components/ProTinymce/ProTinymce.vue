<template>
  <div class="pro-tinymce">
    <textarea :id="tinymceId"></textarea>
  </div>
</template>

<script setup lang="ts">
  // eslint-disable-next-line simple-import-sort/imports
  import tinymce from 'tinymce/tinymce'

  import 'tinymce/themes/silver'
  import 'tinymce/icons/default/icons'
  import 'tinymce/plugins/advlist'
  import 'tinymce/plugins/anchor'
  import 'tinymce/plugins/autolink'
  import 'tinymce/plugins/autoresize'
  import 'tinymce/plugins/autosave'
  import 'tinymce/plugins/bbcode'
  import 'tinymce/plugins/charmap'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/codesample'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/directionality'
  import 'tinymce/plugins/emoticons'
  import 'tinymce/plugins/emoticons/js/emojiimages'
  import 'tinymce/plugins/emoticons/js/emojis'
  import 'tinymce/plugins/fullpage'
  import 'tinymce/plugins/fullscreen'
  import 'tinymce/plugins/help'
  import 'tinymce/plugins/hr'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/importcss'
  import 'tinymce/plugins/insertdatetime'
  import 'tinymce/plugins/legacyoutput'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/nonbreaking'
  import 'tinymce/plugins/noneditable'
  import 'tinymce/plugins/pagebreak'
  import 'tinymce/plugins/paste'
  import 'tinymce/plugins/preview'
  import 'tinymce/plugins/print'
  import 'tinymce/plugins/quickbars'
  import 'tinymce/plugins/save'
  import 'tinymce/plugins/searchreplace'
  import 'tinymce/plugins/spellchecker'
  import 'tinymce/plugins/tabfocus'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/template'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/textpattern'
  import 'tinymce/plugins/toc'
  import 'tinymce/plugins/visualblocks'
  import 'tinymce/plugins/visualchars'
  import 'tinymce/plugins/wordcount'

  import { getRandom } from '@daysnap/utils'

  import { doFileUpload } from '@/api'
  import { onMountedOrActivated } from '@/hooks'

  import { plugins, toolbar } from './tinymce'
  import { proTinymceProps } from './types'

  const props = defineProps(proTinymceProps)
  const emits = defineEmits(['update:modelValue'])
  const tinymceId = `tinymce-${getRandom(10)}`
  const getEditor = () => tinymce.get(tinymceId)
  const setContent = (val: string, prevVal?: string) => {
    const editor = getEditor()
    if (editor && val !== prevVal && val !== editor.getContent()) {
      editor.setContent(val)
    }
  }

  watch(() => props.modelValue, setContent)

  // 初始化
  const init = async () => {
    const { height, options, modelValue } = props
    await tinymce.init({
      selector: `#${tinymceId}`,
      width: '100%',
      height,
      min_height: 400,

      // 语言
      language: 'zh_CN',
      language_url: './tinymce/langs/zh_CN.js',

      // 插件 工具
      plugins,
      toolbar,

      // 皮肤
      skin: 'oxide',
      skin_url: './tinymce/skins/ui/oxide',
      content_css: './tinymce/skins/ui/oxide/content.min.css',

      // 工具栏吸顶
      toolbar_sticky: true,

      // 禁止 关闭/刷新网页时弹出对话框
      autosave_ask_before_unload: false,

      // other
      importcss_append: true,
      default_link_target: '_blank',
      branding: false,

      toolbar_mode: 'floating',

      // font-size
      fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
      font_formats:
        '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',

      // props options
      ...options,

      // 自定义文件上传
      convert_urls: false,
      file_picker_callback: (resolve, _, media) => {
        const acceptMap = {
          image: 'image/*',
          media: '.mp3, .mp4',
          file: '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4',
        }
        const accept = (acceptMap as any)[media.filetype]
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', accept)
        input.onchange = (event) => {
          const target = event.target as HTMLInputElement
          const file = target.files?.[0]
          target.value = ''
          if (!file) {
            return
          }
          doFileUpload({ file })
            .then(resolve as any)
            .toast()
        }
        input.click()
      },

      // 初始化结束后执行
      init_instance_callback: (editor) => {
        editor.setContent(modelValue ?? '')
        editor.on('NodeChange Change KeyUp SetContent', () => {
          const editor = getEditor()
          if (editor) {
            emits('update:modelValue', editor.getContent())
          }
        })
      },
    })
  }
  // 销毁
  const destroy = () => {
    getEditor()?.destroy()
  }

  onMountedOrActivated(() => nextTick(init))
  onBeforeUnmount(destroy)
  onDeactivated(destroy)
</script>

<style lang="scss">
  .pro-tinymce {
    width: 100%;
    position: relative;
    line-height: normal;
    textarea {
      width: 100%;
      visibility: hidden;
      z-index: -1;
    }
  }
  .tox-tinymce-aux {
    z-index: 99999 !important;
  }
</style>
