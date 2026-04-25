export function generateSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  )
}

export async function generateUniqueSlug(
  input: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = generateSlug(input)
  if (!(await checkExists(base))) return base
  let n = 1
  while (true) {
    const candidate = `${base}-${n}`
    if (!(await checkExists(candidate))) return candidate
    n++
  }
}
