export function slugify(input: string): string {
  return input.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
}
