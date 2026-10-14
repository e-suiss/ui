const token = process.env.CLOUDFLARE_API_TOKEN
const zone = process.env.CLOUDFLARE_ZONE_ID
const hosts =
  process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["ui.suiss.app"]

if (!token || !zone) {
  console.error(
    "Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID in .env.deploy or the environment."
  )
  process.exit(1)
}

const response = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hosts }),
  }
)
const result = await response.json()
console.log(
  result.success ? `Purged ${hosts.join(", ")}` : JSON.stringify(result.errors)
)
if (!result.success) process.exit(1)
