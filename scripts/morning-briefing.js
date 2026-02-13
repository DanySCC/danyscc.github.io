#!/usr/bin/env node

/**
 * Smart Morning Briefing
 * Delivers a comprehensive daily report with:
 * - Crypto market overnight moves
 * - AI/tech news relevant to the agency
 * - Today's priorities
 * - Work stats and progress
 * - Motivational insight
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

const WORK_LOG_PATH = path.join(__dirname, '../memory/work-log.json');
const BRAVE_API_KEY = 'BSAXQWnOIgflaNHsBY08BcOuQMZjxj1';
const TELEGRAM_BOT_TOKEN = '8328299916:AAG0SxUnwLH3tK8JdhfMRbPWDyuGq8jxglg';
const TELEGRAM_CHAT_ID = '6044518079';

// Delay helper (Brave free plan: 1 request per second)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load work log
function loadWorkLog() {
  if (!fs.existsSync(WORK_LOG_PATH)) {
    return { stats: { this_week: { total_hours: 0 }, this_month: { total_hours: 0 } } };
  }
  return JSON.parse(fs.readFileSync(WORK_LOG_PATH, 'utf8'));
}

// Make HTTPS request
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Brave Search API
async function braveSearch(query, count = 3) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
  try {
    const data = await httpsRequest(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });
    return data.web?.results || [];
  } catch (error) {
    console.error(`Brave Search error: ${error.message}`);
    return [];
  }
}

// Send to Telegram
async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  });

  try {
    await httpsRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      body: body
    });
    console.log('✅ Morning briefing sent to Telegram');
  } catch (error) {
    console.error(`Telegram error: ${error.message}`);
  }
}

// Format greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️ Good morning';
  if (hour < 18) return '👋 Good afternoon';
  return '🌙 Good evening';
}

// Get day of week
function getDayOfWeek() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

// Format date
function getFormattedDate() {
  const now = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Europe/Berlin' };
  return now.toLocaleDateString('en-US', options);
}

// Generate motivational insight
function getMotivationalInsight(weekHours) {
  const insights = [
    "🎯 *Focus beats hustle.* One demo closed beats ten pitches sent.",
    "💪 *Momentum compounds.* Every small win builds the next one.",
    "🚀 *Ship fast, iterate faster.* Perfect is the enemy of done.",
    "🧠 *Think leverage.* Automate what you can, delegate what you should.",
    "⚡ *Energy management > time management.* Work when you're sharp.",
    "🎨 *Quality attracts quality.* Your demo is your best salesperson.",
    "🔥 *Consistency wins.* Show up every day, even when it's hard.",
    "💡 *Solutions sell, not features.* Lead with the pain you solve.",
    "🌊 *Ride the wave.* When momentum comes, double down.",
    "🎯 *Niche down to scale up.* Riches are in the niches."
  ];
  
  // Add context-specific insights
  if (weekHours < 5) {
    return "⏱️ *Slow week?* That's fine. Quality > quantity. One great move beats a dozen mediocre ones.";
  } else if (weekHours > 40) {
    return "🔥 *You're on fire!* But remember: rest is part of the work. Burn bright, not out.";
  }
  
  return insights[Math.floor(Math.random() * insights.length)];
}

// Main briefing generator
async function generateBriefing() {
  console.log('🌅 Generating morning briefing...');
  
  const workLog = loadWorkLog();
  const weekHours = workLog.stats?.this_week?.total_hours || 0;
  const monthHours = workLog.stats?.this_month?.total_hours || 0;
  const greeting = getGreeting();
  const day = getDayOfWeek();
  const date = getFormattedDate();
  
  let briefing = `${greeting}, Dany! 💪\n\n`;
  briefing += `📅 *${day}, ${date}*\n\n`;
  briefing += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Work Stats
  briefing += `📊 *Your Week So Far*\n`;
  briefing += `⏱️ This week: *${weekHours.toFixed(1)}h*\n`;
  briefing += `📈 This month: *${monthHours.toFixed(1)}h*\n`;
  if (workLog.stats?.this_week?.milestones_count > 0) {
    briefing += `🎯 Milestones: *${workLog.stats.this_week.milestones_count}*\n`;
  }
  briefing += `\n`;
  
  // Crypto Market Summary
  briefing += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  briefing += `💎 *Crypto Market Overnight*\n\n`;
  
  const cryptoResults = await braveSearch('Bitcoin Ethereum crypto price today', 3);
  if (cryptoResults.length > 0) {
    const topResult = cryptoResults[0];
    briefing += `📰 ${topResult.title}\n`;
    if (topResult.description) {
      const desc = topResult.description.substring(0, 150);
      briefing += `${desc}${desc.length >= 150 ? '...' : ''}\n`;
    }
    briefing += `\n`;
  }
  
  // Rate limit delay (Brave free: 1 req/sec)
  await delay(1100);
  
  // Check BERA specifically
  const beraResults = await braveSearch('BERA Berachain price news today', 2);
  if (beraResults.length > 0) {
    briefing += `🐻 *BERA Watch:*\n`;
    const beraNews = beraResults[0];
    briefing += `${beraNews.title}\n`;
    if (beraNews.description) {
      const desc = beraNews.description.substring(0, 120);
      briefing += `${desc}${desc.length >= 120 ? '...' : ''}\n`;
    }
    briefing += `\n`;
  }
  
  // Rate limit delay
  await delay(1100);
  
  // AI & Tech News (relevant to agency)
  briefing += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  briefing += `🤖 *AI & Automation News*\n\n`;
  
  const aiResults = await braveSearch('AI automation business news today', 3);
  if (aiResults.length > 0) {
    aiResults.slice(0, 3).forEach((result, i) => {
      briefing += `${i + 1}. ${result.title}\n`;
      if (result.description) {
        const desc = result.description.substring(0, 100);
        briefing += `   ${desc}${desc.length >= 100 ? '...' : ''}\n`;
      }
      briefing += `\n`;
    });
  }
  
  // Today's Priorities
  briefing += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  briefing += `🎯 *Today's Focus*\n\n`;
  briefing += `✅ Lead Qualifier demo is ready — time to show it\n`;
  briefing += `🎯 Week 3-4 goal: Pick your niche + first outreach\n`;
  briefing += `🔧 Optional: Fix TradingView webhook AppArmor issue\n`;
  briefing += `\n`;
  
  // Motivational Close
  briefing += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  briefing += `${getMotivationalInsight(weekHours)}\n\n`;
  briefing += `Let's make today count. 💪\n\n`;
  briefing += `— Bobitza`;
  
  return briefing;
}

// Run
(async () => {
  try {
    const briefing = await generateBriefing();
    console.log('\n' + briefing + '\n');
    await sendToTelegram(briefing);
  } catch (error) {
    console.error('Error generating briefing:', error);
  }
})();
