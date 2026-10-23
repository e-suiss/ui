import { parseArgs } from "node:util"

const KEY = "d7238253730183adfa7e236e91fb09cb"
const ENDPOINT = "https://api.indexnow.org/indexnow"
const BATCH = 10_000
const ATTEMPTS = 4
const DAY = 24 * 60 * 60 * 1000
const URL_ENTRY = /<url>([\s\S]*?)<\/url>/g
const LOC = /<loc>([^<]+)<\/loc>/
const LASTMOD = /<lastmod>([^<]+)<\/lastmod>/

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    since: { type: "string", default: "" },
    days: { type: "string", default: "2" },
    all: { type: "boolean", default: false },
  },
})

const sitemaps =
  positionals.length > 0
    ? positionals
    : ["https://suiss.app/sitemap.xml", "https://suiss.app/ui/sitemap.xml"]
const since = values.since
  ? new Date(values.since)
  : new Date(Date.now() - Number(values.days) * DAY)

if (Number.isNaN(since.getTime())) {
  console.error(`Invalid date: ${values.since || values.days}`)
  process.exit(1)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function changedUrls(sitemap) {
  return [...sitemap.matchAll(URL_ENTRY)].flatMap(([, url]) => {
    const loc = url.match(LOC)?.[1]
    if (!loc) return []
    if (values.all) return [loc]
    const lastmod = url.match(LASTMOD)?.[1]
    return lastmod && new Date(lastmod) > since ? [loc] : []
  })
}

async function submit(host, urlList) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: KEY,
        keyLocation: `https://${host}/${KEY}.txt`,
        urlList,
      }),
    })
    console.log(
      `${host}: ${urlList.length} URLs, ${response.status} ${response.statusText}`
    )
    if (response.ok) return true
    if (response.status !== 429 || attempt === ATTEMPTS) {
      console.error(await response.text())
      return false
    }
    const retryAfter = Number(response.headers.get("retry-after"))
    const wait = Math.min(
      retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 5000,
      120_000
    )
    console.log(`${host}: rate limited, retrying in ${wait / 1000}s`)
    await sleep(wait)
  }
  return false
}

async function read(sitemap) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const response = await fetch(sitemap).catch((error) => {
      console.error(`${sitemap}: ${error.cause?.message ?? error.message}`)
      return undefined
    })
    if (response?.ok) return response
    if (response) {
      console.error(
        `${sitemap}: returned ${response.status} ${response.statusText}`
      )
      if (response.status < 500) return undefined
    }
    if (attempt < ATTEMPTS) {
      const wait = 2 ** attempt * 5000
      console.log(`${sitemap}: retrying in ${wait / 1000}s`)
      await sleep(wait)
    }
  }
  return undefined
}

let failed = false
const byHost = new Map()

for (const sitemap of sitemaps) {
  const response = await read(sitemap)
  if (!response) {
    failed = true
    continue
  }
  const { host } = new URL(sitemap)
  const urls = changedUrls(await response.text())
  byHost.set(host, [...(byHost.get(host) ?? []), ...urls])
}

for (const [host, urls] of byHost) {
  if (urls.length === 0) {
    console.log(`${host}: nothing changed since ${since.toISOString()}`)
    continue
  }
  for (let start = 0; start < urls.length; start += BATCH) {
    if (!(await submit(host, urls.slice(start, start + BATCH)))) failed = true
  }
}

if (failed) process.exit(1)
