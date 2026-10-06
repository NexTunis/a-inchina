import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChatCircleDots, PaperPlaneRight, Robot, X } from '@phosphor-icons/react'
import { reply, type BotCta } from '../lib/chatbot'
import { cn } from '../lib/cn'

interface M { id: number; from: 'user' | 'bot'; text: string; cta?: BotCta }
const CTA_PATH: Record<BotCta, string> = { apply: '/apply', universities: '/universities', scholarships: '/scholarships' }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const [msgs, setMsgs] = useState<M[]>([{ id: 0, from: 'bot', text: '' }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  const nav = useNavigate()

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, typing])

  function send(q: string) {
    const text = q.trim()
    if (!text || typing) return
    setMsgs((m) => [...m, { id: m.length, from: 'user', text }])
    setText('')
    setTyping(true)
    const r = reply(text, t)
    setTimeout(() => {
      setMsgs((m) => [...m, { id: m.length, from: 'bot', text: r.answer, cta: r.cta }])
      setTyping(false)
    }, 900)
  }

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="mb-3 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(23rem,calc(100vw-2.5rem))] ltr:origin-bottom-right rtl:origin-bottom-left flex-col overflow-hidden rounded-card border border-line bg-white shadow-[0_30px_70px_-20px_rgb(26_29_32/0.35)]"
            role="dialog" aria-label={t('site.chat.title')}
          >
            <header className="flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
              <span className="grid size-9 place-items-center rounded-full bg-crimson-600"><Robot size={20} weight="bold" /></span>
              <div className="flex-1">
                <p className="text-sm font-bold">{t('site.chat.title')}</p>
                <p className="text-xs text-white/70">{t('site.chat.sub')}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t('common.close')} className="rounded-full p-1.5 hover:bg-white/10"><X size={18} /></button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-paper px-4 py-4">
              {msgs.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex flex-col gap-2', m.from === 'user' ? 'items-end' : 'items-start')}>
                  <p className={cn('max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', m.from === 'user' ? 'rounded-ee-md bg-crimson-600 text-white' : 'rounded-es-md border border-line bg-white text-ink')}>{m.id === 0 ? t('site.chat.welcome') : m.text}</p>
                  {m.cta && (
                    <button onClick={() => { setOpen(false); nav(CTA_PATH[m.cta!]) }} className="rounded-ctl bg-gold-500 px-3 py-1.5 text-xs font-bold text-ink hover:bg-gold-300">{t(`site.chat.cta.${m.cta}`)}</button>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-es-md border border-line bg-white py-3" aria-label={t('site.chat.typing')}>
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="size-1.5 rounded-full bg-ink-3" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
              {msgs.length === 1 && (
                <div className="flex flex-col items-start gap-2 pt-1">
                  {(t('common.bot.suggestions', { returnObjects: true }) as string[]).map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-xl border border-crimson-200 bg-white px-3 py-2 text-start text-[13px] font-semibold text-crimson-700 transition hover:bg-crimson-50">{s}</button>
                  ))}
                </div>
              )}
              <div ref={end} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(text) }} className="flex gap-2 border-t border-line bg-white p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} aria-label={t('site.chat.placeholder')} placeholder={t('site.chat.placeholder')} className="h-11 flex-1 rounded-ctl border border-ink/25 px-3.5 text-sm placeholder:text-ink-3 focus:border-crimson-600 focus:outline-none focus:ring-2 focus:ring-crimson-600/20" />
              <button type="submit" disabled={!text.trim() || typing} aria-label={t('common.send')} className="grid size-11 place-items-center rounded-ctl bg-crimson-600 text-white transition hover:bg-crimson-700 disabled:opacity-40">
                <PaperPlaneRight size={18} weight="fill" className="rtl:-scale-x-100" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen((o) => !o)} aria-label={t('site.chat.open')} aria-expanded={open}
        className="grid size-14 place-items-center rounded-full bg-crimson-600 text-white shadow-[0_14px_30px_-8px_rgb(200_16_46/0.7)] transition hover:scale-105 active:scale-95">
        {open ? <X size={24} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
      </button>
    </div>
  )
}
