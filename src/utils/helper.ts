/**
 * 保留数字小数点后一位
 * @param num 需要处理的数字
 * @returns 保留一位小数的数字或字符串
 */
export function formatToFixedOne(
  num: number | string | null | undefined,
): number | string | null | undefined {
  // 处理null和undefined
  if (num == null) {
    return num as null | undefined
  }

  // 转换为数字
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num

  // 检查是否为有效数字
  if (isNaN(parsedNum)) {
    return num
  }

  // 保留一位小数并转换回数字类型
  return parseFloat(parsedNum.toFixed(1))
}

/**
 * 保留数字小数点后一位，始终返回字符串类型
 * @param num 需要处理的数字
 * @returns 保留一位小数的字符串
 */
export function formatToFixedOneString(num: number | string | null | undefined): string {
  // 处理null和undefined
  if (num == null) {
    return ''
  }

  // 转换为数字
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num

  // 检查是否为有效数字
  if (isNaN(parsedNum)) {
    return String(num)
  }

  // 保留一位小数并返回字符串类型
  return parsedNum.toFixed(1)
}

/**
 * 格式化开始时间
 * @param time 时间字符串
 * @returns 时间戳
 */
export function formatStartTime(time: string): number {
  return new Date(time + ' 00:00:00').getTime()
}

/**
 * 格式化结束时间
 * @param time 时间字符串
 * @returns 时间戳
 */
export function formatEndTime(time: string): number {
  return new Date(time + ' 23:59:59').getTime()
}
