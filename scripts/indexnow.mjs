const key = "d7238253730183adfa7e236e91fb09cb";
const hosts = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["ui.suiss.app", "uim.suiss.app"];

for (const host of hosts) {
  const sitemap = await fetch(`https://${host}/sitemap.xml`).then((response) => response.text());
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
  });
  console.log(`${host}: ${urlList.length} URLs, ${response.status} ${response.statusText}`);
}
