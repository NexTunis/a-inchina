import { useTranslation } from 'react-i18next'
import { Badge } from './ui'
import type { DocStatus } from '../lib/data'

const TONE: Record<DocStatus, 'ok' | 'warn' | 'bad' | 'neutral'> = { verified: 'ok', pending: 'warn', rejected: 'bad', missing: 'neutral' }

export function DocBadge({ status }: { status: DocStatus }) {
  const { t } = useTranslation()
  return <Badge tone={TONE[status]}>{t(`common.docStatus.${status}`)}</Badge>
}
