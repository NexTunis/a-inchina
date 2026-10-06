import { useEffect, useRef, useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { FileDoc, FileImage, FilePdf, UploadSimple, X } from '@phosphor-icons/react'
import { Modal } from '../components/Modal'
import { Btn, Field, Select } from '../components/ui'
import { ACCEPT, MAX_BYTES, fmtSize, isAllowed } from '../lib/files'
import { DOC_TYPES, type DocKey, type Student } from '../lib/data'
import { cn } from '../lib/cn'

interface Props {
  open: boolean
  onClose: () => void
  student: Student
  /** preselected document; verified documents are locked and never offered */
  docKey?: DocKey
  onUpload: (key: DocKey, file: File) => void
}

export default function UploadModal({ open, onClose, student, docKey, onUpload }: Props) {
  const { t } = useTranslation()
  const choices = DOC_TYPES.filter((d) => student.docs[d.key].status !== 'verified')
  const [key, setKey] = useState<DocKey>(docKey ?? choices[0]?.key ?? 'passport')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (open) { setKey(docKey ?? choices[0]?.key ?? 'passport'); setFile(null); setError(''); setProgress(null) }
    return () => window.clearInterval(timer.current)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const status = student.docs[key].status
  const replacing = status === 'pending' || status === 'rejected'

  function pickFile(f?: File) {
    if (!f) return
    if (!isAllowed(f)) { setError(t('portal.upload.errType')); setFile(null); return }
    if (f.size > MAX_BYTES) { setError(t('portal.upload.errSize')); setFile(null); return }
    setError(''); setFile(f)
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); pickFile(e.dataTransfer.files[0]) }

  function submit() {
    if (!file) { setError(t('portal.upload.errNone')); return }
    setProgress(0)
    let p = 0
    timer.current = window.setInterval(() => {
      p += 20 + Math.random() * 15
      if (p >= 100) { window.clearInterval(timer.current); setProgress(100); onUpload(key, file); setTimeout(onClose, 250) } else setProgress(p)
    }, 180)
  }

  const Icon = file ? (/^image\//.test(file.type) ? FileImage : /pdf/.test(file.type) ? FilePdf : FileDoc) : UploadSimple
  const busy = progress !== null

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={replacing ? t('portal.upload.replaceTitle') : t('portal.upload.title')} footer={<>
      <Btn variant="ghost" onClick={onClose} disabled={busy}>{t('common.cancel')}</Btn>
      <Btn onClick={submit} disabled={busy || choices.length === 0}>{busy ? t('portal.docs.uploading') : replacing ? t('portal.upload.replace') : t('portal.docs.upload')}</Btn>
    </>}>
      {choices.length === 0 ? <p className="py-6 text-center text-ink-2">{t('portal.upload.allLocked')}</p> : (
        <div className="space-y-5">
          <Field label={t('portal.upload.type')} hint={t(`data.docs.${key}.rule`)}>
            <Select value={key} onChange={(e) => { setKey(e.target.value as DocKey); setFile(null); setError('') }} disabled={busy || !!docKey}>
              {choices.map((d) => <option key={d.key} value={d.key}>{t(`data.docs.${d.key}.label`)}</option>)}
            </Select>
          </Field>
          {replacing && <p className="rounded-ctl bg-amber-50 p-3 text-sm font-semibold text-warn">{t('portal.upload.replaceNote')}</p>}

          <div
            onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
            onClick={() => !busy && input.current?.click()} role="button" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
            aria-label={t('portal.upload.drop')}
            className={cn('grid cursor-pointer place-items-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition', over ? 'border-crimson-600 bg-crimson-50' : 'border-ink/25 bg-paper hover:border-crimson-600/60')}
          >
            <span className={cn('grid size-14 place-items-center rounded-full', file ? 'bg-crimson-600 text-white' : 'bg-white text-crimson-600')}><Icon size={28} weight="bold" /></span>
            {file ? (
              <>
                <p className="latin max-w-full break-all font-bold">{file.name}</p>
                <p className="text-sm text-ink-3">{fmtSize(file.size)}</p>
                {!busy && <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null) }} className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-crimson-700"><X size={14} weight="bold" />{t('common.remove')}</button>}
              </>
            ) : (
              <>
                <p className="font-bold">{t('portal.upload.drop')}</p>
                <p className="text-sm text-ink-3">{t('portal.upload.formats')}</p>
              </>
            )}
            <input ref={input} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = '' }} />
          </div>
          {busy && <div className="h-2 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={Math.round(progress!)}><div className="h-full rounded-full bg-crimson-600 transition-[width] duration-200" style={{ width: `${progress}%` }} /></div>}
          {error && <p className="text-sm font-semibold text-crimson-700">{error}</p>}
        </div>
      )}
    </Modal>
  )
}
