import yaml from 'js-yaml'

export function makePubspec(
  input: string,
  pkg: string | { git: { url: string; path: string } }
): string {
  const data = (yaml.load(input) as any) ?? {}

  return yaml.dump({
    ...data,
    dependencies: {
      ...(data?.dependencies ?? {}),
      vercel_dart: pkg,
    },
  })
}
