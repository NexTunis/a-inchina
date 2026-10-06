import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

/* Shape rule: controls 12px, cards 20px, badges and avatars fully round. */

type Variant = 'primary' | 'dark' | 'gold' | 'ghost' | 'soft'
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-crimson-600 text-white hover:bg-crimson-700 shadow-[0_8px_24px_-10px_rgb(200_16_46/0.7)]',
  dark: 'bg-ink text-white hover:bg-ink-2',
  gold: 'bg-gold-500 text-ink hover:bg-gold-300',
  ghost: 'bg-transparent text-ink border border-ink/20 hover:bg-ink/5',
  soft: 'bg-crimson-50 text-crimson-700 hover:bg-crimson-100',
}

interface BtnProps {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  className?: string
  children: ReactNode
}
const SIZES = { sm: 'h-9 px-3.5 text-sm', md: 'h-11 px-5 text-[15px]', lg: 'h-13 px-7 text-base' }

export function Btn({ variant = 'primary', size = 'md', to, href, className, children, ...rest }: BtnProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ctl font-semibold transition duration-200',
    'active:translate-y-px active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
    VARIANTS[variant], SIZES[size], className,
  )
  if (to) return <Link to={to} className={cls}>{children}</Link>
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer">{children}</a>
  return <button className={cls} {...rest}>{children}</button>
}

type Tone = 'neutral' | 'ok' | 'warn' | 'bad' | 'gold' | 'crimson' | 'dark'
const TONES: Record<Tone, string> = {
  neutral: 'bg-ink/6 text-ink-2',
  ok: 'bg-emerald-50 text-ok',
  warn: 'bg-amber-50 text-warn',
  bad: 'bg-crimson-50 text-crimson-700',
  gold: 'bg-gold-100 text-gold-700',
  crimson: 'bg-crimson-600 text-white',
  dark: 'bg-ink text-white',
}
export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold', TONES[tone], className)}>{children}</span>
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-card border border-line bg-white', className)}>{children}</div>
}

const ctl = 'w-full rounded-ctl border border-ink/25 bg-white px-3.5 text-[15px] text-ink placeholder:text-ink-3 transition focus:border-crimson-600 focus:outline-none focus:ring-2 focus:ring-crimson-600/20'

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
      {error && <span className="text-xs font-semibold text-crimson-700">{error}</span>}
    </label>
  )
}
export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(ctl, 'h-11', p.className)} />
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(ctl, 'h-11', p.className)} />
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn(ctl, 'min-h-24 py-2.5', p.className)} />

const AVATAR_TONES = ['bg-crimson-100 text-crimson-800', 'bg-gold-100 text-gold-700', 'bg-ink/10 text-ink', 'bg-emerald-100 text-emerald-800']
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const tone = AVATAR_TONES[name.length % AVATAR_TONES.length]
  return (
    <span className={cn('inline-grid shrink-0 place-items-center rounded-full font-bold', tone)} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('')}
    </span>
  )
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-ink/10', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-crimson-600 transition-[width] duration-700" style={{ width: `${value}%` }} />
    </div>
  )
}

export function Empty({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="grid place-items-center gap-2 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-ink/6 text-2xl text-ink-3">{icon}</span>
      <p className="font-bold">{title}</p>
      <p className="max-w-sm text-sm text-ink-3">{text}</p>
    </div>
  )
}

export function Reveal({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const { t } = useTranslation()
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-extrabold', light ? 'text-white' : 'text-ink', className)}>
      <span className="zh grid size-9 place-items-center rounded-ctl bg-crimson-600 text-lg font-black text-gold-300">中</span>
      <span className="whitespace-nowrap text-lg leading-none">{t('common.brand')}</span>
    </span>
  )
}
