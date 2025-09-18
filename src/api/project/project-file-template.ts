import type { PagingParams, PagingResult, ProjectFileTemplate } from '@/types'

import curl from '../curl'

// 列表
export const reqProjectFileTemplateList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ProjectFileTemplate>>(`web/v2/project/file/template`, data)

// 详情
export const reqProjectFileTemplateInfo = (data: Pick<ProjectFileTemplate, 'id'>) =>
  curl(`web/v2/project/file/template/{id}`, data)

// 新增
export const doProjectFileTemplateCreate = (data: Partial<ProjectFileTemplate>) =>
  curl(`web/v2/project/file/template`, data, { method: 'POST' })

// 修改
export const doProjectFileTemplateUpdate = (data: Partial<ProjectFileTemplate>) =>
  curl(`web/v2/project/file/template`, data, { method: 'PUT' })

// 删除
export const doProjectFileTemplateDelete = (data: Pick<ProjectFileTemplate, 'id'>) =>
  curl(`web/v2/project/file/template/{id}`, data, { method: 'DELETE' })
