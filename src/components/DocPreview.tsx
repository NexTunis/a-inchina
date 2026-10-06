import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, FileDoc, FilePdf, FileImage, X } from '@phosphor-icons/react'
import { Modal } from './Modal'
import { Badge, Btn } from './ui'
import { DocBadge } from './docs'
import { getFile, fmtSize } from '../lib/files'
import { fmtDate } from '../lib/format'
import { sname, type DocKey, type Student } from '../lib/data'

const REASONS = ['blur', 'translation', 'expired', 'mismatch']

interface Props {
  student: Student
  docKey: DocKey | null
  onClose: () => void
  /** when given, the reviewer gets accept / reject buttons */
  onReview?: (status: 'verified' | 'rejected', note?: string) => void
}

export default function DocPreview({ student, docKey, onClose, onReview }: Props) {
  const { t } = useTranslation()
  const [rejecting, setRejecting] = useState(false)
  const st = docKey ? student.docs[docKey] : undefined
  const stored = docKey ? getFile(student.id, docKey) : undefined
  const name = st?.file?.name ?? (docKey ? `${docKey}.pdf` : '')
  const type = stored?.type ?? st?.file?.type ?? 'application/pdf'
  const canReview = !!onReview && st?.status === 'pending'
  const close = () => { setRejecting(false); onClose() }

  return (
    <Modal open={!!docKey && !!st} onClose={close} size="lg" title={docKey ? t(`data.docs.${docKey}.label`) : ''} footer={canReview ? (
      rejecting ? (
        <div className="flex w-full flex-wrap items-center gap-2">
          <span className="me-auto text-sm font-bold">{t('admin.docs.pickReason')}</span>
          {REASONS.map((r) => <button key={r} onClick={() => { onReview!('rejected', `data.reasons.${r}`); close() }} className="rounded-full border border-crimson-200 bg-white px-3 py-1.5 text-xs font-bold text-crimson-700 hover:bg-crimson-50">{t(`data.reasons.${r}`)}</button>)}
          <Btn variant="ghost" size="sm" onClick={() => setRejecting(false)}>{t('common.cancel')}</Btn>
        </div>
      ) : (
        <>
          <Btn variant="soft" onClick={() => setRejecting(true)}><X size={16} weight="bold" />{t('admin.docs.reject')}</Btn>
          <Btn onClick={() => { onReview!('verified'); close() }}><Check size={16} weight="bold" />{t('admin.docs.verify')}</Btn>
        </>
      )
    ) : undefined}>
      {docKey && st && (
        <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
          <div className="grid min-h-[22rem] place-items-center overflow-hidden rounded-ctl border border-line bg-paper">
            {stored && /^image\//.test(type) ? (
              <img src={stored.url} alt={name} className="max-h-[60dvh] w-full object-contain" />
            ) : stored && type === 'application/pdf' ? (
              <iframe src={stored.url} title={name} className="h-[60dvh] w-full" />
            ) : (
              <div className="w-full max-w-xs space-y-3 p-6 text-center">
                {/\.docx?$/i.test(name) ? <FileDoc size={56} className="mx-auto text-crimson-600" /> : /\.(png|jpe?g|webp)$/i.test(name) ? <FileImage size={56} className="mx-auto text-crimson-600" /> : <FilePdf size={56} className="mx-auto text-crimson-600" />}
                <p className="font-bold">{name}</p>
                <p className="text-sm text-ink-3">{stored ? t('common.docPreview.noInline') : t('common.docPreview.sample')}</p>
                {!stored && (
                  <div className="space-y-2 rounded-ctl border border-line bg-white p-4" aria-hidden>
                    {[90, 70, 85, 55, 78].map((w, i) => <div key={i} className="h-2 rounded-full bg-ink/10" style={{ width: `${w}%` }} />)}
                  </div>
                )}
              </div>
            )}
          </div>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-ink-3">{t('common.docPreview.student')}</dt><dd className="font-bold">{sname(student)}</dd></div>
            <div><dt className="text-ink-3">{t('common.docPreview.file')}</dt><dd className="latin break-all font-bold">{name}</dd></div>
            {st.file && <div><dt className="text-ink-3">{t('common.docPreview.size')}</dt><dd className="font-bold">{fmtSize(st.file.size)}</dd></div>}
            {st.uploadedAt && <div><dt className="text-ink-3">{t('common.docPreview.uploaded')}</dt><dd className="font-bold">{fmtDate(st.uploadedAt)}</dd></div>}
            <div><dt className="mb-1 text-ink-3">{t('common.docPreview.status')}</dt><dd><DocBadge status={st.status} /></dd></div>
            {st.status === 'rejected' && st.note && <p className="rounded-ctl bg-crimson-50 p-3 font-semibold text-crimson-700">{t(st.note, { defaultValue: st.note })}</p>}
            <div><dt className="mb-1 text-ink-3">{t('common.docPreview.rule')}</dt><dd className="text-ink-2">{t(`data.docs.${docKey}.rule`)}</dd></div>
            {!stored && <Badge tone="gold">{t('common.demoData')}</Badge>}
          </dl>
        </div>
      )}
    </Modal>
  )
}
