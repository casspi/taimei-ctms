import axios from 'axios'

import { doMedicalGuidelineCreate } from '@/api'

export function useMedicalGuideLineDevtools() {
  const trigger = async () => {
    const response = await axios({
      method: 'post',
      url: 'https://api.hjbxjz.com/api/med/category/list/new',
      data: { content: '', approvedCuntry: '' },
    })
    const { status, result, message } = response.data
    if (status !== 0) {
      throw message
    }

    await Promise.all(
      result.slice(10, 40).map(async (item: any) => {
        const { medName, dieaseList } = item

        const params = {
          medicineName: medName,
          status: '1',
          medicineRemark: dieaseList.map((item: any) => item.name).join('、'),
        }

        return doMedicalGuidelineCreate(params)
      }),
    )

    ElMessage.success('操作成功')
  }

  return trigger
}
