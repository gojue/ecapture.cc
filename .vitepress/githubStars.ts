const cacheKey = 'ecapture:github-stars'
const cacheLifetime = 60 * 60 * 1000
type StarCache = { count: number; fetchedAt: number }

function isStarCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

export function formatGitHubStars(count: number, zh: boolean): string {
  const divisor = zh ? 10000 : 1000
  if (count < divisor) return String(count)
  const rounded = Math.round(count / (divisor / 10)) / 10
  return `${rounded.toFixed(1)}${zh ? '万' : 'K'}`
}

/** Cache optional metadata; an unavailable API must not break the repository link. */
export async function loadGitHubStars(signal?: AbortSignal): Promise<number | null> {
  if (typeof window === 'undefined' || signal?.aborted) return null
  let cached: StarCache | null = null
  try {
    const value = JSON.parse(window.localStorage.getItem(cacheKey) || 'null')
    if (value && isStarCount(value.count) && Number.isFinite(value.fetchedAt)
      && value.fetchedAt > 0 && value.fetchedAt <= Date.now()) cached = value
  } catch {
    // Storage can be disabled or contain obsolete data.
  }
  if (cached && Date.now() - cached.fetchedAt < cacheLifetime) return cached.count

  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  const timeout = setTimeout(abort, 6000)
  try {
    const response = await fetch('https://api.github.com/repos/gojue/ecapture', { signal: controller.signal })
    if (!response.ok) return cached?.count ?? null
    const data = await response.json()
    if (!isStarCount(data.stargazers_count)) return cached?.count ?? null
    if (signal?.aborted) return null
    const count = data.stargazers_count
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify({ count, fetchedAt: Date.now() }))
    } catch {
      // The live value remains usable even when storage is unavailable.
    }
    return count
  } catch {
    return signal?.aborted ? null : cached?.count ?? null
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}
