import curl from '../curl'

// 列表
export const reqQuestionList = (data?: { name?: string; parentId?: string }) => curl(`menu`, data)
