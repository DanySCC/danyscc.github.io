#!/usr/bin/env node
/**
 * AI PATTERN DETECTOR
 * 
 * Purpose: Analyze chart screenshots and detect scalping/swing patterns
 * 
 * Features:
 * - Support/Resistance bounce detection
 * - Breakout pattern recognition
 * - Volume confirmation analysis
 * - Entry/Stop/Target calculation
 * - Confidence scoring (1-10)
 * 
 * Usage:
 *   node pattern-detector.js --scan ./screenshots/tier1-2026-02-13
 *   node pattern-detector.js --image btcusdt_4h.png
 */

const fs = require('fs').promises;
const path = require('path');

// AI Pattern Detection Prompt Template
const PATTERN_DETECTION_PROMPT = `
You are an expert crypto/stock scalping trader analyzing a chart for potential trades.

Analyze this chart image and detect the following patterns:

**SCALPING PATTERNS (High Priority):**
1. Support/Resistance Bounce
   - Price approaching strong S/R level
   - Multiple touches confirm level
   - Look for volume spike on approach
   
2. Breakout Setup
   - Price consolidating near resistance
   - Volume declining (coiling)
   - Breakout above with volume = BUY
   
3. Trend Continuation
   - Clear trend (up/down)
   - Pullback to moving average
   - Rejection = continuation entry

**INDICATORS TO CHECK:**
- Moving Averages (50 MA, 200 MA alignment)
- RSI (oversold <30, overbought >70, divergence)
- Volume (spike = confirmation, declining = weak)
- Liquidity levels (big candle wicks = liquidity)

**OUTPUT REQUIRED:**
For each pattern found, provide:

{
  "symbol": "<symbol from filename>",
  "pattern": "<pattern name>",
  "confidence": <1-10>,
  "direction": "LONG" | "SHORT",
  "entry": <price>,
  "stopLoss": <price>,
  "takeProfit": <price>,
  "riskReward": <ratio>,
  "reasoning": "<why this setup is valid>",
  "timeframe": "<timeframe from filename>",
  "volumeConfirmation": true|false,
  "alerts": [
    "<what to watch for>",
    "<invalidation condition>"
  ]
}

**CONFIDENCE SCORING:**
10 = Perfect setup (all indicators aligned, volume confirmed)
8-9 = Strong setup (most indicators aligned)
6-7 = Decent setup (some confirmation missing)
4-5 = Weak setup (risky, low probability)
1-3 = No clear setup (skip this chart)

**ONLY RETURN SETUPS WITH CONFIDENCE >= 7**

Analyze the chart and return JSON array of detected patterns.
`;

/**
 * Analyze a single chart image
 */
async function analyzeChart(imagePath) {
  console.log(`🔍 Analyzing: ${path.basename(imagePath)}`);
  
  // Extract symbol and timeframe from filename
  const filename = path.basename(imagePath, '.png');
  const [symbol, timeframe] = filename.split('_');
  
  // TODO: Call OpenClaw AI vision API to analyze chart
  // For now, return mock data
  
  const mockPattern = {
    symbol,
    timeframe,
    pattern: 'Support Bounce',
    confidence: 8,
    direction: 'LONG',
    entry: 69000,
    stopLoss: 68500,
    takeProfit: 70500,
    riskReward: 3.0,
    reasoning: 'Strong support at $68,500 with 3 previous bounces. RSI oversold at 32. Volume spike on last test.',
    volumeConfirmation: true,
    alerts: [
      'Watch for break above $69,200 for confirmation',
      'Invalidated if breaks below $68,400'
    ]
  };
  
  return mockPattern;
}

/**
 * Analyze all charts in a directory
 */
async function analyzeDirectory(dirPath) {
  console.log(`\n🎯 ANALYZING CHARTS IN: ${dirPath}\n`);
  
  const results = [];
  
  // Read all subdirectories (categories)
  const categories = await fs.readdir(dirPath);
  
  for (const category of categories) {
    const categoryPath = path.join(dirPath, category);
    const stat = await fs.stat(categoryPath);
    
    if (!stat.isDirectory()) continue;
    
    console.log(`📂 Category: ${category.toUpperCase()}`);
    
    // Read all PNG files in category
    const files = await fs.readdir(categoryPath);
    const pngFiles = files.filter(f => f.endsWith('.png'));
    
    for (const file of pngFiles) {
      const imagePath = path.join(categoryPath, file);
      const pattern = await analyzeChart(imagePath);
      
      if (pattern.confidence >= 7) {
        results.push(pattern);
        console.log(`  ✅ ${pattern.symbol}: ${pattern.pattern} (${pattern.confidence}/10)`);
      } else {
        console.log(`  ⏭️  ${pattern.symbol}: Low confidence (${pattern.confidence}/10)`);
      }
    }
  }
  
  console.log(`\n📊 ANALYSIS COMPLETE`);
  console.log(`✅ High-confidence setups found: ${results.length}\n`);
  
  return results;
}

/**
 * Generate Telegram report
 */
function generateReport(patterns) {
  if (patterns.length === 0) {
    return '📊 No high-confidence setups found today.';
  }
  
  // Sort by confidence (highest first)
  patterns.sort((a, b) => b.confidence - a.confidence);
  
  // Take top 5
  const top5 = patterns.slice(0, 5);
  
  let report = `☀️ **DAILY TRADING REPORT**\n`;
  report += `📅 ${new Date().toLocaleDateString()}\n\n`;
  report += `🔥 **TOP ${top5.length} SETUPS:**\n\n`;
  
  top5.forEach((p, idx) => {
    const stars = '⭐'.repeat(Math.floor(p.confidence / 2));
    
    report += `**#${idx + 1} - ${p.symbol}** (${p.confidence}/10) ${stars}\n`;
    report += `Pattern: ${p.pattern}\n`;
    report += `Direction: ${p.direction}\n`;
    report += `Entry: $${p.entry.toLocaleString()}\n`;
    report += `Stop Loss: $${p.stopLoss.toLocaleString()} (${calculatePercent(p.entry, p.stopLoss)}%)\n`;
    report += `Target: $${p.takeProfit.toLocaleString()} (${calculatePercent(p.entry, p.takeProfit)}%)\n`;
    report += `Risk/Reward: 1:${p.riskReward.toFixed(1)}\n`;
    report += `💡 ${p.reasoning}\n\n`;
  });
  
  report += `\n📊 Scanned: ${patterns.length} charts\n`;
  report += `✅ High-confidence (7+): ${patterns.length}\n`;
  report += `🎯 Top picks: ${top5.length}\n`;
  
  return report;
}

/**
 * Calculate percentage change
 */
function calculatePercent(from, to) {
  const change = ((to - from) / from) * 100;
  return change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
}

/**
 * Save results to JSON
 */
async function saveResults(patterns, outputPath) {
  const data = {
    timestamp: new Date().toISOString(),
    total: patterns.length,
    patterns
  };
  
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  console.log(`💾 Results saved to: ${outputPath}`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  
  let scanDir = null;
  let imagePath = null;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scan' && args[i + 1]) {
      scanDir = args[i + 1];
      i++;
    }
    if (args[i] === '--image' && args[i + 1]) {
      imagePath = args[i + 1];
      i++;
    }
  }
  
  console.log(`
╔═══════════════════════════════════════════╗
║  AI PATTERN DETECTOR v1.0                 ║
║  Chart Analysis Engine                    ║
╚═══════════════════════════════════════════╝
  `);
  
  if (imagePath) {
    // Analyze single image
    const pattern = await analyzeChart(imagePath);
    console.log(JSON.stringify(pattern, null, 2));
  } else if (scanDir) {
    // Analyze directory
    const patterns = await analyzeDirectory(scanDir);
    
    // Generate report
    const report = generateReport(patterns);
    console.log('\n' + report);
    
    // Save results
    const outputPath = path.join(scanDir, 'analysis-results.json');
    await saveResults(patterns, outputPath);
  } else {
    console.error('❌ Please specify --scan <directory> or --image <path>');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { analyzeChart, analyzeDirectory, generateReport };
