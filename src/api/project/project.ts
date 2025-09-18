import type { PagingParams, PagingResult, Project } from '@/types'

import curl from '../curl'

// 列表
export const reqProjectList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Project>>(`web/project`, data)

// 详情
export const reqProjectInfo = (data: Pick<Project, 'projectId'>) =>
  curl(`web/project/{projectId}`, data)

// 新增
export const doProjectCreate = (data: Partial<Project>) =>
  curl(`web/project`, data, { method: 'POST' })

// 修改
export const doProjectUpdate = (data: Partial<Project>) =>
  curl(`web/project`, data, { method: 'PUT' })

// 删除
export const doProjectDelete = (data: Pick<Project, 'projectId'>) =>
  curl(`web/project/{projectId}`, data, { method: 'DELETE' })
