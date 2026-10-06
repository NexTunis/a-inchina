# عنود بالصين - Demo

Front-end only demo (no backend, all data is mock) for a study-in-China agency: public site with an AI assistant, a student portal, and an admin ERP. English by default, with an Arabic (RTL) version.

```
npm install
npm run dev
```

| Role | Login |
| --- | --- |
| Admin (ERP) | `admin@admin.com` / `admin123@` |
| Student | `student@demo.com` / `student123` (any seeded student email works with `student123`) |

- `/` landing with motion graphics, `/universities`, `/scholarships`, `/apply` (new applications appear in the ERP)
- `/portal` student tracking: stages, documents, applications, arrival, messages
- `/admin` ERP: dashboard, students, pipeline (drag and drop), document audit, arrival manifest, AI assistant logs

State lives in `localStorage`; the "reset demo data" button in the admin sidebar restores the seed. Chatbot answers come from keyword rules in `src/lib/chatbot.ts`.

## Languages

English is the default; use the EN / عربي switch (header, login page, admin sidebar). The choice is saved in `localStorage` and flips `dir`/`lang` on `<html>`.

Translations are JSON files in `src/i18n/{en,ar}/` (`common`, `data`, `site`, `portal`, `admin`), loaded by `react-i18next`. To add a language, copy a folder, translate it, and register it in `src/i18n/index.ts` and `LangSwitch.tsx`.

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main` (and on manual run). In the repo settings, Pages > Source must be set to **GitHub Actions**. The workflow sets `BASE_PATH=/<repo-name>/` so assets resolve under the project URL; locally the base is `/`. Routing uses `HashRouter`, so no server rewrites are needed.
