import { useEffect, useId, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Warning, X } from '@phosphor-icons/react'
import { Btn } from './ui'
import { cn } from '../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: ReactNode
}
const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  const { t } = useTranslation()
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby={id}
            initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={cn('relative flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-card bg-white shadow-[0_40px_90px_-30px_rgb(26_29_32/0.6)]', SIZES[size])}
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
              <h2 id={id} className="text-lg font-extrabold">{title}</h2>
              <button onClick={onClose} aria-label={t('common.close')} className="grid size-9 place-items-center rounded-ctl text-ink-3 hover:bg-ink/5"><X size={18} weight="bold" /></button>
            </header>
            <div className="overflow-y-auto px-6 py-5">{children}</div>
            {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-line bg-paper px-6 py-4">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface ConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  text: string
  confirmLabel: string
  /** extra notice shown in a warning box, e.g. why the action is blocked */
  warning?: string
  disabled?: boolean
}

export function ConfirmDialog({ open, onClose, onConfirm, title, text, confirmLabel, warning, disabled }: ConfirmProps) {
  const { t } = useTranslation()
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={<>
      <Btn variant="ghost" onClick={onClose}>{t('common.cancel')}</Btn>
      <Btn disabled={disabled} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Btn>
    </>}>
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-crimson-50 text-crimson-600"><Warning size={24} weight="fill" /></span>
        <div className="space-y-3"><p className="leading-relaxed text-ink-2">{text}</p>{warning && <p className="rounded-ctl bg-amber-50 p-3 text-sm font-semibold text-warn">{warning}</p>}</div>
      </div>
    </Modal>
  )
}
