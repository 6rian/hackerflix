export function generateSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled'
  );
}

export async function generateUniqueSlug(
  input: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = generateSlug(input);
  if (!(await checkExists(base))) return base;
  for (let n = 1; n <= 1000; n++) {
    const candidate = `${base}-${n}`;
    if (!(await checkExists(candidate))) return candidate;
  }
  throw new Error(`Could not generate a unique slug for "${input}" after 1000 attempts`);
}
