#!/usr/bin/env node

/**
 * Work Time Tracker
 * Usage: 
 *   ./work-tracker.js start "Working on X"
 *   ./work-tracker.js pause
 *   ./work-tracker.js resume
 *   ./work-tracker.js done
 *   ./work-tracker.js status
 *   ./work-tracker.js stats [today|week|month]
 */

const fs = require('fs');
const path = require('path');

const WORK_LOG_PATH = path.join(__dirname, '../memory/work-log.json');
const TIMEZONE = 'Europe/Berlin';

// Load work log
function loadWorkLog() {
  if (!fs.existsSync(WORK_LOG_PATH)) {
    return {
      version: "1.0",
      created: new Date().toISOString(),
      timezone: TIMEZONE,
      sessions: [],
      stats: {
        this_week: { total_hours: 0, sessions_count: 0, milestones_count: 0 },
        this_month: { total_hours: 0, sessions_count: 0, milestones_count: 0 },
        all_time: { total_hours: 0, sessions_count: 0 }
      },
      notes: {}
    };
  }
  return JSON.parse(fs.readFileSync(WORK_LOG_PATH, 'utf8'));
}

// Save work log
function saveWorkLog(log) {
  fs.writeFileSync(WORK_LOG_PATH, JSON.stringify(log, null, 2));
}

// Get today's date in YYYY-MM-DD format
function getToday() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Get current ISO timestamp
function now() {
  return new Date().toISOString();
}

// Calculate duration in hours
function calculateDuration(start, end) {
  const startTime = new Date(start);
  const endTime = new Date(end);
  return ((endTime - startTime) / 1000 / 60 / 60).toFixed(2);
}

// Find or create today's entry
function getTodayEntry(log) {
  const today = getToday();
  let dayEntry = log.sessions.find(s => s.date === today);
  
  if (!dayEntry) {
    dayEntry = {
      date: today,
      sessions: [],
      total_hours: 0,
      summary: "In progress"
    };
    log.sessions.push(dayEntry);
  }
  
  return dayEntry;
}

// Get active session
function getActiveSession(log) {
  const dayEntry = getTodayEntry(log);
  return dayEntry.sessions.find(s => s.status === 'active' || s.status === 'paused');
}

// Start work session
function startWork(description) {
  const log = loadWorkLog();
  const dayEntry = getTodayEntry(log);
  
  // Check if there's already an active session
  const activeSession = getActiveSession(log);
  if (activeSession && activeSession.status === 'active') {
    console.log('⚠️  Already have an active work session!');
    console.log(`Started at: ${activeSession.start}`);
    return;
  }
  
  const session = {
    start: now(),
    end: null,
    duration_hours: null,
    status: 'active',
    work_done: description ? [description] : [],
    milestones: [],
    paused_at: null,
    pause_duration: 0
  };
  
  dayEntry.sessions.push(session);
  saveWorkLog(log);
  
  console.log('✅ Work session started!');
  console.log(`Started at: ${session.start}`);
  if (description) console.log(`Working on: ${description}`);
}

// Pause work session
function pauseWork() {
  const log = loadWorkLog();
  const activeSession = getActiveSession(log);
  
  if (!activeSession) {
    console.log('⚠️  No active work session to pause.');
    return;
  }
  
  if (activeSession.status === 'paused') {
    console.log('⚠️  Session is already paused.');
    return;
  }
  
  activeSession.status = 'paused';
  activeSession.paused_at = now();
  saveWorkLog(log);
  
  console.log('⏸️  Work session paused.');
}

// Resume work session
function resumeWork() {
  const log = loadWorkLog();
  const activeSession = getActiveSession(log);
  
  if (!activeSession) {
    console.log('⚠️  No session to resume.');
    return;
  }
  
  if (activeSession.status !== 'paused') {
    console.log('⚠️  Session is not paused.');
    return;
  }
  
  const pauseDuration = calculateDuration(activeSession.paused_at, now());
  activeSession.pause_duration = (parseFloat(activeSession.pause_duration || 0) + parseFloat(pauseDuration)).toFixed(2);
  activeSession.status = 'active';
  activeSession.paused_at = null;
  saveWorkLog(log);
  
  console.log('▶️  Work session resumed.');
  console.log(`Pause duration: ${pauseDuration}h`);
}

// End work session
function endWork() {
  const log = loadWorkLog();
  const activeSession = getActiveSession(log);
  
  if (!activeSession) {
    console.log('⚠️  No active work session to end.');
    return;
  }
  
  // If paused, calculate pause duration
  if (activeSession.status === 'paused') {
    const pauseDuration = calculateDuration(activeSession.paused_at, now());
    activeSession.pause_duration = (parseFloat(activeSession.pause_duration || 0) + parseFloat(pauseDuration)).toFixed(2);
  }
  
  activeSession.end = now();
  activeSession.status = 'completed';
  
  const totalDuration = calculateDuration(activeSession.start, activeSession.end);
  const workDuration = (parseFloat(totalDuration) - parseFloat(activeSession.pause_duration || 0)).toFixed(2);
  activeSession.duration_hours = parseFloat(workDuration);
  
  // Update day total
  const dayEntry = getTodayEntry(log);
  dayEntry.total_hours = dayEntry.sessions
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + (parseFloat(s.duration_hours) || 0), 0);
  
  // Update stats
  updateStats(log);
  
  saveWorkLog(log);
  
  console.log('🏁 Work session completed!');
  console.log(`Duration: ${workDuration}h (${activeSession.pause_duration || 0}h paused)`);
  console.log(`Today's total: ${dayEntry.total_hours.toFixed(2)}h`);
}

// Show current status
function showStatus() {
  const log = loadWorkLog();
  const activeSession = getActiveSession(log);
  
  if (!activeSession) {
    console.log('💤 No active work session.');
    const dayEntry = getTodayEntry(log);
    if (dayEntry.total_hours > 0) {
      console.log(`Today's completed: ${dayEntry.total_hours.toFixed(2)}h`);
    }
    return;
  }
  
  const elapsed = calculateDuration(activeSession.start, now());
  const workTime = (parseFloat(elapsed) - parseFloat(activeSession.pause_duration || 0)).toFixed(2);
  
  console.log(`⏱️  ${activeSession.status === 'paused' ? 'PAUSED' : 'WORKING'}`);
  console.log(`Started: ${activeSession.start}`);
  console.log(`Elapsed: ${elapsed}h (${workTime}h work, ${activeSession.pause_duration || 0}h paused)`);
  
  if (activeSession.work_done.length > 0) {
    console.log('\nWork done:');
    activeSession.work_done.forEach(item => console.log(`  • ${item}`));
  }
}

// Show stats
function showStats(period = 'today') {
  const log = loadWorkLog();
  const today = getToday();
  
  if (period === 'today') {
    const dayEntry = log.sessions.find(s => s.date === today);
    if (!dayEntry) {
      console.log('📊 No work logged today.');
      return;
    }
    
    console.log('📊 Today\'s Stats:');
    console.log(`Total hours: ${dayEntry.total_hours.toFixed(2)}h`);
    console.log(`Sessions: ${dayEntry.sessions.filter(s => s.status === 'completed').length}`);
    
    if (dayEntry.sessions.length > 0) {
      console.log('\nSessions:');
      dayEntry.sessions.forEach((s, i) => {
        const status = s.status === 'active' ? '🟢' : s.status === 'paused' ? '⏸️' : '✅';
        const duration = s.duration_hours ? `${s.duration_hours}h` : 'in progress';
        console.log(`  ${status} Session ${i + 1}: ${duration}`);
      });
    }
  } else if (period === 'week') {
    console.log('📊 This Week\'s Stats:');
    console.log(`Total hours: ${log.stats.this_week.total_hours.toFixed(2)}h`);
    console.log(`Sessions: ${log.stats.this_week.sessions_count}`);
    console.log(`Milestones: ${log.stats.this_week.milestones_count}`);
  } else if (period === 'month') {
    console.log('📊 This Month\'s Stats:');
    console.log(`Total hours: ${log.stats.this_month.total_hours.toFixed(2)}h`);
    console.log(`Sessions: ${log.stats.this_month.sessions_count}`);
    console.log(`Milestones: ${log.stats.this_month.milestones_count}`);
  }
}

// Update aggregated stats
function updateStats(log) {
  // Calculate week and month totals
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  let weekHours = 0, weekSessions = 0, weekMilestones = 0;
  let monthHours = 0, monthSessions = 0, monthMilestones = 0;
  let allHours = 0, allSessions = 0;
  
  log.sessions.forEach(day => {
    const dayDate = new Date(day.date);
    const dayHours = parseFloat(day.total_hours || 0);
    const daySessions = day.sessions.filter(s => s.status === 'completed').length;
    const dayMilestones = day.sessions.reduce((sum, s) => sum + (s.milestones?.length || 0), 0);
    
    allHours += dayHours;
    allSessions += daySessions;
    
    if (dayDate >= monthStart) {
      monthHours += dayHours;
      monthSessions += daySessions;
      monthMilestones += dayMilestones;
    }
    
    if (dayDate >= weekAgo) {
      weekHours += dayHours;
      weekSessions += daySessions;
      weekMilestones += dayMilestones;
    }
  });
  
  log.stats.this_week = {
    week_number: Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)),
    total_hours: parseFloat(weekHours.toFixed(2)),
    sessions_count: weekSessions,
    milestones_count: weekMilestones
  };
  
  log.stats.this_month = {
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    total_hours: parseFloat(monthHours.toFixed(2)),
    sessions_count: monthSessions,
    milestones_count: monthMilestones
  };
  
  log.stats.all_time = {
    total_hours: parseFloat(allHours.toFixed(2)),
    sessions_count: allSessions,
    first_session: log.sessions[0]?.date,
    last_session: log.sessions[log.sessions.length - 1]?.date
  };
}

// CLI
const command = process.argv[2];
const arg = process.argv.slice(3).join(' ');

switch (command) {
  case 'start':
    startWork(arg);
    break;
  case 'pause':
    pauseWork();
    break;
  case 'resume':
    resumeWork();
    break;
  case 'done':
  case 'end':
    endWork();
    break;
  case 'status':
    showStatus();
    break;
  case 'stats':
    showStats(arg || 'today');
    break;
  default:
    console.log('Usage:');
    console.log('  work-tracker.js start "Working on X"');
    console.log('  work-tracker.js pause');
    console.log('  work-tracker.js resume');
    console.log('  work-tracker.js done');
    console.log('  work-tracker.js status');
    console.log('  work-tracker.js stats [today|week|month]');
}
