import { formatDate } from '@daysnap/utils'
import axios from 'axios'

import { doDiseaseCreate } from '@/api'

// 罕见病 mock 数据
export function useDiseaseDevtools(options?: { onSuccess?: () => void }) {
  const id = ref('')

  const trigger = async () => {
    const response = await axios({
      method: 'post',
      url: 'https://api.hjbxjz.com/api/v1/conBasicdataDisease/detail',
      data: {
        id: id.value,
      },
    })
    const { status, result, message } = response.data
    if (status !== 0) {
      throw message
    }
    const { name: nameCn, englishName: nameEn, reference: referDoc } = result

    const [
      // ,
      // ,
      clinicalFeature,
      differentialDiagnosis,
      etiology,
      // ,
      auxiliaryExamination,
      // ,
      diagnosticProcess,
      // etiology1,
      complicationDetection,
      summary,
      treatment,
    ] = await Promise.all(
      [
        // 'PRENATAL_DIAGNOSIS',
        // 'PROGNOSIS',
        'CLINICAL_MANIFESTATION',
        'DIFFERENTIAL_DIAGNOSIS',
        'PATHOGENY',
        // 'COMPLICATION',
        'SUPPLEMENTARY_EXAMINATION',
        // 'GENETIC_COUNSELING',
        'DIAGNOSIS',
        // 'EPIDEMIOLOGY',
        'DIAGNOSIS_FLOW_CHART',
        'SUMMARY',
        'TREATMENT',
      ].map(async (key) => {
        const res = await axios({
          method: 'GET',
          url: `/api/DISEASE/c17913c70c8c6ea9126424e73651d1bd/${key}`,
        })
        return res.data
      }),
    )

    const params = {
      nameCn,
      nameEn,
      // icon: 'https://gyzj.gongyujjh.org.cn/home/upload/ff8080818d3f115f018d4f64c7b002f8/46bb8a33dab178edb2a127b8e3cd7bd5.png',
      icon: '',
      banner: '',
      mountLocation: '9',
      onlineTime: formatDate(),
      author: '',
      index: 1,
      summary,
      clinicalFeature,
      differentialDiagnosis,
      complicationDetection,
      etiology,
      auxiliaryExamination,
      diagnosticProcess,
      treatment,
      referDoc,
    }

    await doDiseaseCreate(params)
    ElMessage.success('操作成功')
    id.value = ''
    options?.onSuccess?.()
  }

  return [id, trigger] as const
}
