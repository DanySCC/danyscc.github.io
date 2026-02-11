# Daily News Digest — Generation Instructions

## Purpose
Generate a fresh, beautiful HTML news digest and push to GitHub twice daily (07:00 and 13:00).

## Rules
1. **No duplicates** — If a story appeared in the morning, don't repeat it at 13:00
2. **More is better** — Aim for 10-15 unique news items per tab (not just 5)
3. **Tone by category:**
   - **Crypto tab** → UNBIASED. Just the facts. No spin positive or negative.
   - **KOL tab** → UNBIASED summary of what top voices are discussing. No opinion.
   - **AI tab** → Positive/interesting focus (innovations, breakthroughs)
   - **World tab** → Neutral. Critical events only if truly important.
4. **Critical news** — Market Alert only for real crashes >10%, major hacks, bans
5. **Credible sources only** — See approved sources list below
6. **No fluff** — Real news, real impact

## Approved Sources

### Crypto & Bitcoin
- CoinDesk, CoinTelegraph, Decrypt, The Block
- CoinMarketCap, CoinGecko blogs
- Watcher.Guru (@WatcherGuru)
- Glassnode insights
- Binance news, Coinbase blog
- Reuters crypto, Bloomberg crypto

### AI & Tech
- TechCrunch, The Verge, Wired
- VentureBeat AI, MIT Tech Review
- Ars Technica, Hacker News top stories

### Global News
- Reuters, BBC, AP News
- Bloomberg, Financial Times
- Only major geopolitical / economic events

## Market Alert Rules
Show the red alert banner ONLY for:
- BTC/ETH crash > 10% in 24h
- Major exchange hack
- Regulatory ban/action
- Critical security vulnerability
- Major protocol failure

Otherwise: hide the alert banner (set class "market-alert hidden")

## HTML Template
The template is at: /home/kaff/.openclaw/private/news/index.html
Also copy to: /home/kaff/.openclaw/workspace/daily-news/index.html

## Steps to Follow
1. Search Brave for latest news in each category (use 3-5 searches per category)
2. Collect 10-15 unique stories per tab
3. Deduplicate — same story from different sources = pick the best one
4. Update the HTML template with fresh news cards
5. Update the date in the header
6. Update/hide the Market Alert based on rules above
7. Copy updated HTML to both locations above
8. Push to GitHub: `cd /home/kaff/temp-github-fix && git pull && cp /home/kaff/.openclaw/private/news/index.html daily-news/index.html && git add . && git config user.email "bobitza@openclaw.ai" && git config user.name "Bobitza" && git commit -m "News update $(date '+%Y-%m-%d %H:%M')" && git push`
9. Send Telegram notification to Dany

## KOL Tab — Synthesized Discussions Feed
The KOL tab shows **recent discussions and takes** from top crypto voices (last 24h).

**IMPORTANT: All KOL cards MUST be clickable and link to the actual X/Twitter post!**

**How to generate:**
1. Search for recent posts/discussions from each KOL (Twitter/X, ideally within last 24 hours)
2. **Capture the actual tweet/post URL** (e.g., `https://x.com/username/status/1234567890`)
3. Synthesize their key points, hot takes, or discussions into brief news items
4. Format as clickable `<a>` elements (see format below)

**Required format for each KOL card:**
```html
<a href="https://x.com/USERNAME/status/TWEET_ID" class="kol-card" target="_blank">
    <div class="kol-header">
        <div class="kol-avatar" style="background: linear-gradient(135deg, #COLOR1, #COLOR2)">INITIALS</div>
        <div class="kol-info">
            <div class="kol-name">Full Name <span class="kol-badge badge-TYPE">TYPE</span></div>
            <div class="kol-handle">@username</div>
        </div>
        <span class="kol-time">TIME_AGO</span>
    </div>
    <p class="kol-text">Brief summary of the discussion/take (1-2 sentences max).</p>
</a>
```

**Key requirements:**
- `href` must be the actual X.com post URL (not profile link!)
- `target="_blank"` to open in new tab
- `class="kol-card"` enables hover effects and clickability
- Use timestamp like "3 hours ago", "Yesterday", "12 hours ago"
- Badge types: `badge-market`, `badge-education`, or `badge-news`

**Example (with real URL structure):**
```html
<a href="https://x.com/cz_binance/status/1887654321098765432" class="kol-card" target="_blank">
    <div class="kol-header">
        <div class="kol-avatar" style="background: linear-gradient(135deg, #f7931a, #f59e0b)">CZ</div>
        <div class="kol-info">
            <div class="kol-name">CZ <span class="kol-badge badge-market">Market</span></div>
            <div class="kol-handle">@cz_binance</div>
        </div>
        <span class="kol-time">3 hours ago</span>
    </div>
    <p class="kol-text">Discusses new regulatory framework for crypto exchanges in Asia and implications for global markets.</p>
</a>
```

**KOL List to Track:**
- CZ (@cz_binance) — Binance founder, market mover — Gradient: `#f7931a, #f59e0b`
- Elon Musk (@elonmusk) — Dogecoin champion, sentiment driver — Gradient: `#6b7280, #374151`
- Vitalik Buterin (@VitalikButerin) — Ethereum creator — Gradient: `#3b82f6, #6366f1`
- Michael Saylor (@saylor) — Bitcoin maximalist, MicroStrategy CEO — Gradient: `#f97316, #dc2626`
- Raoul Pal (@RaoulGMI) — Macro analyst, RealVision CEO — Gradient: `#10b981, #059669`
- Arthur Hayes (@CryptoHayes) — BitMEX founder, macro predictions — Gradient: `#ef4444, #b91c1c`
- Anthony Pompliano (@APompliano) — Bitcoin evangelist — Gradient: `#f7931a, #d97706`
- Benjamin Cowen (@intocryptoverse) — Data-driven analyst — Gradient: `#8b5cf6, #6d28d9`
- Scott Melker (@scottmelker) — "Wolf of All Streets", trading insights — Gradient: `#14b8a6, #0891b2`
- Mert (@0xMert_) — Helius co-founder, Solana ecosystem — Gradient: `#8b5cf6, #7c3aed`
- Watcher.Guru (@WatcherGuru) — Breaking crypto news — Gradient: `#22c55e, #16a34a`
- Coin Bureau (@coinbureau) — Educational content, project reviews — Gradient: `#a855f7, #9333ea`

**How to find tweet URLs:**
- Search for recent tweets from each KOL on X/Twitter
- Right-click post → Copy link (or use share button)
- URL format: `https://x.com/[username]/status/[tweet_id]`
- Alternative: `https://twitter.com/[username]/status/[tweet_id]` (redirects to x.com)

**Output:** Clickable cards with actual tweet links, showing what top voices are saying RIGHT NOW.
