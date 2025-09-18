export interface MedicalComputation {
  createBy: string
  createDt: string
  formula: string
  id: string
  modifyBy: string
  modifyDt: string
  name: string
  referDoc: string
  remark: string
  status: string
  parameter: string
  type: string
}

// todo 废弃
export interface MedicalComputationItemVOField {
  computationId: string
  createBy: string
  createDt: string
  dic: string
  id: string
  interfacePath: string
  maxValue: number
  minValue: number
  modifyBy: string
  modifyDt: string
  name: string
  remark: string
  type: string
}
