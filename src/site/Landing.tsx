import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import {
  ArrowRight, Airplane, Bed, BowlFood, CheckCircle, FileMagnifyingGlass, GraduationCap, IdentificationCard,
  PlayCircle, SimCard, SealCheck, Student, UserCheck, ChatsCircle, ClipboardText, Handshake,
} from '@phosphor-icons/react'
import { Btn, Reveal, Badge } from '../components/ui'
import { STAGES, cityName, uniName } from '../lib/data'
import { useStore } from '../lib/store'
import RouteMap from './RouteMap'
import { CountUp } from './motion'
import { cn } from '../lib/cn'

function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:pb-12 lg:pt-12">
        <div className="space-y-7">
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.5rem] font-black leading-[1.2] tracking-tight sm:text-5xl lg:text-[2.85rem]"
          >
            {t('site.hero.title1')}<br /><span className="text-crimson-600">{t('site.hero.title2')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[34rem] text-lg leading-relaxed text-ink-2"
          >
            {t('site.hero.sub')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }} className="flex flex-wrap gap-3">
            <Btn to="/apply" size="lg">{t('site.hero.cta')} <ArrowRight size={18} weight="bold" className="rtl:-scale-x-100" /></Btn>
            <Btn to="/#process" variant="ghost" size="lg">{t('site.hero.how')}</Btn>
          </motion.div>
        </div>
        <RouteMap />
      </div>
    </section>
  )
}

function Stats() {
  const { t } = useTranslation()
  const items = [
    { n: 147, s: 'K', t: t('site.stats.subs') },
    { n: 336, s: 'K', t: t('site.stats.followers') },
    { n: 690, s: '+', t: t('site.stats.videos') },
    { n: 21, s: '', t: t('site.stats.batch') },
  ]
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.t} delay={i * 0.08} className={cn('px-2 lg:px-8', i > 0 && 'lg:border-s lg:border-line')}>
            <p className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
              <span className="latin"><CountUp to={it.n} suffix={it.s} /></span>
            </p>
            <p className="mt-1.5 text-sm font-semibold text-ink-3">{it.t}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const STEP_ICONS = [ChatsCircle, FileMagnifyingGlass, GraduationCap, ClipboardText, SealCheck, Airplane, Handshake, UserCheck]

function Journey() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  return (
    <section id="process" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-sm font-bold text-crimson-600">{t('site.journey.eyebrow')}</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{t('site.journey.title')}</h2>
            <p className="mt-5 max-w-[26rem] text-lg leading-relaxed text-ink-2">{t('site.journey.text')}</p>
            <Btn to="/login" variant="dark" className="mt-7">{t('site.journey.cta')}</Btn>
          </Reveal>
        </div>

        <div ref={ref} className="relative">
          <div className="absolute inset-y-6 start-6 w-0.5 bg-ink/10" aria-hidden />
          <motion.div className="absolute inset-y-6 start-6 w-0.5 origin-top bg-crimson-600" style={{ scaleY: reduce ? 1 : line }} aria-hidden />
          <ol className="space-y-9">
            {STAGES.map((s, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <Reveal key={s.id} delay={0.04}>
                  <li className="relative flex gap-6">
                    <span className="relative z-0 grid size-12 shrink-0 place-items-center rounded-full border-2 border-crimson-600 bg-paper text-crimson-600"><Icon size={22} weight="bold" /></span>
                    <div className="pt-1">
                      <h3 className="text-xl font-extrabold">{t(`data.stages.${s.id}.label`)}</h3>
                      <p className="mt-1 max-w-md leading-relaxed text-ink-2">{t(`data.stages.${s.id}.hint`)}</p>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Scholarships() {
  const { t } = useTranslation()
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">{t('site.scholar.title')}</h2>
        </Reveal>
        <div className="mt-12 grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-6">
          <Reveal className="relative overflow-hidden rounded-card bg-gradient-to-br from-crimson-700 to-crimson-500 p-8 text-white md:col-span-4 md:row-span-2">
            <div className="dots-light absolute inset-0 opacity-60" aria-hidden />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <Badge tone="gold">{t('site.scholar.badge')}</Badge>
                <h3 className="mt-4 text-3xl font-black">{t('site.scholar.cscTitle')}</h3>
                <p className="mt-3 max-w-md text-white/85">{t('site.scholar.cscText')}</p>
              </div>
              <div className="flex items-end gap-3">
                <span className="latin text-7xl font-black leading-none text-gold-300"><CountUp to={3000} /></span>
                <span className="pb-2 text-lg font-bold">{t('site.scholar.stipend')}</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="rounded-card border border-line bg-paper p-6 md:col-span-2">
            <IdentificationCard size={30} className="text-crimson-600" weight="duotone" />
            <h3 className="mt-3 text-xl font-extrabold">{t('site.scholar.provTitle')}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{t('site.scholar.provText')}</p>
          </Reveal>
          <Reveal delay={0.16} className="rounded-card bg-gold-500 p-6 text-ink md:col-span-2">
            <Student size={30} weight="duotone" />
            <h3 className="mt-3 text-xl font-extrabold">{t('site.scholar.silkTitle')}</h3>
            <p className="mt-1.5 text-sm leading-relaxed">{t('site.scholar.silkText')}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-between gap-4 rounded-card border border-line bg-paper p-6 md:col-span-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-extrabold">{t('site.scholar.uniTitle')}</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-2">{t('site.scholar.uniText')}</p>
            </div>
            <Btn to="/scholarships" variant="ghost" className="shrink-0">{t('site.scholar.compare')}</Btn>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function UniversityMarquee() {
  const { t } = useTranslation()
  const list = useStore().universities.filter((u) => u.status !== 'paused')
  const row = [...list, ...list]
  return (
    <section className="overflow-hidden py-20" aria-label={t('site.nav.universities')}>
      <Reveal className="mx-auto mb-10 max-w-7xl px-4 sm:px-6">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t('site.marquee.title')}</h2>
      </Reveal>
      <div dir="ltr" className="overflow-hidden">
      <div className="flex w-max gap-4 motion-safe:animate-[marquee_48s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((u, i) => (
          <article dir={document.documentElement.dir} key={u.id + i} className="w-72 shrink-0 rounded-card border border-line bg-white p-3" aria-hidden={i >= list.length}>
            <div className={cn('zh grid h-36 place-items-center rounded-2xl bg-gradient-to-br text-6xl font-black text-white', u.tone)}>{u.zh}</div>
            <div className="px-2 pb-2 pt-4">
              <h3 className="font-extrabold">{uniName(u)}</h3>
              <p className="latin mt-0.5 text-xs text-ink-3">{u.nameEn}</p>
              <p className="mt-2 text-sm text-ink-2">{cityName(u.city)}</p>
            </div>
          </article>
        ))}
      </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6"><Btn to="/universities" variant="dark">{t('site.marquee.cta')}</Btn></div>
    </section>
  )
}

const ARRIVAL_STEPS = [
  { i: Airplane, k: 'airport' },
  { i: SimCard, k: 'sim' },
  { i: Bed, k: 'dorm' },
  { i: BowlFood, k: 'dinner' },
  { i: ClipboardText, k: 'register' },
]

function Arrival() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  return (
    <section className="bg-crimson-50 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{t('site.arrival.title')}</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">{t('site.arrival.text1')}</p>
          <p className="mt-4 max-w-lg text-ink-2">{t('site.arrival.text2')}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-card border border-line bg-white p-5 shadow-[0_30px_60px_-30px_rgb(126_10_29/0.45)] sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-sm text-ink-3">{t('site.arrival.batch')}</p>
                <p className="text-xl font-extrabold">{t('site.arrival.students')}</p>
              </div>
              <Badge tone="ok">{t('site.arrival.done')}</Badge>
            </div>
            <ul className="mt-5 space-y-1">
              {ARRIVAL_STEPS.map((s, idx) => (
                <motion.li
                  key={s.k}
                  initial={reduce ? false : { opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: idx * 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 rounded-ctl px-2 py-3"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-crimson-50 text-crimson-600"><s.i size={22} weight="bold" /></span>
                  <div className="flex-1">
                    <p className="font-bold">{t(`site.arrival.steps.${s.k}.t`)}</p>
                    <p className="text-sm text-ink-3">{t(`site.arrival.steps.${s.k}.s`)}</p>
                  </div>
                  <motion.span
                    initial={reduce ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.8 }}
                    transition={{ delay: idx * 0.35 + 0.35, type: 'spring', stiffness: 300, damping: 16 }} className="text-ok"
                  ><CheckCircle size={26} weight="fill" /></motion.span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const VLOGS = [
  { k: 'v1', tone: 'from-crimson-700 to-crimson-500' },
  { k: 'v2', tone: 'from-ink to-ink-2' },
  { k: 'v3', tone: 'from-gold-700 to-gold-500' },
  { k: 'v4', tone: 'from-crimson-800 to-ink' },
]

function Vlogs() {
  const { t } = useTranslation()
  return (
    <section id="vlogs" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t('site.vlogs.title')}</h2>
        <p className="mt-4 max-w-xl text-lg text-ink-2">{t('site.vlogs.text')}</p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VLOGS.map((v, i) => (
          <Reveal key={v.k} delay={i * 0.07}>
            <a href="https://www.youtube.com/@anoodinchina" target="_blank" rel="noreferrer" className={cn('group relative flex aspect-[9/14] flex-col justify-between overflow-hidden rounded-card bg-gradient-to-b p-5 text-white', v.tone)}>
              <div className="dots-light absolute inset-0 opacity-40" aria-hidden />
              <PlayCircle size={52} weight="fill" className="relative transition-transform duration-300 group-hover:scale-110" />
              <p className="relative text-lg font-extrabold leading-snug">{t(`site.vlogs.items.${v.k}`)}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div ref={ref} className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-crimson-600 px-6 py-16 text-white sm:px-14 sm:py-20">
        <motion.span style={{ y }} className="zh pointer-events-none absolute -bottom-16 end-6 select-none text-[16rem] font-black leading-none text-white/10" aria-hidden>中国</motion.span>
        <div className="relative max-w-2xl">
          <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{t('site.cta.title')}</h2>
          <p className="mt-4 text-lg text-white/90">{t('site.cta.text')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn to="/apply" variant="gold" size="lg">{t('site.hero.cta')}</Btn>
            <Btn to="/login" size="lg" className="bg-white/15 text-white hover:bg-white/25 shadow-none">{t('site.cta.track')}</Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <>
      <Hero />
      <Stats />
      <Journey />
      <Scholarships />
      <UniversityMarquee />
      <Arrival />
      <Vlogs />
      <FinalCta />
    </>
  )
}
