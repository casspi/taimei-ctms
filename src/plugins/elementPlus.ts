import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Schema from 'async-validator'
import type { Plugin } from 'vue'

// validator.js
Schema.messages.required = fieldFun('该字段为必填项')
if (Schema.messages.types) {
  Schema.messages.types.string = fieldFun('类型错误,应为字符串')
  Schema.messages.types.array = fieldFun('类型错误,应为数组')
  Schema.messages.types.object = fieldFun('类型错误,应为对象')
  Schema.messages.types.number = fieldFun('类型错误,应为数字')
  Schema.messages.types.date = fieldFun('类型错误,应为日期格式')
}

function fieldFun(message: string) {
  return () => {
    return message
  }
}

// import 'element-plus/es/components/message/style/css'
// import 'element-plus/es/components/message-box/style/css'
// import 'element-plus/es/components/notification/style/css'

export default {
  install(app) {
    // https://element-plus.org/zh-CN/component/icon.html
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
} as Plugin
