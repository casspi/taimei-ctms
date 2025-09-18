import { reqDistrictCityList, reqDistrictProvinceList } from '@/api'
import type { ProDialogFormField, ProQueryFormMetadata } from '@/components'

// 省市项
export const getProvinceAndCityFields = (
  options: Partial<ProDialogFormField> & { query?: boolean } = {},
): any => {
  const { query = false, ...rest } = options
  const baseProps: ProDialogFormField = {
    value: [],
    label: '省份/城市',
    is: 'form-cascader',
    get: (v) => {
      const [provinceId, cityId = ''] = v ?? []
      return { provinceId, cityId }
    },
    set: (d, f) => {
      const { provinceId, cityId = '' } = d
      if (provinceId) {
        f.value[0] = provinceId
      }
      if (cityId) {
        f.value[1] = cityId
      }
    },
    props: {
      props: {
        lazy: true,
        checkStrictly: query,
        lazyLoad: async (node: any, resolve: any) => {
          const { level, data } = node
          if (level === 0) {
            const res = await reqDistrictProvinceList()
            resolve(res.map((item) => ({ ...item, leaf: item.value === '-1' })))
          } else if (level === 1) {
            const res = await reqDistrictCityList({ id: data.value })
            resolve(res.map((item) => ({ ...item, leaf: true })))
          }
        },
      },
    },
    ...rest,
  }
  return query
    ? Object.assign(baseProps, rest)
    : Object.assign(
        baseProps,
        {
          rules: [{ required: true, message: '请填写所在省份/城市' }],
        },
        rest,
      )
}

export const getKeywordFields = (): ProQueryFormMetadata => {
  return {
    keyword: {
      is: 'form-input',
      value: '',
      label: '关键词检索',
    },
  }
}
