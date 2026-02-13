# Watchdog System - Activity Monitoring & Transparency

**Status:** Operational (tested, not scheduled)  
**Location:** `/home/kaff/.openclaw/workspace/skills/watchdog/`  
**Purpose:** Monitor actual work output vs messaging, send transparency reports every 30 minutes  
**Created:** 2026-02-13

---

## What It Does

Monitors Bobitza's actual work output by:
- Scanning workspace for modified files
- Categorizing file types (code, docs, data)
- Calculating productivity score (0-100)
- Sending formatted reports to Dany via Telegram

**Why it exists:** Catches "working" messages without actual progress (standby mode detection).

---

## Productivity Scoring System

Files are scored by type:
- **Code files** (.js, .py, .sh): **10 points** each
- **Documentation** (.md): **5 points** each
- **Data files** (.json, .csv): **3 points** each
- **Git commits**: **15 points** each

**Score ranges:**
```
  0 points: ⚠️ NO WORK - Idle or just messaging
  1-19: 📝 Minimal activity
 20-49: ✅ Good progress
  50+: 🔥 High productivity
```

---

## Files

### 1. activity-tracker.js (6.7KB, 250 lines)
**Location:** `/skills/watchdog/activity-tracker.js`

**What it does:**
- Finds all modified files since last check (git-based)
- Categorizes files by type
- Calculates productivity score
- Generates formatted report

**Key functions:**
```javascript
findModifiedFiles(sinceTimestamp)  // Git-based file discovery
categorizeFile(filepath)             // Determines file type and points
calculateProductivity(files, commits) // Scores 0-100
generateReport(files, commits, score) // Formats output
```

**State tracking:** Uses `watchdog-state.json` to remember last check time.

### 2. watchdog-control.js (1.1KB, 40 lines)
**Location:** `/skills/watchdog/watchdog-control.js`

**Purpose:** Pause/play/status control

**Commands:**
```bash
node watchdog-control.js pause   # Stop reports
node watchdog-control.js play    # Resume reports
node watchdog-control.js status  # Check if active
```

**How it works:** File-based control using `.paused` marker file.

### 3. run-and-send.js (1.5KB, 50 lines)
**Location:** `/skills/watchdog/run-and-send.js`

**Purpose:** Integration wrapper - runs tracker and sends to Telegram

**Flow:**
1. Check if paused (skip if paused)
2. Run activity tracker
3. Send report via OpenClaw message API
4. Update state file with timestamp

**Environment:** Expects `TELEGRAM_CHAT_ID` (Dany's: 6044518079)

### 4. send-report.sh (631 bytes)
**Location:** `/skills/watchdog/send-report.sh`

**Purpose:** Bash wrapper for cron jobs

**Usage:**
```bash
chmod +x send-report.sh
./send-report.sh
```

### 5. SKILL.md (3KB)
**Location:** `/skills/watchdog/SKILL.md`

Complete skill documentation with setup instructions.

---

## How to Use

### Manual Test
```bash
cd /home/kaff/.openclaw/workspace/skills/watchdog
node activity-tracker.js
```

**Output example:**
```
🔍 Checking activity for last 30 minutes...

🤖 **Watchdog Report**
⏱ **Period:** 30 min
📊 **Productivity:** 79/100
🔥 High productivity - Significant work done

**Work done:**
• 6 code files
• 2 doc files
• 3 data files

**Files:** 11 modified
• BUILD-LOG-2026-02-13.md
• memory/heartbeat-state.json
• skills/business-engine/agents/opportunity-matcher.js
...
```

### Full Integration Test
```bash
cd /home/kaff/.openclaw/workspace/skills/watchdog
node run-and-send.js
```

Runs tracker + sends report to Telegram.

### Set Up Automated Checks (30-minute intervals)

**Option 1: Cron**
```bash
crontab -e
# Add this line:
*/30 * * * * /home/kaff/.openclaw/workspace/skills/watchdog/send-report.sh
```

**Option 2: OpenClaw Cron**
```bash
# Use OpenClaw's built-in cron system
# (Preferred - better integration)
```

### Pause/Resume Control

**Pause reports:**
```bash
cd /home/kaff/.openclaw/workspace/skills/watchdog
node watchdog-control.js pause
```

**Resume reports:**
```bash
node watchdog-control.js play
```

**Check status:**
```bash
node watchdog-control.js status
# Output: "Watchdog is ACTIVE" or "Watchdog is PAUSED"
```

---

## Example Reports

### High Productivity (79/100)
```
🔍 **Watchdog Report - 30min Check**

⏱ **Period:** Last 30 minutes
📊 **Productivity:** 79/100
🔥 **High productivity - Significant work done**

**Work breakdown:**
• 6 code files modified
• 2 documentation files
• 3 data files

**Total files:** 11 modified

**Key files:**
• BUILD-LOG-2026-02-13.md (comprehensive documentation)
• skills/business-engine/agents/opportunity-matcher.js
• skills/business-engine/knowledge/markets/germany/*.json (3 files)
• dashboard/index.html (updated)

**Status:** ✅ Active and productive
```

### Minimal Activity (5/100)
```
🔍 **Watchdog Report - 30min Check**

⏱ **Period:** Last 30 minutes
📊 **Productivity:** 5/100
📝 **Minimal activity**

**Work breakdown:**
• 0 code files
• 1 doc file
• 0 data files

**Total files:** 1 modified

**Status:** ⚠️ Low activity - mostly messaging
```

### No Work (0/100)
```
🔍 **Watchdog Report - 30min Check**

⏱ **Period:** Last 30 minutes
📊 **Productivity:** 0/100
⚠️ **NO WORK - Idle or just messaging**

**Work breakdown:**
• 0 files modified

**Status:** ⚠️ STANDBY MODE - No actual work done
```

---

## State Files

### watchdog-state.json
**Location:** `/skills/watchdog/watchdog-state.json`

**Structure:**
```json
{
  "lastCheck": 1770911340,
  "lastReport": "2026-02-13T01:10:00+01:00"
}
```

Tracks when last check ran to calculate time window.

### latest-report.txt
**Location:** `/skills/watchdog/latest-report.txt`

Contains last generated report (for debugging/review).

### .paused
**Location:** `/skills/watchdog/.paused`

Marker file - if exists, watchdog is paused. Deleted when resumed.

---

## Technical Details

### File Discovery Method
Uses Git to find modified files:
```bash
git diff --name-only HEAD@{30.minutes.ago}
```

**Why Git?**
- Accurate (tracks actual changes)
- Fast (Git index lookup)
- Reliable (doesn't miss modifications)

### File Categorization Logic
```javascript
const codeExtensions = ['.js', '.py', '.sh', '.ts', '.jsx', '.tsx', '.go', '.rs'];
const docExtensions = ['.md', '.txt', '.doc', '.pdf'];
const dataExtensions = ['.json', '.csv', '.yaml', '.yml', '.sql'];
```

### Scoring Algorithm
```javascript
productivity = 
  (codeFiles * 10) + 
  (docFiles * 5) + 
  (dataFiles * 3) + 
  (commits * 15)
```

Capped at 100 max.

---

## Integration Points

### OpenClaw Message API
```javascript
const { message } = require('openclaw-sdk');

await message({
  action: 'send',
  channel: 'telegram',
  target: '6044518079',
  message: reportText
});
```

### Cron Integration
Can be triggered by:
- System cron (`crontab -e`)
- OpenClaw built-in cron (preferred)
- Manual execution (`node run-and-send.js`)

---

## Test Results

**First run (2026-02-13 00:38):**
- Found 1610 files (state file had old timestamp - fixed)
- Productivity: N/A (initialization)

**Second run (2026-02-13 00:38):**
- Found 2 files in last 1 min
- Productivity: 5/100 (minimal - just docs)
- Report sent successfully

**Third run (2026-02-13 01:10):**
- Found 11 files in last 30 min
- Productivity: 79/100 (high)
- Work: 6 code, 2 docs, 3 data files
- Report sent successfully (message ID: 2757)

---

## Current Status

✅ **WORKING** - All components tested and functional  
⏸️ **NOT SCHEDULED** - Cron job not yet configured (waiting for approval)  
🧪 **TESTED** - Manual runs successful, Telegram integration working

---

## Next Steps

**To activate automated monitoring:**
1. Get Dany's approval for 30-minute checks
2. Set up cron job (OpenClaw or system)
3. Monitor first few reports
4. Adjust scoring thresholds if needed

**Potential improvements:**
- Add more file types (CSS, HTML, etc.)
- Track time spent on different projects
- Generate weekly productivity summaries
- Alert if productivity drops below threshold for extended period

---

## Quick Reference Commands

```bash
# Manual test
cd /home/kaff/.openclaw/workspace/skills/watchdog && node activity-tracker.js

# Send report
node run-and-send.js

# Pause
node watchdog-control.js pause

# Resume
node watchdog-control.js play

# Status
node watchdog-control.js status

# View last report
cat latest-report.txt

# Check state
cat watchdog-state.json
```

---

**Related Documentation:**
- [Business Engine](./BUSINESS-ENGINE.md)
- [Agent Skills Reference](./AGENT-SKILLS.md)
