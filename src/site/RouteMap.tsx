import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { AirplaneTilt, GraduationCap } from '@phosphor-icons/react'

/* Schematic map, not geographic. Origins sit on the left (west), China on the right (east). */
const ORIGINS = [
  { id: 'rb', label: 'rabat', x: 70, y: 250, c: { x: 200, y: 60 } },
  { id: 'al', label: 'algiers', x: 130, y: 205, c: { x: 230, y: 40 } },
  { id: 'tn', label: 'tunis', x: 190, y: 170, c: { x: 280, y: 50 } },
  { id: 'am', label: 'amman', x: 290, y: 230, c: { x: 380, y: 100 } },
  { id: 'db', label: 'dubai', x: 340, y: 300, c: { x: 430, y: 150 } },
]
const SHANGHAI = { x: 520, y: 235 }

export default function RouteMap() {
  const reduce = useReducedMotion()
  const { t } = useTranslation()
  return (
    <div className="relative mx-auto aspect-[600/440] w-full max-w-[640px]">
      <div className="dots absolute inset-0 rounded-card [mask-image:radial-gradient(closest-side,black,transparent)]" aria-hidden />
      <svg viewBox="0 0 600 440" className="relative size-full overflow-visible" role="img" aria-label={t('site.map.aria')}>
        <defs>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0" stopColor="#c8102e" stopOpacity="0.15" />
            <stop offset="1" stopColor="#c8102e" />
          </linearGradient>
        </defs>

        {ORIGINS.map((o, i) => {
          const d = `M ${o.x} ${o.y} Q ${o.c.x + (SHANGHAI.x - o.x) / 4} ${o.c.y} ${SHANGHAI.x} ${SHANGHAI.y}`
          return (
            <g key={o.id}>
              <motion.path
                id={`p-${o.id}`} d={d} fill="none" stroke="url(#route)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, delay: 0.4 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
              {!reduce && (
                <circle r="4.5" fill="#e6b009" opacity="0">
                  <set attributeName="opacity" to="1" begin={`${1.2 + i * 0.7}s`} />
                  <animateMotion dur={`${5.5 + i * 0.6}s`} begin={`${1.2 + i * 0.7}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#p-${o.id}`} />
                  </animateMotion>
                </circle>
              )}
              <circle cx={o.x} cy={o.y} r="6" fill="#fff" stroke="#1a1d20" strokeWidth="2" />
              <text x={o.x} y={o.y + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a1d20" style={{ fontFamily: 'var(--font-sans)' }}>{t(`site.map.cities.${o.label}`)}</text>
            </g>
          )
        })}

        <g>
          {!reduce && (
            <circle cx={SHANGHAI.x} cy={SHANGHAI.y} r="14" fill="none" stroke="#c8102e" strokeWidth="2" style={{ transformOrigin: `${SHANGHAI.x}px ${SHANGHAI.y}px`, animation: 'ring 2.4s ease-out infinite' }} />
          )}
          <circle cx={SHANGHAI.x} cy={SHANGHAI.y} r="11" fill="#c8102e" />
          <circle cx={SHANGHAI.x} cy={SHANGHAI.y} r="4" fill="#fff" />
          <text x={SHANGHAI.x} y={SHANGHAI.y + 34} textAnchor="middle" fontSize="16" fontWeight="800" fill="#c8102e" style={{ fontFamily: 'var(--font-sans)' }}>{t('site.map.cities.shanghai')}</text>
        </g>
        <g>
          <circle cx="490" cy="150" r="7" fill="#fff" stroke="#c8102e" strokeWidth="2.5" />
          <text x="490" y="132" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a1d20" style={{ fontFamily: 'var(--font-sans)' }}>{t('site.map.cities.beijing')}</text>
        </g>
      </svg>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-2 start-0 flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgb(26_29_32/0.35)] sm:start-4"
        style={reduce ? undefined : { animation: 'float-y 5s ease-in-out infinite' }}
      >
        <span className="grid size-10 place-items-center rounded-full bg-gold-100 text-gold-700"><GraduationCap size={22} weight="fill" /></span>
        <div><p className="text-sm font-extrabold">{t('site.map.chipAdmit')}</p><p className="text-xs text-ink-3">{t('site.map.chipAdmitSub')}</p></div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-2 end-0 flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgb(26_29_32/0.35)] sm:end-4"
        style={reduce ? undefined : { animation: 'float-y 6s ease-in-out -2s infinite' }}
      >
        <span className="grid size-10 place-items-center rounded-full bg-crimson-50 text-crimson-600"><AirplaneTilt size={22} weight="fill" /></span>
        <div><p className="text-sm font-extrabold">{t('site.map.chipArrived')}</p><p className="text-xs text-ink-3">{t('site.map.chipArrivedSub')}</p></div>
      </motion.div>

    </div>
  )
}
