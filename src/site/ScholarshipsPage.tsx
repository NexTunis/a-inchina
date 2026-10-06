import { useTranslation } from 'react-i18next'
import { CheckCircle } from '@phosphor-icons/react'
import { Btn, Reveal } from '../components/ui'
import { SCHOLARSHIP_IDS, STAGES } from '../lib/data'
import { cn } from '../lib/cn'

const INTAKES = [
  { k: 'sep', tone: 'bg-white' },
  { k: 'mar', tone: 'bg-gold-100' },
]

export default function ScholarshipsPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{t('site.schol.title')}</h1>
      <p className="mt-3 max-w-xl text-lg text-ink-2">{t('site.schol.text')}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {SCHOLARSHIP_IDS.map((id, i) => (
          <Reveal key={id} delay={(i % 2) * 0.07} className={cn(i === 0 && 'md:col-span-2')}>
            <article className={cn('h-full rounded-card border border-line p-7', i === 0 ? 'bg-crimson-600 text-white' : 'bg-white')}>
              <p className={cn('text-sm font-semibold', i === 0 ? 'text-white/80' : 'text-ink-3')}>{t(`data.scholarships.${id}.source`)}</p>
              <h2 className="mt-1 text-2xl font-black">{t(`data.scholarships.${id}.name`)}</h2>
              <ul className={cn('mt-5 grid gap-2.5', i === 0 && 'sm:grid-cols-2')}>
                {(t(`data.scholarships.${id}.covers`, { returnObjects: true }) as string[]).map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-[15px]"><CheckCircle weight="fill" size={20} className={i === 0 ? 'text-gold-300' : 'text-ok'} />{c}</li>
                ))}
              </ul>
              <dl className="mt-6 grid gap-3 text-sm">
                <div><dt className={cn('font-bold', i === 0 ? 'text-gold-300' : 'text-crimson-700')}>{t('site.schol.stipend')}</dt><dd>{t(`data.scholarships.${id}.stipend`)}</dd></div>
                <div><dt className={cn('font-bold', i === 0 ? 'text-gold-300' : 'text-crimson-700')}>{t('site.schol.who')}</dt><dd>{t(`data.scholarships.${id}.who`)}</dd></div>
                <div><dt className={cn('font-bold', i === 0 ? 'text-gold-300' : 'text-crimson-700')}>{t('site.schol.how')}</dt><dd>{t(`data.scholarships.${id}.how`)}</dd></div>
              </dl>
            </article>
          </Reveal>
        ))}
        {INTAKES.map((x, i) => (
          <Reveal key={x.k} delay={i * 0.07}>
            <div className={cn('h-full rounded-card border border-line p-7', x.tone)}>
              <h3 className="text-xl font-extrabold">{t(`site.schol.intake.${x.k}.t`)}</h3>
              <p className="mt-2 text-ink-2">{t(`site.schol.intake.${x.k}.d`)}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-card bg-ink p-8 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black">{t('site.schol.ctaTitle')}</h2>
          <p className="mt-1 text-white/75">{t('site.schol.ctaText', { n: STAGES.length })}</p>
        </div>
        <Btn to="/apply" variant="gold" size="lg">{t('site.schol.ctaBtn')}</Btn>
      </div>
    </div>
  )
}
