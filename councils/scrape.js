const fs = require('fs');
const path = require('path');
const https = require('https');

const RESEARCH_DIR = path.join(__dirname, 'research');

function fetchRSS(url, redirectLimit = 5) {
  return new Promise((resolve, reject) => {
    if (redirectLimit <= 0) {
      return reject(new Error('Too many redirects'));
    }
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64); ObsidianScraper/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const origin = new URL(url).origin;
          redirectUrl = new URL(redirectUrl, origin).href;
        }
        return fetchRSS(redirectUrl, redirectLimit - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    }).on('error', err => reject(err));
  });
}

function parseFeed(xml, limit = 5) {
  const items = [];
  const itemRegex = /<(item|entry)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const content = match[2];
    
    // Extract title
    const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    let title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : 'No Title';
    title = title.replace(/<[^>]*>/g, ''); // Strip HTML tags
    
    // Extract link
    let link = '';
    const linkMatch = content.match(/<link[^>]*>([\s\S]*?)<\/link>/);
    if (linkMatch) {
      link = linkMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    } else {
      const hrefMatch = content.match(/<link[^>]*href=["']([^"']+)["']/);
      link = hrefMatch ? hrefMatch[1] : '';
    }
    
    // Extract date
    const dateMatch = content.match(/<(pubDate|published|updated)>([\s\S]*?)<\/\1>/);
    const date = dateMatch ? dateMatch[2].trim().substring(0, 16) : new Date().toISOString().substring(0, 16);
    
    items.push({ title, link, date });
  }
  return items;
}

const feeds = {
  architect: [
    { name: 'Google News Architecture', url: 'https://news.google.com/rss/search?q=software+architecture+clean+code+design+patterns&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Dev.to Software Engineering', url: 'https://dev.to/feed/tag/softwareengineering' },
    { name: 'Dev.to Clean Code', url: 'https://dev.to/feed/tag/cleancode' }
  ],
  cfo: [
    { name: 'Google News Tokenomics', url: 'https://news.google.com/rss/search?q=llm+token+cost+OR+prompt+caching+OR+ai+api+pricing&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Dev.to Performance', url: 'https://dev.to/feed/tag/performance' },
    { name: 'Dev.to Serverless', url: 'https://dev.to/feed/tag/serverless' }
  ],
  orchestrator: [
    { name: 'Google News MCP & DevOps', url: 'https://news.google.com/rss/search?q=model+context+protocol+OR+mcp+server+OR+devops+automation&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Dev.to DevOps', url: 'https://dev.to/feed/tag/devops' },
    { name: 'Dev.to Tooling', url: 'https://dev.to/feed/tag/tooling' }
  ],
  niche_researcher: [
    { name: 'Google News LLMs & Claude', url: 'https://news.google.com/rss/search?q=claude+ai+OR+local+llama+OR+deepseek+OR+open+source+llm&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Google News YouTube AI', url: 'https://news.google.com/rss/search?q=site:youtube.com+llm+agents+OR+claude+code+OR+mcp+server&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Google News GitHub Repos', url: 'https://news.google.com/rss/search?q=site:github.com+model+context+protocol+OR+mcp+server+OR+claude+code&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Reddit ClaudeAI', url: 'https://www.reddit.com/r/ClaudeAI/new.rss' },
    { name: 'Reddit LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/new.rss' },
    { name: 'Reddit OpenAI', url: 'https://www.reddit.com/r/openai/new.rss' },
    { name: 'Reddit Singularity', url: 'https://www.reddit.com/r/singularity/new.rss' }
  ],
  comparative_researcher: [
    { name: 'Google News GraphRAG & Agents', url: 'https://news.google.com/rss/search?q=graphrag+OR+vector+databases+OR+competitor+ai+agents&hl=es-419&gl=US&ceid=US:es' },
    { name: 'Reddit artificial', url: 'https://www.reddit.com/r/artificial/new.rss' }
  ]
};

async function run() {
  console.log('=== RUNNING DAILY OBSIDIAN SCRAPER (NO TOKENS) ===');
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  for (const agent of Object.keys(feeds)) {
    console.log(`Fetching feeds for: ${agent}...`);
    let entries = [];
    
    for (const source of feeds[agent]) {
      try {
        const xml = await fetchRSS(source.url);
        const parsed = parseFeed(xml, 5);
        entries = entries.concat(parsed.map(p => ({ ...p, source: source.name })));
      } catch (err) {
        console.warn(`  Error fetching ${source.name}: ${err.message}`);
      }
    }
    
    // Write to agent's research file
    const filePath = path.join(RESEARCH_DIR, `${agent}_research.md`);
    let fileContent = `# Datos y Fuentes de Investigación (Scraped) — ${agent.toUpperCase()}\n\n`;
    fileContent += `Última actualización: ${dateStr}\n\n## Fuentes Recientes\n\n`;
    
    if (entries.length === 0) {
      fileContent += `*(No se pudieron recuperar noticias recientes en este ciclo)*\n`;
    } else {
      for (const item of entries) {
        fileContent += `- **[${item.source}]** [${item.title}](${item.link}) (${item.date})\n`;
      }
    }
    
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`  Updated: ${filePath}`);
  }
  
  console.log('=== SCRAPING COMPLETED ===');
}

run();
