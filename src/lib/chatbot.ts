// Rule-based stand-in for the real assistant. The demo needs no backend, so intents are matched by keywords
// (Arabic and English). Answers live in the locale files under common.bot.
import type { TFunction } from 'i18next'

const norm = (s: string) =>
  s.toLowerCase()
    .replace(/[ً-ٟـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')

export type BotCta = 'apply' | 'universities' | 'scholarships'
interface Intent { id: string; keys: string[]; cta?: BotCta }

const INTENTS: Intent[] = [
  { id: 'hello', keys: ['مرحبا', 'السلام', 'اهلا', 'هلا', 'hello', 'hey', 'hi'] },
  { id: 'eligibility', keys: ['معدل', 'معدلي', 'يسمحلي', 'شروط', 'مؤهل', 'عمر', 'gpa', 'eligible', 'eligibility', 'qualify', 'grades', 'age', 'requirements'], cta: 'apply' },
  { id: 'csc', keys: ['الفرق', 'csc', 'منحه الحكومه', 'منحه الجامعه', 'حكومه', 'difference', 'government scholarship', 'university scholarship', 'government'], cta: 'scholarships' },
  { id: 'docs', keys: ['اوراق', 'مستندات', 'وثايق', 'وثائق', 'ملفات', 'documents', 'document', 'papers', 'paperwork'], cta: 'apply' },
  { id: 'deadline', keys: ['متى', 'موعد', 'مواعيد', 'يفتح', 'بيفتح', 'التقديم يبدا', 'deadline', 'when', 'open', 'intake', 'dates'] },
  { id: 'fees', keys: ['تكلف', 'كم سعر', 'رسوم', 'سعر', 'باقات', 'اسعار', 'fees', 'fee', 'price', 'cost', 'how much', 'packages'], cta: 'apply' },
  { id: 'airport', keys: ['مطار', 'يستقبل', 'استقبال', 'شريحه', 'سكن', 'pickup', 'pick up', 'pick us', 'airport', 'sim', 'housing', 'dorm', 'accommodation'] },
  { id: 'medicine', keys: ['طب', 'mbbs', 'طبيب', 'طبي', 'medicine', 'medical', 'doctor'], cta: 'universities' },
  { id: 'language', keys: ['لغه', 'hsk', 'ielts', 'toefl', 'صيني', 'انجليزي', 'language', 'english test'] },
  { id: 'visa', keys: ['تاشيره', 'فيزا', 'jw201', 'jw202', 'visa'] },
  { id: 'unis', keys: ['جامعه', 'جامعات', 'فودان', 'تخصص', 'university', 'universities', 'fudan', 'major', 'majors', 'program', 'programs'], cta: 'universities' },
  { id: 'human', keys: ['مستشار', 'شخص', 'اكلم', 'احكي', 'موظف', 'human', 'advisor', 'agent', 'someone', 'talk to'], cta: 'apply' },
]

const matches = (q: string, k: string) => {
  const key = norm(k)
  return /[a-z]/.test(key) ? new RegExp(`\\b${key}\\b`).test(q) : q.includes(key)
}

export function reply(text: string, t: TFunction): { answer: string; cta?: BotCta; intent: string } {
  const q = norm(text)
  let best: { intent: Intent; score: number } | null = null
  for (const intent of INTENTS) {
    const score = intent.keys.reduce((n, k) => (matches(q, k) ? n + norm(k).length : n), 0)
    if (score > 0 && (!best || score > best.score)) best = { intent, score }
  }
  if (best) return { answer: t(`common.bot.${best.intent.id}`), cta: best.intent.cta, intent: best.intent.id }
  return { answer: t('common.bot.fallback'), intent: 'fallback' }
}
