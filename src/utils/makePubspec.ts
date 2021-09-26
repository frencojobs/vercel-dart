import yaml from 'js-yaml'

export function makePubspec(
  input: string,
  pkg: string | {git: {url: string; path: string}}
): string {
  const data = (yaml.load(input) as Record<string, unknown>) ?? {}

  return yaml.dump({
    ...data,
    dependencies: {
      ...((data?.dependencies as Record<string, unknown>) ?? {}),
      vercel_dart: pkg
    }
  })
}
