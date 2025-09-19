export interface CaptchaInfo {
  token: string
  img: string
  uuid: string
  createTime: CreateTime
}

interface CreateTime {
  year: number
  monthValue: number
  dayOfYear: number
  dayOfWeek: string
  month: string
  dayOfMonth: number
  hour: number
  minute: number
  second: number
  nano: number
  chronology: Chronology
}

interface Chronology {
  calendarType: string
  id: string
}
