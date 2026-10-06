import i18n from '../i18n'

const loc = () => (i18n.language === 'ar' ? 'ar-u-nu-latn' : 'en-US')
const fmt = (o: Intl.DateTimeFormatOptions, d: Date) => new Intl.DateTimeFormat(loc(), o).format(d)

export const fmtDate = (iso: string) => fmt({ day: 'numeric', month: 'short', year: 'numeric' }, new Date(iso))
export const fmtShort = (iso: string) => fmt({ day: 'numeric', month: 'short' }, new Date(iso))
export const fmtTime = (iso: string) => fmt({ hour: '2-digit', minute: '2-digit' }, new Date(iso))
export const fmtMonth = (monthIndex: number) => fmt({ month: 'long' }, new Date(2026, monthIndex, 1))
export const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n)
