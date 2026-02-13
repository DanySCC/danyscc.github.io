# ⏱️ Time Tracking System

Your work hours are now tracked automatically and manually.

---

## 📊 Quick Commands

### Via Terminal

```bash
# Start work session
cd ~/.openclaw/workspace/scripts
./work-tracker.js start "Building X feature"

# Pause (lunch, break, etc.)
./work-tracker.js pause

# Resume after break
./work-tracker.js resume

# End session
./work-tracker.js done

# Check current status
./work-tracker.js status

# View stats
./work-tracker.js stats today
./work-tracker.js stats week
./work-tracker.js stats month
```

### Via Chat (with me)

Just tell me:
- "Starting work on X" → I'll log it
- "Taking a break" → I'll pause the timer
- "Back to work" → I'll resume
- "Done for today" → I'll end the session
- "How many hours today/this week?" → I'll tell you

---

## 📈 Where to See Stats

1. **Dashboard:** https://base.taild61699.ts.net
   - Work Stats card at the top shows today/week/month hours
   - Recent sessions with what was built

2. **Memory file:** `~/.openclaw/workspace/memory/work-log.json`
   - Raw data, full history
   - Automatically updated

3. **Terminal:** Run `./work-tracker.js stats [today|week|month]`

---

## 🎯 What Gets Tracked

- **Start time:** When you begin working
- **End time:** When you finish
- **Pause duration:** Breaks, lunch, etc. (excluded from work time)
- **Work done:** List of what was accomplished
- **Milestones:** Major achievements during the session

---

## 🔄 Automatic vs Manual

**Automatic logging:**
- I track major work sessions automatically
- When you send messages like "starting work", "taking break", etc.
- Dashboard updates every heartbeat (every ~55 min)

**Manual logging:**
- Use the terminal script for precise control
- Useful when you work offline or without chatting

Both methods write to the same `work-log.json` file.

---

## 📅 Weekly/Monthly Reviews

**Weekend summaries:**
- Every Sunday, I'll send you a weekly summary
- Total hours, milestones achieved, productivity trends
- Suggestions for next week

**Monthly reports:**
- First of each month
- Full breakdown of time spent
- Month-over-month comparison

---

## 🛠️ Configuration

All data stored in:
```
~/.openclaw/workspace/memory/work-log.json
```

Timezone: `Europe/Berlin` (GMT+1)

---

## 💡 Tips

- **Be honest with pauses:** Breaks are fine, don't count them as work
- **Log what you built:** Helps with weekly reviews
- **Check stats regularly:** Stay aware of your productivity
- **Celebrate milestones:** Track wins, not just hours

---

## 🚀 Examples

```bash
# Morning start
./work-tracker.js start "Building TradingView alerts"

# Lunch break (11:30)
./work-tracker.js pause

# Back from lunch (12:00)
./work-tracker.js resume

# End of day
./work-tracker.js done
```

Or just tell me: "Starting work on lead qualifier demo" and I'll handle it. 💪

---

**Your time is valuable. Now you can see exactly where it goes.** ⏱️
