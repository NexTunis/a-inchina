import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ADMIN_LOGIN, DEMO_STUDENT, DEMO_THREAD, DOC_TYPES, SEED_STAFF, UNIVERSITIES, seedStudents, primaryUni, uniName,
  type AppStatus, type Application, type Arrival, type DocFile, type DocKey, type DocStatus, type Msg, type StageId, type Staff, type Student, type University,
} from './data'
import { rememberFile } from './files'

export type Session = { role: 'admin' } | { role: 'student'; studentId: string } | null

/** Everything an admin can edit on a student. */
export type StudentInput = Pick<Student, 'name' | 'nameEn' | 'email' | 'phone' | 'country' | 'age' | 'level' | 'major' | 'gpa' | 'scholarshipId' | 'source' | 'advisorId' | 'intake'> & {
  fees?: Student['fees']
  stage?: StageId
}

interface Store {
  session: Session
  students: Student[]
  staff: Staff[]
  universities: University[]
  /** Display name of a university by id, in the current language. */
  uname: (id: string) => string
  threads: Record<string, Msg[]>
  login: (email: string, password: string) => Session
  logout: () => void
  setStage: (id: string, stage: StageId) => void
  setDoc: (id: string, key: DocKey, status: DocStatus, note?: string) => void
  uploadDoc: (id: string, key: DocKey, file: File) => void
  updateArrival: (id: string, patch: Partial<Arrival>) => void
  addStudent: (input: StudentInput) => Student
  updateStudent: (id: string, input: Partial<StudentInput>) => void
  removeStudent: (id: string) => void
  addApplication: (id: string, universityId: string) => void
  removeApplication: (id: string, universityId: string) => void
  setApplicationStatus: (id: string, universityId: string, status: AppStatus) => void
  updateApplication: (id: string, universityId: string, patch: Partial<Omit<Application, 'universityId'>>) => void
  /** The student confirms one offer; every other open application is closed. */
  acceptOffer: (id: string, universityId: string) => void
  addStaff: (s: Omit<Staff, 'id'>) => void
  updateStaff: (id: string, patch: Partial<Staff>) => void
  removeStaff: (id: string) => void
  addUniversity: (u: Omit<University, 'id'>) => void
  updateUniversity: (id: string, patch: Partial<University>) => void
  removeUniversity: (id: string) => void
  sendMessage: (id: string, from: Msg['from'], text: string) => void
  resetDemo: () => void
}

const KEY = 'aic-demo-v3'
const Ctx = createContext<Store | null>(null)

interface Persisted { session: Session; students: Student[]; staff: Staff[]; universities: University[]; threads: Record<string, Msg[]> }

const seed = (session: Session = null): Persisted => ({ session, students: seedStudents(), staff: SEED_STAFF, universities: UNIVERSITIES, threads: { s1: DEMO_THREAD } })

function initial(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const p = JSON.parse(raw) as Persisted; return { ...p, universities: p.universities ?? UNIVERSITIES } }
  } catch { /* storage unavailable, fall through to seed */ }
  return seed()
}

const TODAY = '2026-10-06'
/** Stamp the submission and decision dates the first time the status reaches them. */
const withDates = (a: Application, patch: Partial<Application>): Application => {
  const n = { ...a, ...patch }
  if (patch.status && patch.status !== 'preparing' && !n.submittedAt) n.submittedAt = TODAY
  if (patch.status && ['admitted', 'rejected'].includes(patch.status) && !n.decidedAt) n.decidedAt = TODAY
  if (patch.status && !['admitted'].includes(patch.status) && patch.status !== a.status) { n.accepted = undefined; if (patch.status !== 'closed') n.jwSent = undefined }
  return n
}
const blankDocs = () => Object.fromEntries(DOC_TYPES.map((d) => [d.key, { status: 'missing' }])) as Student['docs']
const airportFor = (s: Student) => (['bfsu', 'bnu'].includes(primaryUni(s) ?? '') ? 'PEK' : 'PVG') as Arrival['airport']

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const patchStudent = useCallback((id: string, fn: (s: Student) => Student) => {
    setState((p) => ({ ...p, students: p.students.map((s) => (s.id === id ? fn({ ...s, updatedAt: '2026-10-06' }) : s)) }))
  }, [])

  const value = useMemo<Store>(() => ({
    session: state.session,
    students: state.students,
    staff: state.staff,
    universities: state.universities,
    uname: (id) => { const u = state.universities.find((x) => x.id === id); return u ? uniName(u) : id },
    threads: state.threads,
    login(email, password) {
      const e = email.trim().toLowerCase()
      let session: Session = null
      if (e === ADMIN_LOGIN.email && password === ADMIN_LOGIN.password) session = { role: 'admin' }
      else if (password === DEMO_STUDENT.password) {
        const st = state.students.find((s) => s.email.toLowerCase() === e)
        if (st) session = { role: 'student', studentId: st.id }
      }
      if (session) setState((p) => ({ ...p, session }))
      return session
    },
    logout: () => setState((p) => ({ ...p, session: null })),
    setStage: (id, stage) => patchStudent(id, (s) => ({
      ...s, stage,
      arrival: stage >= 6 && !s.arrival ? { date: '2027-02-26', time: '10:00', flight: 'TBD', airport: airportFor(s), pickup: 'pending', housing: 'pending' } : s.arrival,
      reference: stage >= 4 && !s.reference ? `FD-26-${1100 + Math.floor(Math.random() * 800)}` : s.reference,
    })),
    setDoc: (id, key, status, note) => patchStudent(id, (s) => ({ ...s, docs: { ...s.docs, [key]: { ...s.docs[key], status, note } } })),
    uploadDoc(id, key, file) {
      rememberFile(id, key, file)
      const meta: DocFile = { name: file.name, type: file.type, size: file.size }
      patchStudent(id, (s) => ({ ...s, docs: { ...s.docs, [key]: { status: 'pending', uploadedAt: '2026-10-06', file: meta } } }))
    },
    updateArrival: (id, patch) => patchStudent(id, (s) => (s.arrival ? { ...s, arrival: { ...s.arrival, ...patch } } : s)),
    addStudent(input) {
      const n = Math.max(0, ...state.students.map((s) => Number(s.id.slice(1)))) + 1
      const { fees, stage, ...rest } = input
      const st: Student = {
        ...rest, id: 's' + n, applications: [], stage: stage ?? 1,
        createdAt: '2026-10-06', updatedAt: '2026-10-06', fees: fees ?? { total: 6500, paid: 0 }, docs: blankDocs(),
      }
      setState((p) => ({ ...p, students: [st, ...p.students] }))
      return st
    },
    updateStudent: (id, input) => patchStudent(id, (s) => ({ ...s, ...input })),
    removeStudent: (id) => setState((p) => {
      const threads = { ...p.threads }
      delete threads[id]
      return { ...p, students: p.students.filter((s) => s.id !== id), threads }
    }),
    addApplication: (id, universityId) => patchStudent(id, (s) => (s.applications.some((a) => a.universityId === universityId) ? s : { ...s, applications: [...s.applications, { universityId, status: s.stage >= 4 ? 'submitted' : 'preparing' }] })),
    removeApplication: (id, universityId) => patchStudent(id, (s) => ({ ...s, applications: s.applications.filter((a) => a.universityId !== universityId) })),
    setApplicationStatus: (id, universityId, status) => patchStudent(id, (s) => ({ ...s, applications: s.applications.map((a) => (a.universityId === universityId ? withDates(a, { status }) : a)) })),
    updateApplication: (id, universityId, patch) => patchStudent(id, (s) => ({ ...s, applications: s.applications.map((a) => (a.universityId === universityId ? withDates(a, patch) : a)) })),
    acceptOffer: (id, universityId) => patchStudent(id, (s) => ({
      ...s,
      applications: s.applications.map((a) => (a.universityId === universityId
        ? { ...a, accepted: true }
        : { ...a, accepted: undefined, status: a.status === 'rejected' ? a.status : 'closed' })),
    })),
    addStaff: (st) => setState((p) => ({ ...p, staff: [...p.staff, { ...st, id: 'x' + Date.now().toString(36) }] })),
    updateStaff: (id, patch) => setState((p) => ({ ...p, staff: p.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
    removeStaff: (id) => setState((p) => ({ ...p, staff: p.staff.filter((s) => s.id !== id) })),
    addUniversity: (u) => setState((p) => ({ ...p, universities: [...p.universities, { ...u, id: 'u' + Date.now().toString(36) }] })),
    updateUniversity: (id, patch) => setState((p) => ({ ...p, universities: p.universities.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
    removeUniversity: (id) => setState((p) => ({ ...p, universities: p.universities.filter((u) => u.id !== id) })),
    sendMessage: (id, from, text) => setState((p) => ({
      ...p, threads: { ...p.threads, [id]: [...(p.threads[id] ?? []), { from, text, at: new Date().toISOString() }] },
    })),
    resetDemo: () => setState(seed(state.session)),
  }), [state, patchStudent])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('StoreProvider missing')
  return v
}

/** Look up a staff member, e.g. a student's advisor. */
export function useStaffMember(id?: string) {
  const { staff } = useStore()
  return staff.find((s) => s.id === id)
}
