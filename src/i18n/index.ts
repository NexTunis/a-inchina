import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './en/common.json'
import enData from './en/data.json'
import enSite from './en/site.json'
import enPortal from './en/portal.json'
import enAdmin from './en/admin.json'
import arCommon from './ar/common.json'
import arData from './ar/data.json'
import arSite from './ar/site.json'
import arPortal from './ar/portal.json'
import arAdmin from './ar/admin.json'

export type Lang = 'en' | 'ar'
const STORAGE_KEY = 'aic-lang'

function saved(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'ar') return v
  } catch { /* storage unavailable */ }
  return 'en' // English is the default language
}

function applyDir(lang: string) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.title = i18n.t('common.brand')
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { common: enCommon, data: enData, site: enSite, portal: enPortal, admin: enAdmin } },
    ar: { translation: { common: arCommon, data: arData, site: arSite, portal: arPortal, admin: arAdmin } },
  },
  lng: saved(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

applyDir(i18n.language)
i18n.on('languageChanged', (lng) => {
  applyDir(lng)
  try { localStorage.setItem(STORAGE_KEY, lng) } catch { /* ignore */ }
})

export default i18n
