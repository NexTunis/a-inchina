import { useTranslation } from 'react-i18next'
import { cn } from '../lib/cn'
import type { Lang } from '../i18n'

const OPTIONS: { v: Lang; label: string }[] = [{ v: 'en', label: 'EN' }, { v: 'ar', label: 'عربي' }]

export default function LangSwitch({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  return (
    <div role="group" aria-label={t('common.language')} className={cn('inline-flex rounded-ctl border border-line bg-white p-0.5', className)}>
      {OPTIONS.map((o) => (
        <button key={o.v} onClick={() => i18n.changeLanguage(o.v)} aria-pressed={i18n.language === o.v}
          className={cn('h-8 rounded-[0.55rem] px-2.5 text-xs font-bold transition', i18n.language === o.v ? 'bg-ink text-white' : 'text-ink-2 hover:bg-ink/5')}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
