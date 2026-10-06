import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { Avatar, Card } from '../components/ui'
import { fmtDate, fmtTime } from '../lib/format'
import { stname } from '../lib/data'
import { useStaffMember, useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { useMe } from './PortalLayout'

export default function Messages() {
  const me = useMe()!
  const { threads, sendMessage } = useStore()
  const { t } = useTranslation()
  const adv = useStaffMember(me.advisorId)
  const list = threads[me.id] ?? []
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [list.length])

  function send() {
    if (!text.trim()) return
    sendMessage(me.id, 'student', text.trim())
    setText('')
    setTimeout(() => sendMessage(me.id, 'advisor', t('data.thread.auto')), 1500)
  }

  return (
    <Card className="flex h-[min(38rem,calc(100dvh-14rem))] flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-line p-4">
        <Avatar name={adv ? stname(adv) : '?'} size={44} />
        <div><p className="font-extrabold">{adv ? stname(adv) : '-'}</p><p className="text-xs text-ink-3">{adv ? t(`admin.staff.roles.${adv.role}`) : ''}</p></div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto bg-paper p-5">
        {list.length === 0 && <p className="py-10 text-center text-ink-3">{t('portal.messages.empty')}</p>}
        {list.map((m, i) => m.from === 'system' ? (
          <p key={i} className="mx-auto w-fit rounded-full bg-ink/6 px-4 py-1.5 text-center text-xs font-semibold text-ink-2">{m.key ? t(m.key) : m.text} ({fmtDate(m.at)})</p>
        ) : (
          <div key={i} className={cn('flex flex-col', m.from === 'student' ? 'items-end' : 'items-start')}>
            <p className={cn('max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed', m.from === 'student' ? 'rounded-ee-md bg-crimson-600 text-white' : 'rounded-es-md border border-line bg-white')}>{m.key ? t(m.key) : m.text}</p>
            <span className="latin mt-1 text-[11px] text-ink-3">{fmtTime(m.at)}</span>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2 border-t border-line p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label={t('portal.messages.placeholder')} placeholder={t('portal.messages.placeholder')} className="h-11 flex-1 rounded-ctl border border-ink/25 px-3.5 placeholder:text-ink-3 focus:border-crimson-600 focus:outline-none focus:ring-2 focus:ring-crimson-600/20" />
        <button type="submit" disabled={!text.trim()} aria-label={t('common.send')} className="grid size-11 place-items-center rounded-ctl bg-crimson-600 text-white hover:bg-crimson-700 disabled:opacity-40"><PaperPlaneRight size={18} weight="fill" className="rtl:-scale-x-100" /></button>
      </form>
    </Card>
  )
}
