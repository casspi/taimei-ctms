/**
 * 小时除以24，取余数
 */
export const hour2dayRemainder = (hour: string) => {
  const remainder = Number(hour) % 24
  return remainder ? `${remainder}小时` : ``
}
