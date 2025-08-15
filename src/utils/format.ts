export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)

export const formatDate = (
  value: Date | number | string,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
) => new Intl.DateTimeFormat(locale, options).format(new Date(value))
