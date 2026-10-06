// All data in this file is mock data for the demo. Nothing here comes from a real student.
import i18n from '../i18n'

export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const STAGES: { id: StageId }[] = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]

export type DocKey =
  | 'passport' | 'certificate' | 'transcript' | 'recommendation'
  | 'language' | 'medical' | 'police' | 'financial' | 'photo'

export const DOC_TYPES: { key: DocKey; required: boolean }[] = [
  { key: 'passport', required: true },
  { key: 'certificate', required: true },
  { key: 'transcript', required: true },
  { key: 'recommendation', required: false },
  { key: 'language', required: false },
  { key: 'medical', required: true },
  { key: 'police', required: true },
  { key: 'financial', required: false },
  { key: 'photo', required: true },
]

export type DocStatus = 'verified' | 'pending' | 'rejected' | 'missing'
export interface DocFile { name: string; type: string; size: number }
export interface DocState { status: DocStatus; note?: string; uploadedAt?: string; file?: DocFile }

export type CityId = 'shanghai' | 'beijing' | 'nanjing' | 'jinan' | 'hangzhou'

export interface University {
  id: string
  nameEn: string
  /** Arabic name; seeded universities fall back to the i18n file. */
  nameAr?: string
  zh: string
  /** A CityId for the known hubs, or free text for any other city. */
  city: string
  programs: string[]
  languages: ('English' | 'Chinese')[]
  fee: number
  tuition: [number, number]
  tone: string
  website?: string
  contactName?: string
  email?: string
  phone?: string
  scholarships?: ScholarshipId[]
  intakes?: string[]
  partnerSince?: string
  status?: 'active' | 'paused'
  notes?: string
}

export const CITY_IDS: CityId[] = ['shanghai', 'beijing', 'nanjing', 'hangzhou', 'jinan']

export const UNIVERSITIES: University[] = [
  { id: 'fudan', nameEn: 'Fudan University', zh: '复旦', city: 'shanghai', programs: ['business', 'intlRelations', 'medicine', 'chineseLang'], languages: ['English', 'Chinese'], fee: 800, tuition: [26000, 40000], tone: 'from-crimson-700 to-crimson-500', website: 'https://www.fudan.edu.cn', contactName: 'Wei Zhang', email: 'intl@fudan.example', phone: '+86 21 5566 0001', scholarships: ['cscA', 'cscB', 'silk'], intakes: ['mar2027', 'sep2027'], partnerSince: '2019', status: 'active' },
  { id: 'seu', nameEn: 'Southeast University', zh: '东南', city: 'nanjing', programs: ['engineering', 'cs', 'architecture', 'appliedSci'], languages: ['English', 'Chinese'], fee: 600, tuition: [22000, 35000], tone: 'from-ink to-ink-2', website: 'https://www.seu.edu.cn', contactName: 'Li Na', email: 'iso@seu.example', phone: '+86 25 5209 0002', scholarships: ['cscB', 'prov'], intakes: ['mar2027', 'sep2027'], partnerSince: '2020', status: 'active' },
  { id: 'sdu', nameEn: 'Shandong University', zh: '山东', city: 'jinan', programs: ['mbbs', 'tcm', 'humanities', 'science'], languages: ['English', 'Chinese'], fee: 400, tuition: [20000, 38000], tone: 'from-gold-700 to-gold-500', website: 'https://www.sdu.edu.cn', contactName: 'Chen Hao', email: 'admissions@sdu.example', phone: '+86 531 8836 0003', scholarships: ['cscB', 'prov', 'silk'], intakes: ['mar2027', 'sep2027'], partnerSince: '2020', status: 'active' },
  { id: 'bfsu', nameEn: 'Beijing Foreign Studies University', zh: '北外', city: 'beijing', programs: ['chineseLang', 'translation', 'intlRelations', 'media'], languages: ['Chinese', 'English'], fee: 500, tuition: [18000, 28000], tone: 'from-crimson-800 to-crimson-600', website: 'https://www.bfsu.edu.cn', contactName: 'Zhao Min', email: 'iso@bfsu.example', phone: '+86 10 8881 0004', scholarships: ['cscA', 'cscB'], intakes: ['mar2027', 'sep2027'], partnerSince: '2021', status: 'active' },
  { id: 'zju', nameEn: 'Zhejiang University', zh: '浙大', city: 'hangzhou', programs: ['cs', 'engineering', 'economics', 'medicine'], languages: ['English', 'Chinese'], fee: 800, tuition: [24000, 42000], tone: 'from-ink-2 to-ink-3', website: 'https://www.zju.edu.cn', contactName: 'Liu Yang', email: 'intl@zju.example', phone: '+86 571 8795 0005', scholarships: ['cscA', 'cscB', 'prov'], intakes: ['mar2027', 'sep2027'], partnerSince: '2021', status: 'active' },
  { id: 'nju', nameEn: 'Nanjing University', zh: '南大', city: 'nanjing', programs: ['physics', 'literature', 'intlBusiness', 'chineseLang'], languages: ['Chinese', 'English'], fee: 600, tuition: [21000, 36000], tone: 'from-crimson-600 to-gold-500', website: 'https://www.nju.edu.cn', contactName: 'Sun Qi', email: 'iso@nju.example', phone: '+86 25 8359 0006', scholarships: ['cscB', 'silk'], intakes: ['mar2027', 'sep2027'], partnerSince: '2022', status: 'active' },
  { id: 'tongji', nameEn: 'Tongji University', zh: '同济', city: 'shanghai', programs: ['architecture', 'civil', 'design', 'medicine'], languages: ['English', 'Chinese'], fee: 500, tuition: [23000, 36000], tone: 'from-ink to-crimson-700', website: 'https://www.tongji.edu.cn', contactName: 'Zhou Lei', email: 'intl@tongji.example', phone: '+86 21 6598 0007', scholarships: ['cscB', 'prov'], intakes: ['mar2027', 'sep2027'], partnerSince: '2022', status: 'active' },
  { id: 'bnu', nameEn: 'Beijing Normal University', zh: '北师', city: 'beijing', programs: ['education', 'psychology', 'chineseLang', 'economics'], languages: ['Chinese', 'English'], fee: 400, tuition: [17000, 26000], tone: 'from-gold-500 to-crimson-500', website: 'https://www.bnu.edu.cn', contactName: 'Wu Fang', email: 'iso@bnu.example', phone: '+86 10 5880 0008', scholarships: ['cscB', 'silk'], intakes: ['mar2027', 'sep2027'], partnerSince: '2023', status: 'active' },
]
export const uni = (id: string) => UNIVERSITIES.find((u) => u.id === id)
export const uniName = (u: Pick<University, 'id' | 'nameEn' | 'nameAr'>) =>
  i18n.language === 'ar' ? u.nameAr ?? i18n.t(`data.unis.${u.id}.name`, { defaultValue: u.nameEn }) : u.nameEn
export const cityName = (c: string) => i18n.t(`data.cities.${c}`, { defaultValue: c })

export type ScholarshipId = 'cscA' | 'cscB' | 'prov' | 'silk' | 'self'
export const SCHOLARSHIP_IDS: ScholarshipId[] = ['cscA', 'cscB', 'prov', 'silk', 'self']

export type StaffRole = 'admissions' | 'scholarship' | 'visa' | 'ground' | 'manager'
export const STAFF_ROLES: StaffRole[] = ['admissions', 'scholarship', 'visa', 'ground', 'manager']
export const ADVISOR_ROLES: StaffRole[] = ['admissions', 'scholarship', 'visa']
export type Hub = 'shanghai' | 'beijing'

export interface Staff {
  id: string
  name: string
  nameEn: string
  role: StaffRole
  email: string
  phone: string
  /** only for ground team members */
  hub?: Hub
}

export const SEED_STAFF: Staff[] = [
  { id: 'a1', name: 'لينا الخطيب', nameEn: 'Lina Al-Khatib', role: 'admissions', email: 'lina@demo.com', phone: '+971 50 000 0101' },
  { id: 'a2', name: 'كريم المنصوري', nameEn: 'Karim El Mansouri', role: 'scholarship', email: 'karim@demo.com', phone: '+971 50 000 0102' },
  { id: 'a3', name: 'هدى بوزيد', nameEn: 'Houda Bouzid', role: 'visa', email: 'houda@demo.com', phone: '+971 50 000 0103' },
  { id: 'g1', name: 'مازن الشريف', nameEn: 'Mazen Al-Sharif', role: 'ground', email: 'mazen@demo.com', phone: '+86 138 0000 1021', hub: 'shanghai' },
  { id: 'g2', name: 'رنا العمري', nameEn: 'Rana Al-Omari', role: 'ground', email: 'rana@demo.com', phone: '+86 138 0000 1022', hub: 'shanghai' },
  { id: 'g3', name: 'سامي بن ناصر', nameEn: 'Sami Ben Nasser', role: 'ground', email: 'sami@demo.com', phone: '+86 139 0000 2031', hub: 'beijing' },
]
export const stname = (s: Pick<Staff, 'name' | 'nameEn'>) => (i18n.language === 'en' ? s.nameEn : s.name)

export interface Arrival {
  date: string
  time: string
  /** 'TBD' until the student submits flight details */
  flight: string
  airport: 'PVG' | 'PEK'
  pickup: 'pending' | 'assigned' | 'done'
  /** ground team member id (see GROUND_TEAM) */
  driver?: string
  housing: 'pending' | 'booked' | 'checked-in'
}

export type Level = 'bachelor' | 'master' | 'phd' | 'language'
export type SourceId = 'youtube' | 'instagram' | 'tiktok' | 'telegram' | 'website' | 'friend' | 'other'
export const SOURCE_IDS: SourceId[] = ['youtube', 'instagram', 'tiktok', 'telegram', 'website', 'friend', 'other']

/** What the university has decided. `admitted` is the pre-admission notice; `closed` means the student accepted another offer. */
export type AppStatus = 'preparing' | 'submitted' | 'review' | 'admitted' | 'rejected' | 'closed'
export const APP_TONE = { preparing: 'neutral', submitted: 'warn', review: 'warn', admitted: 'ok', rejected: 'bad', closed: 'neutral' } as const
export const APP_STATUSES: AppStatus[] = ['preparing', 'submitted', 'review', 'admitted', 'rejected', 'closed']
/** The scholarship decision comes from the CSC and arrives months after the university's. */
export type CscResult = 'pending' | 'selected' | 'notSelected'
export const CSC_RESULTS: CscResult[] = ['pending', 'selected', 'notSelected']
/** CSC allows an applicant at most three applications a year; the picker warns beyond this. */
export const MAX_UNIVERSITIES = 3
export interface Application {
  universityId: string
  status: AppStatus
  /** The number the university gave this application. */
  appNo?: string
  feePaid?: boolean
  submittedAt?: string
  decidedAt?: string
  cscResult?: CscResult
  /** The student confirmed this offer. Only one application can be accepted. */
  accepted?: boolean
  /** JW201 (scholarship) or JW202 (self-funded) visa form has been issued. */
  jwSent?: boolean
}

export interface Student {
  id: string
  name: string
  nameEn?: string
  email: string
  phone: string
  /** country key, see data.countries in the locale files */
  country: string
  age: number
  level: Level
  /** key of data.programs, or free text typed by an applicant */
  major: string
  gpa: number
  /** universities the admin picked for this student; the first one is the main choice */
  applications: Application[]
  scholarshipId: ScholarshipId
  stage: StageId
  advisorId: string
  source: SourceId
  createdAt: string
  updatedAt: string
  /** key of data.intake */
  intake: string
  fees: { total: number; paid: number }
  docs: Record<DocKey, DocState>
  arrival?: Arrival
  reference?: string
}

export const primaryUni = (s: Pick<Student, 'applications'>) => s.applications[0]?.universityId

/** Students are seeded with an Arabic name and an English transliteration. */
export const sname = (s: Pick<Student, 'name' | 'nameEn'>) => (i18n.language === 'en' && s.nameEn ? s.nameEn : s.name)

type Seed = [string, string, string, number, Level, string, number, string, ScholarshipId, StageId, string, SourceId, string, string, number, number]

const SEEDS: Seed[] = [
  // name, nameEn, country, age, level, major, gpa, uni, scholarship, stage, advisor, source, created, intake, total, paid
  ['ياسمين بن علي', 'Yasmine Ben Ali', 'tunisia', 21, 'bachelor', 'business', 86, 'fudan', 'cscB', 5, 'a1', 'youtube', '2026-07-03', 'sep2027', 6500, 4500],
  ['أمين بوعزيز', 'Amine Bouaziz', 'algeria', 23, 'master', 'cs', 82, 'zju', 'cscB', 4, 'a2', 'instagram', '2026-07-19', 'sep2027', 6500, 3500],
  ['ريم الحسني', 'Rim El Hassani', 'morocco', 19, 'bachelor', 'mbbs', 91, 'sdu', 'cscA', 6, 'a3', 'tiktok', '2026-06-02', 'mar2027', 7000, 7000],
  ['عمر الخوالدة', 'Omar Khawaldeh', 'jordan', 22, 'bachelor', 'civil', 78, 'tongji', 'prov', 3, 'a1', 'telegram', '2026-08-11', 'sep2027', 6500, 2000],
  ['مريم أبو سمرة', 'Mariam Abu Samra', 'palestine', 24, 'master', 'intlRelations', 88, 'fudan', 'cscA', 5, 'a2', 'youtube', '2026-05-27', 'sep2027', 7000, 5000],
  ['يوسف الطرابلسي', 'Youssef Trabelsi', 'tunisia', 20, 'language', 'chineseLang', 72, 'bfsu', 'self', 7, 'a3', 'instagram', '2026-04-14', 'mar2027', 4800, 4800],
  ['خديجة بلقاسم', 'Khadija Belkacem', 'algeria', 26, 'master', 'translation', 84, 'bfsu', 'cscB', 2, 'a1', 'youtube', '2026-09-08', 'sep2027', 6500, 1500],
  ['زكريا العلوي', 'Zakaria El Alaoui', 'morocco', 21, 'bachelor', 'cs', 89, 'seu', 'cscB', 4, 'a2', 'tiktok', '2026-07-30', 'sep2027', 6500, 3500],
  ['هبة النعيمي', 'Heba Al-Nuaimi', 'jordan', 18, 'bachelor', 'tcm', 80, 'sdu', 'prov', 1, 'a3', 'website', '2026-10-01', 'sep2027', 6500, 500],
  ['سيف الدين بن حمزة', 'Seifeddine Ben Hamza', 'tunisia', 25, 'master', 'economics', 85, 'zju', 'silk', 3, 'a1', 'telegram', '2026-08-22', 'sep2027', 6500, 2000],
  ['لجين الفاسي', 'Lojain El Fassi', 'morocco', 22, 'bachelor', 'media', 83, 'bfsu', 'cscB', 8, 'a3', 'instagram', '2026-02-10', 'mar2027', 6500, 6500],
  ['رامي الشوا', 'Rami Al-Shawa', 'palestine', 20, 'bachelor', 'architecture', 90, 'seu', 'cscA', 6, 'a2', 'youtube', '2026-05-12', 'mar2027', 7000, 6000],
  ['نور الهدى مزياني', 'Nour El Houda Meziani', 'algeria', 19, 'language', 'chineseLang', 70, 'nju', 'self', 2, 'a1', 'tiktok', '2026-09-15', 'mar2027', 4800, 1200],
  ['طارق بن سالم', 'Tarek Ben Salem', 'tunisia', 27, 'phd', 'engineering', 87, 'zju', 'cscA', 4, 'a2', 'youtube', '2026-06-25', 'sep2027', 7000, 4000],
  ['آية المراكشي', 'Aya El Marrakchi', 'morocco', 21, 'bachelor', 'psychology', 79, 'bnu', 'prov', 3, 'a3', 'instagram', '2026-08-04', 'sep2027', 6500, 2000],
  ['بلال الزعبي', 'Bilal Al-Zoubi', 'jordan', 23, 'master', 'business', 81, 'fudan', 'cscB', 1, 'a1', 'website', '2026-10-04', 'sep2027', 6500, 500],
  ['شيماء بن عيسى', 'Chaimaa Ben Aissa', 'algeria', 20, 'bachelor', 'mbbs', 93, 'sdu', 'cscA', 5, 'a3', 'tiktok', '2026-06-18', 'mar2027', 7000, 5500],
  ['حمزة أبو عودة', 'Hamza Abu Odeh', 'palestine', 22, 'bachelor', 'cs', 85, 'tongji', 'cscB', 7, 'a2', 'telegram', '2026-03-29', 'mar2027', 6500, 6500],
  ['إيناس الدريدي', 'Ines Dridi', 'tunisia', 24, 'master', 'education', 86, 'bnu', 'cscB', 2, 'a1', 'youtube', '2026-09-20', 'sep2027', 6500, 1500],
  ['وسيم بنعمر', 'Wassim Benomar', 'morocco', 20, 'language', 'chineseLang', 68, 'nju', 'self', 6, 'a3', 'instagram', '2026-08-28', 'mar2027', 4800, 4800],
]

const DOC_KEYS = DOC_TYPES.map((d) => d.key)

function buildDocs(stage: StageId, i: number): Record<DocKey, DocState> {
  const out = {} as Record<DocKey, DocState>
  DOC_KEYS.forEach((k, idx) => {
    if (stage >= 4) out[k] = { status: 'verified', uploadedAt: '2026-08-0' + ((idx % 8) + 1) }
    else if (stage === 3) out[k] = idx === 5 && i % 2 ? { status: 'pending', uploadedAt: '2026-09-21' } : { status: 'verified', uploadedAt: '2026-09-02' }
    else if (stage === 2) {
      const m = (idx + i) % 5
      out[k] = m === 0 ? { status: 'missing' }
        : m === 1 ? { status: 'rejected', note: k === 'police' ? 'data.reasons.expired' : k === 'transcript' ? 'data.reasons.translation' : 'data.reasons.blur', uploadedAt: '2026-09-24' }
        : m === 2 ? { status: 'pending', uploadedAt: '2026-10-02' }
        : { status: 'verified', uploadedAt: '2026-09-23' }
    } else {
      out[k] = idx < 2 ? { status: 'pending', uploadedAt: '2026-10-03' } : { status: 'missing' }
    }
  })
  return out
}

const arrivalFor = (stage: StageId, i: number, uniId: string): Arrival | undefined => {
  if (stage < 6) return undefined
  const airport = uniId === 'bfsu' || uniId === 'bnu' ? 'PEK' : 'PVG'
  const flights = ['EK 304', 'QR 872', 'TK 26', 'MU 214', 'CZ 332', 'EY 888']
  const dates = ['2026-10-14', '2026-10-21', '2026-11-02', '2026-09-05', '2026-09-12']
  const done = stage >= 7
  return {
    date: dates[i % dates.length], time: ['06:40', '14:15', '21:05', '09:30'][i % 4], flight: flights[i % flights.length], airport,
    pickup: done ? 'done' : i % 2 ? 'assigned' : 'pending',
    driver: done || i % 2 ? (airport === 'PEK' ? 'g3' : i % 3 ? 'g1' : 'g2') : undefined,
    housing: done ? 'checked-in' : i % 2 ? 'booked' : 'pending',
  }
}

export const DEMO_STUDENT_ID = 's1'
export const DEMO_STUDENT = { email: 'student@demo.com', password: 'student123' }
export const ADMIN_LOGIN = { email: 'admin@admin.com', password: 'admin123@' }

export function seedStudents(): Student[] {
  return SEEDS.map((s, i) => {
    const [name, nameEn, country, age, level, major, gpa, universityId, scholarshipId, stage, advisorId, source, createdAt, intake, total, paid] = s
    // universities are chosen by the admin at stage 3, so earlier stages have none yet
    const k = i % 5
    const backups = UNIVERSITIES.filter((u) => u.id !== universityId).slice(k, k + 1)
    const applications: Application[] = stage < 3 ? [] : [universityId, ...backups.map((u) => u.id)].map((id, n) => {
      const first = n === 0
      const sent = stage >= 4
      const decided = stage >= 5 && first
      const accepted = stage >= 6 && first
      return {
        universityId: id,
        status: stage >= 6 && !first ? 'closed' : decided ? 'admitted' : sent ? 'submitted' : 'preparing',
        appNo: sent ? `${id.toUpperCase()}-26-${String(2100 + i * 17 + n * 5)}` : undefined,
        feePaid: sent,
        submittedAt: sent ? '2026-09-1' + (n + 2) : undefined,
        decidedAt: decided ? '2026-09-28' : undefined,
        cscResult: decided && scholarshipId !== 'self' ? 'selected' : 'pending',
        accepted: accepted || undefined,
        jwSent: stage >= 7 && first ? true : undefined,
      }
    })
    return {
      id: 's' + (i + 1), name, nameEn, country, age, level, major, gpa, applications, scholarshipId, stage, advisorId, source, createdAt, intake,
      email: i === 0 ? DEMO_STUDENT.email : `student${i + 1}@mail.com`,
      phone: `+${['216', '213', '212', '962', '970'][i % 5]} 5${(i * 7919) % 90 + 10} ${(i * 3571) % 900 + 100} ${(i * 1237) % 900 + 100}`,
      updatedAt: i % 3 === 0 ? '2026-10-05' : i % 3 === 1 ? '2026-10-03' : '2026-09-29',
      fees: { total, paid },
      docs: buildDocs(stage, i),
      arrival: arrivalFor(stage, i, universityId),
      reference: stage >= 4 ? `FD-26-${String(1040 + i * 13)}` : undefined,
    }
  })
}

/** Seeded messages carry a translation key; messages typed in the demo carry plain text. */
export interface Msg { from: 'student' | 'advisor' | 'system'; text?: string; key?: string; at: string }
export const DEMO_THREAD: Msg[] = [
  { from: 'system', key: 'data.thread.t0', at: '2026-07-03T10:12:00' },
  { from: 'advisor', key: 'data.thread.t1', at: '2026-07-03T10:20:00' },
  { from: 'student', key: 'data.thread.t2', at: '2026-07-04T18:40:00' },
  { from: 'advisor', key: 'data.thread.t3', at: '2026-07-05T09:05:00' },
  { from: 'system', key: 'data.thread.t4', at: '2026-08-20T13:00:00' },
  { from: 'advisor', key: 'data.thread.t5', at: '2026-10-04T11:30:00' },
]

/** month is a 0-based index, formatted per language at render time */
export const MONTHLY_LEADS = [
  { month: 3, leads: 64, enrolled: 9 },
  { month: 4, leads: 88, enrolled: 14 },
  { month: 5, leads: 121, enrolled: 19 },
  { month: 6, leads: 143, enrolled: 26 },
  { month: 7, leads: 109, enrolled: 31 },
  { month: 8, leads: 172, enrolled: 38 },
  { month: 9, leads: 96, enrolled: 12 },
]
