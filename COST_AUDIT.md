# COST_AUDIT.md - Weekly Cost Optimization Checklist

Run this audit once per week (during heartbeat rotation).

## Quick Audit

```bash
# 1. Check current session model
session_status

# 2. Verify heartbeat model
cat ~/.openclaw/openclaw.json | grep -A2 heartbeat

# 3. Check cron job models
cron list

# 4. Review Ollama models (any updates?)
ollama list
```

## Expected Configuration (Optimal)

- **Main session:** `anthropic/claude-sonnet-4-5` ✅
- **Heartbeat:** `ollama/deepseek-r1:7b` ✅
- **Cron: daily-news-digest (7 AM):** `ollama/qwen2.5-coder:7b` ✅
- **Cron: daily-news-digest-13h (1 PM):** `ollama/qwen2.5-coder:7b` ✅
- **Brave Search:** <2000/month (check usage sparingly)

## Red Flags 🚩

- Main session running on Opus → immediate reset to Sonnet
- Heartbeat running on Claude (any variant) → switch to Ollama
- Cron jobs running on Claude → switch to Ollama
- New sessions spawning on expensive models by default

## Improvement Opportunities 💡

- [ ] New Ollama models released? (Check ollama.com/library)
- [ ] Better local models for specific tasks?
- [ ] Can we cache more aggressively?
- [ ] Are there tasks we're paying for that could run local?
- [ ] Brave Search usage trending high? (Find alternatives)

## Monthly Cost Target

- **Current (Feb 2026):** ~$10-20/month (70-85% reduction achieved)
- **Goal:** Keep under $15/month while maintaining quality
- **Alert threshold:** >$25/month = investigate immediately

## When to Alert Dany

- Costs exceed $25/month for 2 consecutive months
- Better model/config becomes available
- Claude pricing changes
- New FREE alternatives emerge

---

**Last audit:** Never (created 2026-02-10)
**Next audit:** 2026-02-17 (1 week)
