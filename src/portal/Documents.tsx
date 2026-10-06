import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, LockSimple, PencilSimple, UploadSimple, WarningCircle } from '@phosphor-icons/react'
import { Btn, Card } from '../components/ui'
import { DocBadge } from '../components/docs'
import DocPreview from '../components/DocPreview'
import { DOC_TYPES, type DocKey } from '../lib/data'
import { fmtDate } from '../lib/format'
import { useStore } from '../lib/store'
import UploadModal from './UploadModal'
import { useMe } from './PortalLayout'

export default function Documents() {
  const me = useMe()!
  const { uploadDoc } = useStore()
  const { t } = useTranslation()
  const [upload, setUpload] = useState<{ open: boolean; key?: DocKey }>({ open: false })
  const [preview, setPreview] = useState<DocKey | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{t('portal.docs.title')}</h1>
          <p className="mt-1 text-ink-2">{t('portal.docs.text')}</p>
        </div>
        <Btn onClick={() => setUpload({ open: true })}><UploadSimple size={18} weight="bold" />{t('portal.upload.title')}</Btn>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DOC_TYPES.map((d) => {
          const st = me.docs[d.key]
          const locked = st.status === 'verified'
          const editable = st.status === 'pending' || st.status === 'rejected'
          return (
            <Card key={d.key} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-extrabold">{t(`data.docs.${d.key}.label`)}</h2>
                  <p className="mt-0.5 text-sm text-ink-3">{t(`data.docs.${d.key}.rule`)}</p>
                </div>
                <DocBadge status={st.status} />
              </div>
              {st.status === 'rejected' && st.note && (
                <p className="flex gap-2 rounded-ctl bg-crimson-50 p-3 text-sm font-semibold text-crimson-700"><WarningCircle size={20} weight="fill" className="shrink-0" />{t(st.note, { defaultValue: st.note })}</p>
              )}
              {locked && <p className="flex items-center gap-2 rounded-ctl bg-emerald-50 p-3 text-sm font-semibold text-ok"><LockSimple size={18} weight="fill" className="shrink-0" />{t('portal.docs.locked')}</p>}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-ink-3">{st.uploadedAt ? t('portal.docs.uploadedOn', { date: fmtDate(st.uploadedAt) }) : d.required ? t('common.required') : t('common.optional')}</span>
                <div className="flex gap-2">
                  {st.status !== 'missing' && <Btn size="sm" variant="ghost" onClick={() => setPreview(d.key)}><Eye size={16} />{t('common.view')}</Btn>}
                  {editable && <Btn size="sm" variant={st.status === 'rejected' ? 'primary' : 'soft'} onClick={() => setUpload({ open: true, key: d.key })}><PencilSimple size={16} />{st.status === 'rejected' ? t('portal.docs.reupload') : t('common.edit')}</Btn>}
                  {st.status === 'missing' && <Btn size="sm" variant="soft" onClick={() => setUpload({ open: true, key: d.key })}><UploadSimple size={16} weight="bold" />{t('portal.docs.upload')}</Btn>}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <UploadModal open={upload.open} onClose={() => setUpload({ open: false })} student={me} docKey={upload.key} onUpload={(k, f) => uploadDoc(me.id, k, f)} />
      <DocPreview student={me} docKey={preview} onClose={() => setPreview(null)} />
    </div>
  )
}
