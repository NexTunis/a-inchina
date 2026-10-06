import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitch from '../components/LangSwitch'
import { Eye, EyeSlash, ShieldCheck, Student as StudentIcon } from '@phosphor-icons/react'
import { Btn, Field, Input, Logo } from '../components/ui'
import { ADMIN_LOGIN, DEMO_STUDENT } from '../lib/data'
import { useStore } from '../lib/store'

export default function Login() {
  const { t } = useTranslation()
  const { login, session } = useStore()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={session.role === 'admin' ? '/admin' : '/portal'} replace />

  function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    setTimeout(() => {
      const s = login(email, password)
      setBusy(false)
      if (!s) { setError(t('site.login.error')); return }
      nav(s.role === 'admin' ? '/admin' : '/portal', { replace: true })
    }, 700)
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-14">
        <div className="mb-12 flex max-w-md items-center justify-between"><Link to="/" aria-label={t('common.brand')}><Logo /></Link><LangSwitch /></div>
        <h1 className="text-3xl font-black">{t('common.login')}</h1>
        <p className="mt-2 text-ink-2">{t('site.login.text')}</p>

        <form onSubmit={submit} className="mt-8 grid max-w-md gap-5" noValidate>
          <Field label={t('common.email')}><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" className="latin text-start" /></Field>
          <Field label={t('site.login.password')} error={error}>
            <div className="relative">
              <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="latin pe-11 text-start" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t('site.login.hide') : t('site.login.show')} className="absolute inset-y-0 end-3 text-ink-3 hover:text-ink">
                {show ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </Field>
          <Btn type="submit" size="lg" disabled={busy || !email || !password}>{busy ? t('site.login.checking') : t('site.login.submit')}</Btn>
        </form>

        <div className="mt-10 max-w-md space-y-3 rounded-card border border-dashed border-ink/25 bg-white p-4">
          <p className="text-sm font-bold">{t('site.login.demo')}</p>
          <button type="button" onClick={() => { setEmail(ADMIN_LOGIN.email); setPassword(ADMIN_LOGIN.password) }} className="flex w-full items-center gap-3 rounded-ctl p-2.5 text-start transition hover:bg-ink/5">
            <span className="grid size-10 place-items-center rounded-full bg-ink text-white"><ShieldCheck size={20} /></span>
            <span className="flex-1"><span className="block text-sm font-bold">{t('site.login.adminAcc')}</span><span className="latin block text-xs text-ink-3">{ADMIN_LOGIN.email}</span></span>
          </button>
          <button type="button" onClick={() => { setEmail(DEMO_STUDENT.email); setPassword(DEMO_STUDENT.password) }} className="flex w-full items-center gap-3 rounded-ctl p-2.5 text-start transition hover:bg-ink/5">
            <span className="grid size-10 place-items-center rounded-full bg-crimson-600 text-white"><StudentIcon size={20} /></span>
            <span className="flex-1"><span className="block text-sm font-bold">{t('site.login.studentAcc')}</span><span className="latin block text-xs text-ink-3">{DEMO_STUDENT.email}</span></span>
          </button>
          <p className="text-xs text-ink-3">{t('site.login.hint')}</p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-crimson-600 lg:block">
        <div className="dots-light absolute inset-0" aria-hidden />
        <span className="zh absolute inset-0 grid select-none place-items-center text-[26rem] font-black leading-none text-white/10" aria-hidden>学</span>
        <div className="absolute inset-x-12 bottom-14 text-white">
          <p className="text-4xl font-black leading-tight">{t('site.login.side1')}<br />{t('site.login.side2')}</p>
          <p className="mt-3 max-w-sm text-white/85">{t('site.login.sideText')}</p>
        </div>
      </div>
    </div>
  )
}
