import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Airplane, Printer } from '@phosphor-icons/react'
import { Avatar, Badge, Btn, Card, Empty, Select } from '../components/ui'
import { primaryUni, sname, stname } from '../lib/data'
import { fmtDate } from '../lib/format'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { PageHead } from './AdminLayout'

const PICKUP = { pending: 'warn', assigned: 'gold', done: 'ok' } as const
const HOUSING = { pending: 'warn', booked: 'gold', 'checked-in': 'ok' } as const

export default function Arrivals() {
  const { students, staff, updateArrival, uname } = useStore()
  const { t } = useTranslation()
  const [hub, setHub] = useState<'PVG' | 'PEK'>('PVG')
  const rows = students.filter((s) => s.arrival && s.arrival.airport === hub).sort((a, b) => a.arrival!.date.localeCompare(b.arrival!.date))
  const team = staff.filter((g) => g.role === 'ground' && g.hub === (hub === 'PVG' ? 'shanghai' : 'beijing'))

  return (
    <div>
      <PageHead title={t('admin.arrivals.title')} text={t('admin.arrivals.text')}>
        <Btn variant="ghost" size="sm" onClick={() => window.print()}><Printer size={16} />{t('admin.arrivals.print')}</Btn>
      </PageHead>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {([['PVG', 'shanghai'], ['PEK', 'beijing']] as const).map(([v, l]) => (
          <button key={v} aria-pressed={hub === v} onClick={() => setHub(v)} className={cn('h-10 rounded-full px-5 text-sm font-bold transition', hub === v ? 'bg-ink text-white' : 'border border-line bg-white text-ink-2 hover:border-ink/40')}>{t(`data.hubs.${l}`)}</button>
        ))}
        <span className="ms-auto text-sm text-ink-3">{t('admin.arrivals.team')}: {team.map((g) => stname(g)).join(t('common.comma'))}</span>
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? <Empty icon={<Airplane />} title={t('admin.arrivals.emptyTitle')} text={t('admin.arrivals.emptyText')} /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-start text-sm">
              <thead className="bg-paper text-xs font-bold text-ink-3"><tr>{['student', 'university', 'arrival', 'flight', 'driver', 'pickup', 'housing'].map((h) => <th key={h} className="px-4 py-3 text-start">{t(`admin.arrivals.cols.${h}`)}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((s) => {
                  const a = s.arrival!
                  return (
                    <tr key={s.id}>
                      <td className="px-4 py-3"><Link to={`/admin/students/${s.id}`} className="flex items-center gap-3"><Avatar name={sname(s)} size={32} /><span className="font-bold">{sname(s)}</span></Link></td>
                      <td className="px-4 py-3">{primaryUni(s) ? uname(primaryUni(s)!) : '-'}</td>
                      <td className="px-4 py-3"><p className="font-semibold">{fmtDate(a.date)}</p><p className="text-xs text-ink-3"><span className="latin">{a.time}</span></p></td>
                      <td className="px-4 py-3 font-semibold"><span className="latin">{a.flight === 'TBD' ? t('admin.arrivals.tbd') : a.flight}</span></td>
                      <td className="px-4 py-3">
                        <Select aria-label={`${t('admin.arrivals.cols.driver')} ${sname(s)}`} className="h-9 w-40 text-sm" value={a.driver ?? ''} onChange={(e) => updateArrival(s.id, { driver: e.target.value || undefined, pickup: e.target.value ? (a.pickup === 'done' ? 'done' : 'assigned') : 'pending' })}>
                          <option value="">{t('admin.detail.unassigned')}</option>{team.map((g) => <option key={g.id} value={g.id}>{stname(g)}</option>)}
                        </Select>
                      </td>
                      <td className="px-4 py-3"><Badge tone={PICKUP[a.pickup]}>{t(`admin.arrivals.pickup.${a.pickup}`)}</Badge></td>
                      <td className="px-4 py-3">
                        <button onClick={() => updateArrival(s.id, { housing: a.housing === 'pending' ? 'booked' : a.housing === 'booked' ? 'checked-in' : 'pending' })} title={t('admin.arrivals.toggle')}><Badge tone={HOUSING[a.housing]}>{t(`admin.arrivals.housing.${a.housing}`)}</Badge></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
