# Matthew Berman's Advanced OpenClaw Setup - Full Analysis

**Video:** https://www.youtube.com/watch?v=Q7r--i9lLck
**Date Analyzed:** February 12, 2026

---

## 🎯 OVERVIEW

Matthew Berman runs what he claims is "the most advanced OpenClaw instance on the planet." After analyzing his 27-minute deep dive, here's everything he's doing and what we can learn.

---

## 🖥️ INFRASTRUCTURE

### Hardware Setup
- **Dedicated MacBook Air** running 24/7
- **Clamshell mode** (stays on when closed)
- **TeamViewer** installed for remote desktop access
- **Tailscale** configured for SSH access from anywhere
- Lives on his desk, always connected

**Why this matters:**
- No interruptions (never shuts down)
- Remote access from anywhere
- Dedicated resources for OpenClaw

---

## 🔌 INTERFACES

### 1. Telegram (Primary)
- **Multiple topic-based groups** (not a single DM)
- Each group = narrow, specific purpose
- **Session expiration = 1 year** (not daily resets)
- Topics: Knowledge base, Food journal, Cron updates, Video research, Self-improvement, Business analysis, Meeting prep

### 2. Slack
- Limited to 2 channels
- Only he can invoke OpenClaw (others are ignored)

### 3. CLI + Scripts
- SSH access via Tailscale
- Cursor IDE development

---

## 🤖 MODELS USED

- **Anthropic:** Opus 4.6, Sonnet, Haiku
- **Google:** Gemini 2.5 Flash (cheap classification)
- **XAI:** Grok + xArch (Twitter search)
- **OpenAI:** GPT 5.3 Codex

**Cost:** ~$150/month total (worth it for value)

---

## 🛠️ SKILLS & WORKFLOWS

### 1. Personal CRM ⭐⭐⭐
**What it does:**
- Downloads Gmail + Calendar daily
- Parses senders/participants
- De-duplicates and merges contacts
- AI classifies roles/context (Gemini 2.5 Flash - cheap!)
- Semantic indexing for natural language search
- Updates via Telegram

**Meeting Prep Automation:**
- Every morning, checks calendar
- Filters out internal-only meetings
- Provides:
  - Who you're meeting
  - Last conversation summary
  - Meeting agenda/topics

**💡 What we can steal:**
- Email parsing → CRM automation
- Morning meeting prep workflow
- Cheap Gemini for classification

---

### 2. Knowledge Base ⭐⭐⭐
**What it does:**
- Drop articles/URLs in Telegram
- Detects source type
- Extracts + normalizes content
- Chunks + embeds into vector database
- Natural language search

**Integration:**
- Articles saved here feed into video idea pipeline
- Cross-workflow reference

**💡 What we can steal:**
- Vector database for all interesting content
- Cross-skill integration (knowledge base → other workflows)

---

### 3. Video Idea Pipeline ⭐⭐
**Workflow:**
1. Drop link in Telegram → saved to knowledge base
2. Auto-posts summary to Slack team channel
3. Team decides: "make a video about this"
4. OpenClaw:
   - Researches X (Twitter)
   - Researches web
   - Queries knowledge base for related articles
   - Generates video pitches (checks for duplicates)
   - Creates hooks + outline
   - Links all sources
   - Creates Asana task
5. Confirmation sent to invoker

**Time:** ~30 seconds

**💡 What we can steal:**
- Automated research → content pipeline
- Cross-platform posting (Telegram → Slack)
- Asana/project management integration

---

### 4. Twitter/X Search (Optimized Fallback Chain) ⭐⭐⭐
**Tier system (cheapest first):**

**Tier 1: FX Twitter API** (FREE!)
- Single tweet lookup only
- No search capability

**Tier 2: twitterapi.io** ($0.15/1000 tweets)
- Search, profiles, threads
- Low-cost tier

**Tier 3: Official X API v2** ($0.005/tweet)
- Expensive but comprehensive
- Pay-per-use

**Tier 4: XAI Grok + xArch**
- Fallback when all else fails

**💡 What we can steal:**
- Cost-optimized fallback chain
- Use cheapest option first, escalate only when needed
- FX Twitter for single tweets (free!)

---

### 5. YouTube Analytics Tracker
**Daily:**
- Hits YouTube API
- Pulls all video stats
- Tracks channel growth
- Persists snapshots locally
- Scans competitors (uploads, cadence)
- Generates PNG charts
- Feeds insights into meta-analysis

**💡 What we can steal:**
- Automated competitor tracking
- Daily metrics snapshots
- Visual chart generation

---

### 6. Business Meta-Analysis (AI Council) ⭐⭐⭐⭐⭐
**Inspired by Brian Armstrong (Coinbase CEO)**

**Data Sources (Signals):**
- YouTube metrics
- CRM health
- Cron reliability
- Social growth
- Slack messages
- Emails
- Asana tasks
- X posts
- **Fathom meeting transcripts** (ALL meetings auto-transcribed!)
- HubSpot pipeline

**Process:**
1. Compact to top 200 signals by confidence
2. **Phase 1:** Draft created
3. **Phase 2:** AI Council reviews:
   - Growth Strategist
   - Revenue Guardian
   - Skeptical Operator
   - Team Dynamics Architect
4. Council debates, collaborates, reaches consensus
5. **Council Moderator** (Opus 4.6) reconciles disagreements
6. Final ranked report

**When:** Runs nightly (middle of night when Opus usage is low)

**Output:** Actionable insights on business gaps & improvements

**💡 What we can steal:**
- **THIS IS GOLD.** Multi-agent council for business analysis
- Fathom meeting transcripts as data source
- Run expensive analysis at night
- Ranked, actionable insights

---

### 7. HubSpot Integration
- Natural language queries against deal pipeline
- "What deals are in qualification stage?"
- OpenClaw has context of all active deals

**💡 What we can steal:**
- CRM integration for deal context

---

### 8. Humanizer Skill ⭐⭐⭐
**What it does:**
- Removes "AI smell" from all writing
- Detects AI patterns (M dashes, etc.)
- Rewrites text to sound human
- Proactive + reactive

**Where:** Clawhub skill (constantly updated)

**💡 What we can steal:**
- Install humanizer skill immediately
- Apply to all outbound content

---

### 9. Image/Video Generation
**APIs:**
- Banana (images)
- Vo (video)

**Workflow:**
- Separate Telegram topics for images vs video
- Iterative generation ("make it bigger," "make it square")
- Modular skills reusable across workflows

**💡 What we can steal:**
- Separate topics for different media types
- Iterative refinement workflow

---

### 10. To-Do List Management ⭐⭐⭐
**Triggers:**
1. **Meeting transcripts:** Fathom joins all meetings → transcript sent to Gemini 2.5 Flash → extracts action items
2. **Manual:** "Add task to follow up with X by Friday"

**Process:**
- Extracts actions, owner, deadlines
- Cross-references CRM for context
- Shows task list
- Approval → adds to Todoist

**💡 What we can steal:**
- Auto-extract tasks from meeting transcripts
- CRM cross-reference for context
- Gemini Flash for cheap extraction

---

### 11. Usage Tracker (Cost Monitoring) ⭐⭐⭐
**What it tracks:**
- Every AI call
- Every API call
- Logged to single place

**Queries:**
- "How much did I spend this week?"
- "Which workflows cost the most?"
- "Show me 30-day trend"

**Why:** Spot unexpected charges, optimize costs

**Current spend:** ~$150/month
- $100 Claude subscription
- Gemini API
- X API
- Etc.

**💡 What we can steal:**
- **CRITICAL.** We should track every API call
- Cost breakdown by workflow
- Spot waste

---

## 💾 DATA STORAGE STRATEGY

### Hybrid Database Approach ⭐⭐⭐⭐
**SQLite + Vector Columns**
- Traditional SQL queries
- Natural language vector search
- Standardized across all skills

**Databases:**
- CRM contacts
- Knowledge base articles
- Video pitches
- Business meta-analysis
- Social channel views
- Cron logs

**💡 What we can steal:**
- Hybrid SQL + vector approach
- Standardized database schema
- Local storage with cloud backup

---

## 🔗 EXTERNAL SERVICES

- Google Workspace (via Gogg)
- Asana
- Todoist
- HubSpot
- YouTube API
- X/Twitter
- Fathom (meeting transcripts)
- GitHub
- Brave Search
- Firecrawl

---

## ⏰ AUTOMATIONS (Cron Jobs)

### Hourly
- Sync code repo to GitHub
- Check for self-modifications
- Backup databases to Google Drive

### Daily
- Ingest emails (CRM)
- Collect YouTube analytics
- Health checks (platform)
- Nightly business briefing (AI council)

### Weekly
- Synthesize daily notes → long-term memory
- Housekeeping tasks

**Notification:** All cron results sent to Telegram cron channel

**💡 What we can steal:**
- Hourly code backups
- Daily health checks
- Dedicated cron notification channel

---

## 💾 BACKUP STRATEGY ⭐⭐⭐⭐

### Code: GitHub
- All markdown files
- All scripts
- Auto-commit hourly
- Version control (can rollback)

### Data: Google Drive
- All SQLite databases
- Timestamped backups
- CRM data, analytics, knowledge base, cron logs

### Recovery Plan
- Detailed markdown document on how to restore everything
- Step-by-step instructions

**💡 What we can steal:**
- Dual backup strategy (code + data separate)
- Auto-backup hourly
- Written recovery plan

---

## 🧠 MEMORY SYSTEM

**Daily Notes:**
- Conversations
- Tasks completed
- Mistakes made

**Weekly Synthesis:**
- Distills patterns/preferences
- Stores in long-term memory

**Learnings Folder:**
- Corrective patterns
- Mistakes not to repeat

**Self-improving:** Gets better over time without manual intervention

**💡 What we can steal:**
- Structured daily → weekly → long-term flow
- Learnings folder for mistakes

---

## 💻 DEVELOPMENT WORKFLOW

### Tools
- **Cursor IDE** (primary development)
- SSH into MacBook Air from anywhere
- TeamViewer for full remote control

**Why Cursor over Telegram:**
- Better file management
- Easier interface
- Built for development
- See files being created in real-time

**Git Strategy:**
- Major projects (e.g., CRM) = separate repo
- OpenClaw as a whole = main repo
- Frequent commits/pushes
- Tests for everything

**💡 What we can steal:**
- Cursor + SSH for development
- Separate git repos for major projects
- Test everything

---

## 📝 SELF-UPDATING MARKDOWN FILES ⭐⭐⭐⭐

**Problem:** Drift across multiple markdown files as skills/instructions accumulate

**Solution:**

### 1. workspace.md
- Master reference document
- Table of contents
- Architecture
- Key patterns
- Platform config
- Model providers
- Fallback chains

### 2. Daily Cross-Reference Check
- Downloads OpenClaw best practices from website
- Stores locally
- Cross-references all markdown files
- Checks against best practices
- Recommends changes

### 3. Opus 4.6 Prompting Guide
- Downloads Anthropic's official prompting guide
- Stores locally
- Cross-references markdown files
- Removes anti-patterns (bold, all caps, "don't forget")

**Frequency:** Once per day

**💡 What we can steal:**
- **GAME-CHANGER.** Self-auditing markdown files
- Daily best practices check
- Model-specific prompt optimization

---

## 🎯 KEY TAKEAWAYS FOR DANY

### Immediate Wins (Do Now)
1. **Install Humanizer skill** from Clawhub
2. **Set up usage tracking** - monitor every API call
3. **Create separate Telegram topics** for different workflows
4. **Set session expiration to 1 year** (not daily resets)
5. **Download OpenClaw best practices** for self-audit

### Medium-Term (Build This Week)
1. **Email → CRM automation** (Gmail parsing)
2. **Hybrid SQL + vector database** for knowledge base
3. **Daily backup to GitHub + Google Drive**
4. **Cost-optimized Twitter search** (fallback chain)
5. **workspace.md master reference**

### Advanced (Build This Month)
1. **AI Council for business analysis** 🔥
2. **Meeting transcript → task extraction**
3. **Morning meeting prep workflow**
4. **Self-updating markdown audit**
5. **Video/content idea pipeline**

---

## 💰 COST OPTIMIZATION LESSONS

1. **Use Gemini 2.5 Flash for classification** (cheap!)
2. **Fallback chains** - cheapest option first
3. **Track everything** - spot waste immediately
4. **Run expensive tasks at night** (off-peak usage)
5. **Current spend: ~$150/month for enterprise-level automation**

---

## 🚀 WHAT WE'RE ALREADY DOING BETTER

✅ Voice messages (Matthew doesn't have this)
✅ X/Twitter integration (we just set it up)
✅ Daily news digest (Matthew doesn't mention this)
✅ Activity dashboard (our transparency system)

---

## 🎯 WHAT WE SHOULD BUILD NEXT

**Priority 1:**
- AI Council for business analysis (THIS IS GOLD)
- Usage tracking (cost monitoring)
- Email → CRM automation

**Priority 2:**
- Self-updating markdown audit
- Hybrid database system
- Backup automation (GitHub + Drive)

**Priority 3:**
- Meeting prep workflow
- Video/content pipeline
- Twitter cost-optimization chain

---

## 📊 MATTHEW'S RESULTS

- "Most advanced OpenClaw user on the planet"
- $150/month spend (calls it "very cheap" for value)
- Saves "a bunch of time"
- Self-evolving system
- 24/7 autonomous operation

**His take:** "You just have to tell it. Make them modular. Make them reusable."

---

**Want me to start building any of these? The AI Council is the most exciting IMO.** 💪
