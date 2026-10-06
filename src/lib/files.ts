// Uploaded files are kept in memory only (object URLs), so the demo needs no backend and localStorage stays small.
// After a page reload the document metadata remains but the file preview falls back to a sample sheet.
const files = new Map<string, { url: string; type: string; name: string }>()

export const fileKey = (studentId: string, docKey: string) => `${studentId}:${docKey}`

export function rememberFile(studentId: string, docKey: string, file: File) {
  const k = fileKey(studentId, docKey)
  const old = files.get(k)
  if (old) URL.revokeObjectURL(old.url)
  files.set(k, { url: URL.createObjectURL(file), type: file.type, name: file.name })
}

export const getFile = (studentId: string, docKey: string) => files.get(fileKey(studentId, docKey))

export const ACCEPT = 'image/*,.pdf,.doc,.docx'
export const MAX_BYTES = 10 * 1024 * 1024
export const isAllowed = (f: File) => /^image\//.test(f.type) || /\.(pdf|docx?|png|jpe?g|webp|heic)$/i.test(f.name)
export const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`)
