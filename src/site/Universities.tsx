import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlass, MapPin, Coins, Translate } from '@phosphor-icons/react'
import { Badge, Btn, Empty, Input, Reveal } from '../components/ui'
import { cityName, uniName } from '../lib/data'
import { useStore } from '../lib/store'
import { fmtNum } from '../lib/format'
import { cn } from '../lib/cn'


export default function Universities() {
  const { t } = useTranslation()
  const { universities } = useStore()
  const [city, setCity] = useState('all')
  const [q, setQ] = useState('')
  const [lang, setLang] = useState<'all' | 'English' | 'Chinese'>('all')
  const list = useMemo(() => universities.filter((u) => u.status !== 'paused' &&
        (city === 'all' || u.city === city) &&
    (lang === 'all' || u.languages.includes(lang)) &&
    (!q || (uniName(u) + u.nameEn + u.programs.map((p) => t(`data.programs.${p}`, { defaultValue: p })).join(' ')).toLowerCase().includes(q.toLowerCase())),
  ), [city, q, lang, t, universities])
  const cities = useMemo(() => [...new Set(universities.filter((u) => u.status !== 'paused').map((u) => u.city))], [universities])

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{t('site.unis.title')}</h1>
      <p className="mt-3 max-w-xl text-lg text-ink-2">{t('site.unis.text')}</p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <MagnifyingGlass className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-3" size={18} />
          <Input aria-label={t('site.unis.search')} placeholder={t('site.unis.search')} value={q} onChange={(e) => setQ(e.target.value)} className="ps-10" />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('site.unis.city')}>
          {['all', ...cities].map((c) => (
            <button key={c} onClick={() => setCity(c)} aria-pressed={city === c} className={cn('h-10 rounded-full px-4 text-sm font-bold transition', city === c ? 'bg-ink text-white' : 'border border-line bg-white text-ink-2 hover:border-ink/40')}>{c === 'all' ? t('common.all') : cityName(c)}</button>
          ))}
        </div>
        <div className="flex gap-2 lg:ms-auto" role="group" aria-label={t('site.unis.lang')}>
          {([['all', t('site.unis.langAll')], ['English', t('site.unis.langEn')], ['Chinese', t('site.unis.langZh')]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setLang(v)} aria-pressed={lang === v} className={cn('h-10 rounded-full px-4 text-sm font-bold transition', lang === v ? 'bg-crimson-600 text-white' : 'border border-line bg-white text-ink-2 hover:border-ink/40')}>{l}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <Empty icon={<MagnifyingGlass />} title={t('site.unis.emptyTitle')} text={t('site.unis.emptyText')} />
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((u, i) => (
            <Reveal key={u.id} delay={(i % 3) * 0.06}>
              <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white">
                <div className={cn('zh relative grid h-40 place-items-center bg-gradient-to-br text-7xl font-black text-white', u.tone)}>
                  <div className="dots-light absolute inset-0 opacity-40" aria-hidden />
                  <span className="relative">{u.zh}</span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h2 className="text-xl font-extrabold">{uniName(u)}</h2>
                    <p className="latin text-sm text-ink-3">{u.nameEn}</p>
                  </div>
                  <ul className="space-y-2 text-sm text-ink-2">
                    <li className="flex items-center gap-2"><MapPin size={17} className="text-crimson-600" />{cityName(u.city)}</li>
                    <li className="flex items-center gap-2"><Coins size={17} className="text-crimson-600" />{t('site.unis.tuition', { min: fmtNum(u.tuition[0]), max: fmtNum(u.tuition[1]) })}</li>
                    <li className="flex items-center gap-2"><Translate size={17} className="text-crimson-600" />{u.languages.map((l) => t(`data.langs.${l}`)).join(t('common.and'))}</li>
                  </ul>
                  <div className="flex flex-wrap gap-1.5">{u.programs.map((p) => <Badge key={p}>{t(`data.programs.${p}`, { defaultValue: p })}</Badge>)}</div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="text-xs text-ink-3">{t('site.unis.appFee', { fee: u.fee })}</p>
                    <Btn to="/apply" size="sm">{t('common.apply')}</Btn>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
