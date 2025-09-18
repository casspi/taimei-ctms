import curl from '../curl'

// 获取省份
export const reqDistrictProvinceList = () =>
  curl<{ label: string; value: string }[]>(`common/district/province/china`)

// 获取城市列表
export const reqDistrictCityList = (data: { id: string }) =>
  curl<{ label: string; value: string }[]>(`common/district/city/{id}`, data)
