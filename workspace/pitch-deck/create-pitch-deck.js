const pptxgen = require('pptxgenjs');
const html2pptx = require('/home/z/my-project/skills/pptx/scripts/html2pptx');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/home/z/my-project/workspace/pitch-deck';
const SLIDES_DIR = path.join(WORKSPACE, 'slides');

// Color scheme
const COLORS = {
    bg: '#193328',
    primary: '#FFFFFF',
    accent: '#37DCF2',
    dark: '#0D1F1A',
    light: '#2A4A3A'
};

function createSlideHTML(slideNum, content) {
    const filepath = path.join(SLIDES_DIR, `slide${slideNum}.html`);
    fs.writeFileSync(filepath, content);
    return filepath;
}

async function main() {
    console.log('Creating EduSparring Investor Pitch Deck...\n');

    // Create HTML slides
    console.log('1. Creating HTML slides...');

    // SLIDE 1: Cover
    createSlideHTML(1, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; background: ${COLORS.bg}; }
.accent-line { width: 80pt; height: 4pt; background: ${COLORS.accent}; margin-bottom: 20pt; border-radius: 2pt; }
.logo { font-size: 48pt; font-weight: bold; color: ${COLORS.primary}; margin-bottom: 8pt; }
.tagline { font-size: 22pt; color: ${COLORS.accent}; margin-bottom: 30pt; }
.subtitle { font-size: 14pt; color: ${COLORS.primary}; opacity: 0.7; }
</style></head>
<body>
<div class="accent-line"></div>
<h1 class="logo">EduSparring</h1>
<p class="tagline">Turn Knowledge Into Competitive Battles</p>
<p class="subtitle">Investor Pitch Deck 2025</p>
</body></html>`);

    // SLIDE 2: Problem
    createSlideHTML(2, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 25pt 40pt 15pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 0 40pt 30pt 40pt; display: flex; gap: 20pt; }
.problem-card { flex: 1; background: ${COLORS.dark}; border-radius: 8pt; padding: 20pt; }
.stat-number { font-size: 32pt; font-weight: bold; color: #FF6B6B; margin: 0 0 8pt 0; }
.stat-desc { font-size: 12pt; color: ${COLORS.primary}; margin: 0; line-height: 1.5; }
.problem-card.accent .stat-number { color: #FFB84D; }
.problem-card.blue .stat-number { color: #6B9FFF; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">The Education Engagement Crisis</h1>
</div>
<div class="content">
<div class="problem-card">
<p class="stat-number">65%</p>
<p class="stat-desc">of students report being bored in traditional classrooms. Passive learning methods fail to capture attention in the digital age.</p>
</div>
<div class="problem-card accent">
<p class="stat-number">$1.5T</p>
<p class="stat-desc">global EdTech market by 2028, yet engagement rates remain critically low across existing platforms.</p>
</div>
<div class="problem-card blue">
<p class="stat-number">3x</p>
<p class="stat-desc">better retention with active recall vs passive learning. But most platforms still use outdated one-way content delivery.</p>
</div>
</div>
</body></html>`);

    // SLIDE 3: Solution
    createSlideHTML(3, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 25pt 40pt 15pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.header-sub { font-size: 14pt; color: ${COLORS.accent}; margin: 5pt 0 0 0; }
.content { flex: 1; padding: 10pt 40pt 30pt 40pt; display: flex; gap: 25pt; }
.feature-box { flex: 1; background: ${COLORS.dark}; border-radius: 8pt; padding: 18pt; }
.feature-title { font-size: 14pt; font-weight: bold; color: ${COLORS.accent}; margin: 0 0 10pt 0; }
.feature-desc { font-size: 11pt; color: ${COLORS.primary}; margin: 0; line-height: 1.5; opacity: 0.9; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Our Solution: Competitive Learning</h1>
<p class="header-sub">Social Media for Students + AI-Powered Exam Preparation</p>
</div>
<div class="content">
<div class="feature-box">
<h2 class="feature-title">Knowledge Sparring</h2>
<p class="feature-desc">Real-time head-to-head quiz battles where players alternate asking AND answering questions. Active recall meets competitive gaming.</p>
</div>
<div class="feature-box">
<h2 class="feature-title">Knowledge Rating (KR)</h2>
<p class="feature-desc">Chess-style ELO rating system for academics. 800 (Beginner) to 2000+ (Elite). Quantifiable progress students can track and share.</p>
</div>
<div class="feature-box">
<h2 class="feature-title">AI-Powered Learning</h2>
<p class="feature-desc">Personalized tutoring, adaptive difficulty, unlimited question generation, and real-time coaching. 24/7 availability at fraction of tutor cost.</p>
</div>
</div>
</body></html>`);

    // SLIDE 4: Product Overview
    createSlideHTML(4, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 20pt 40pt 10pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 5pt 40pt 25pt 40pt; display: flex; gap: 15pt; }
.col { flex: 1; display: flex; flex-direction: column; gap: 12pt; }
.feature-item { background: ${COLORS.dark}; border-radius: 6pt; padding: 12pt 15pt; }
.item-title { font-size: 12pt; font-weight: bold; color: ${COLORS.accent}; margin: 0 0 5pt 0; }
.item-desc { font-size: 10pt; color: ${COLORS.primary}; margin: 0; opacity: 0.85; line-height: 1.4; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Platform Features</h1>
</div>
<div class="content">
<div class="col">
<div class="feature-item">
<h3 class="item-title">Live Knowledge Battles</h3>
<p class="item-desc">Real-time multiplayer sparring matches with ranked matchmaking</p>
</div>
<div class="feature-item">
<h3 class="item-title">AI Tutor</h3>
<p class="item-desc">Personalized tutoring in any subject with adaptive learning paths</p>
</div>
<div class="feature-item">
<h3 class="item-title">Play with Bot</h3>
<p class="item-desc">Practice anytime with AI opponents at 4 difficulty levels</p>
</div>
<div class="feature-item">
<h3 class="item-title">Tournament Engine</h3>
<p class="item-desc">World Cup-style competitions with brackets and prizes</p>
</div>
</div>
<div class="col">
<div class="feature-item">
<h3 class="item-title">Social Hub</h3>
<p class="item-desc">Connect with peers, form study circles, share achievements</p>
</div>
<div class="feature-item">
<h3 class="item-title">Global Leaderboards</h3>
<p class="item-desc">Climb rankings by subject, region, or globally</p>
</div>
<div class="feature-item">
<h3 class="item-title">Career Portal</h3>
<p class="item-desc">High-KR students qualify for real work opportunities</p>
</div>
<div class="feature-item">
<h3 class="item-title">Safety First</h3>
<p class="item-desc">Student verification, parental controls, AI moderation</p>
</div>
</div>
</div>
</body></html>`);

    // SLIDE 5: Market Opportunity
    createSlideHTML(5, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 20pt 40pt 10pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 20pt 40pt 30pt 40pt; display: flex; gap: 30pt; }
.market-col { flex: 1; text-align: center; }
.market-label { font-size: 11pt; color: ${COLORS.primary}; opacity: 0.7; margin: 0 0 5pt 0; }
.market-value { font-size: 42pt; font-weight: bold; color: ${COLORS.accent}; margin: 0 0 8pt 0; }
.market-desc { font-size: 11pt; color: ${COLORS.primary}; margin: 0; opacity: 0.8; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Market Opportunity</h1>
</div>
<div class="content">
<div class="market-col">
<p class="market-label">TOTAL ADDRESSABLE MARKET</p>
<p class="market-value">$404B</p>
<p class="market-desc">Global education market</p>
</div>
<div class="market-col">
<p class="market-label">SERVICEABLE MARKET</p>
<p class="market-value">$72B</p>
<p class="market-desc">Online learning segment</p>
</div>
<div class="market-col">
<p class="market-label">TARGET MARKET</p>
<p class="market-value">$8.5B</p>
<p class="market-desc">Competitive EdTech niche</p>
</div>
</div>
</body></html>`);

    // SLIDE 6: Business Model
    createSlideHTML(6, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 20pt 40pt 10pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 10pt 40pt 25pt 40pt; display: flex; gap: 30pt; }
.model-section { flex: 1; }
.section-header { background: ${COLORS.light}; border-radius: 4pt; padding: 8pt 12pt; margin-bottom: 12pt; }
.section-title { font-size: 14pt; font-weight: bold; color: ${COLORS.accent}; margin: 0; }
.plan-item { margin-bottom: 12pt; padding-left: 5pt; }
.plan-name { font-size: 12pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.plan-price { font-size: 11pt; color: ${COLORS.accent}; margin: 2pt 0; }
.plan-features { font-size: 9pt; color: ${COLORS.primary}; opacity: 0.75; margin: 0; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Business Model</h1>
</div>
<div class="content">
<div class="model-section">
<div class="section-header">
<h2 class="section-title">Consumer Plans</h2>
</div>
<div class="plan-item">
<p class="plan-name">Free</p>
<p class="plan-price">$0/month</p>
<p class="plan-features">5 matches/day, basic features</p>
</div>
<div class="plan-item">
<p class="plan-name">Scholar</p>
<p class="plan-price">$4.99/month</p>
<p class="plan-features">Unlimited matches, AI coach, tournaments</p>
</div>
<div class="plan-item">
<p class="plan-name">Champion</p>
<p class="plan-price">$9.99/month</p>
<p class="plan-features">Priority matchmaking, analytics</p>
</div>
<div class="plan-item">
<p class="plan-name">Elite</p>
<p class="plan-price">$19.99/month</p>
<p class="plan-features">1-on-1 AI tutoring, career counseling</p>
</div>
</div>
<div class="model-section">
<div class="section-header">
<h2 class="section-title">Institutional Plans</h2>
</div>
<div class="plan-item">
<p class="plan-name">Trial</p>
<p class="plan-price">Free - 30 days</p>
<p class="plan-features">50 students, basic features</p>
</div>
<div class="plan-item">
<p class="plan-name">Standard</p>
<p class="plan-price">$299/month</p>
<p class="plan-features">500 students, internal exams</p>
</div>
<div class="plan-item">
<p class="plan-name">Premium</p>
<p class="plan-price">$799/month</p>
<p class="plan-features">2,500 students, regional exams</p>
</div>
<div class="plan-item">
<p class="plan-name">Enterprise</p>
<p class="plan-price">Custom pricing</p>
<p class="plan-features">Unlimited, white-label, national exams</p>
</div>
</div>
</div>
</body></html>`);

    // SLIDE 7: Competitive Advantage
    createSlideHTML(7, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 20pt 40pt 10pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 10pt 40pt 20pt 40pt; }
.table-header { display: flex; background: ${COLORS.light}; border-radius: 4pt 4pt 0 0; padding: 10pt 8pt; }
.table-row { display: flex; padding: 8pt 8pt; }
.table-row.alt { background: ${COLORS.dark}; }
.col-feature { width: 180pt; }
.col { flex: 1; text-align: center; }
.header-text { font-size: 11pt; font-weight: bold; color: ${COLORS.accent}; margin: 0; }
.cell-text { font-size: 10pt; color: ${COLORS.primary}; margin: 0; }
.check { color: #4ADE80; font-weight: bold; }
.cross { color: #FF6B6B; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Competitive Advantage</h1>
</div>
<div class="content">
<div class="table-header">
<div class="col-feature"><p class="header-text">Feature</p></div>
<div class="col"><p class="header-text">EduSparring</p></div>
<div class="col"><p class="header-text">Duolingo</p></div>
<div class="col"><p class="header-text">Kahoot!</p></div>
<div class="col"><p class="header-text">Tutoring</p></div>
</div>
<div class="table-row alt">
<div class="col-feature"><p class="cell-text">Real-time Multiplayer</p></div>
<div class="col"><p class="cell-text check">Yes</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text check">Yes</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
</div>
<div class="table-row">
<div class="col-feature"><p class="cell-text">Academic Subjects</p></div>
<div class="col"><p class="cell-text check">All</p></div>
<div class="col"><p class="cell-text cross">Languages</p></div>
<div class="col"><p class="cell-text check">All</p></div>
<div class="col"><p class="cell-text check">All</p></div>
</div>
<div class="table-row alt">
<div class="col-feature"><p class="cell-text">Knowledge Rating System</p></div>
<div class="col"><p class="cell-text check">Yes</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
</div>
<div class="table-row">
<div class="col-feature"><p class="cell-text">AI Question Generation</p></div>
<div class="col"><p class="cell-text check">Unlimited</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text cross">Limited</p></div>
</div>
<div class="table-row alt">
<div class="col-feature"><p class="cell-text">Career Pathway</p></div>
<div class="col"><p class="cell-text check">Yes</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
<div class="col"><p class="cell-text cross">No</p></div>
</div>
<div class="table-row">
<div class="col-feature"><p class="cell-text">Cost per Month</p></div>
<div class="col"><p class="cell-text">$0-20</p></div>
<div class="col"><p class="cell-text">$13</p></div>
<div class="col"><p class="cell-text">$3-10</p></div>
<div class="col"><p class="cell-text">$50-150/hr</p></div>
</div>
</div>
</body></html>`);

    // SLIDE 8: Unique Innovations
    createSlideHTML(8, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 20pt 40pt 10pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 10pt 40pt 25pt 40pt; display: flex; flex-wrap: wrap; gap: 15pt; }
.innovation-card { width: calc(50% - 10pt); background: ${COLORS.dark}; border-radius: 8pt; padding: 15pt; box-sizing: border-box; }
.innov-title { font-size: 13pt; font-weight: bold; color: ${COLORS.accent}; margin: 0 0 8pt 0; }
.innov-desc { font-size: 10pt; color: ${COLORS.primary}; margin: 0; line-height: 1.5; opacity: 0.9; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Unique Innovations</h1>
</div>
<div class="content">
<div class="innovation-card">
<h3 class="innov-title">True Sparring Concept</h3>
<p class="innov-desc">Players alternate asking AND answering questions, creating deeper engagement and peer-to-peer learning dynamics.</p>
</div>
<div class="innovation-card">
<h3 class="innov-title">Knowledge Rating System</h3>
<p class="innov-desc">First educational platform with chess-style ELO rating, creating addiction loops and measurable progress tracking.</p>
</div>
<div class="innovation-card">
<h3 class="innov-title">Mock Employment Program</h3>
<p class="innov-desc">High-KR students qualify for real work opportunities, bridging education and employment with 92% career clarity rate.</p>
</div>
<div class="innovation-card">
<h3 class="innov-title">Viral Highlights</h3>
<p class="innov-desc">TikTok-style shareable battle recaps with dramatic moments, turning learning into shareable social content.</p>
</div>
<div class="innovation-card">
<h3 class="innov-title">AI-Native Architecture</h3>
<p class="innov-desc">Built from ground up with AI integration for question generation, coaching, moderation, and personalization.</p>
</div>
<div class="innovation-card">
<h3 class="innov-title">28+ Languages</h3>
<p class="innov-desc">Real-time translation enables global reach across 6 continents with localized exam preparation.</p>
</div>
</div>
</body></html>`);

    // SLIDE 9: Growth Flywheel
    createSlideHTML(9, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 15pt 40pt 8pt 40pt; }
.header-title { font-size: 26pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 8pt 40pt 20pt 40pt; display: flex; justify-content: center; align-items: center; }
.flywheel { display: flex; flex-direction: column; align-items: center; gap: 6pt; }
.fw-item { background: ${COLORS.dark}; border-radius: 5pt; padding: 8pt 25pt; text-align: center; }
.fw-text { font-size: 11pt; color: ${COLORS.primary}; margin: 0; }
.fw-arrow { font-size: 14pt; color: ${COLORS.accent}; margin: 0; }
.fw-item.highlight { background: ${COLORS.accent}; }
.fw-item.highlight .fw-text { color: ${COLORS.bg}; font-weight: bold; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Growth Flywheel</h1>
</div>
<div class="content">
<div class="flywheel">
<div class="fw-item"><p class="fw-text">Sparring Highlights Go Viral</p></div>
<p class="fw-arrow">↓</p>
<div class="fw-item"><p class="fw-text">New Users Join Platform</p></div>
<p class="fw-arrow">↓</p>
<div class="fw-item"><p class="fw-text">Seasonal Leagues Create Addiction</p></div>
<p class="fw-arrow">↓</p>
<div class="fw-item"><p class="fw-text">Tournaments Drive Spectators</p></div>
<p class="fw-arrow">↓</p>
<div class="fw-item highlight"><p class="fw-text">Community Growth = More Highlights</p></div>
</div>
</div>
</body></html>`);

    // SLIDE 10: Financial Projections
    createSlideHTML(10, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 20pt 40pt 10pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 10pt 40pt 25pt 40pt; display: flex; gap: 25pt; }
.metrics-col { width: 180pt; }
.metric-item { margin-bottom: 18pt; }
.metric-year { font-size: 11pt; color: ${COLORS.primary}; opacity: 0.7; margin: 0; }
.metric-value { font-size: 28pt; font-weight: bold; color: ${COLORS.accent}; margin: 3pt 0; }
.metric-label { font-size: 10pt; color: ${COLORS.primary}; margin: 0; opacity: 0.8; }
.chart-col { flex: 1; }
.chart-placeholder { width: 100%; height: 200pt; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Financial Projections</h1>
</div>
<div class="content">
<div class="metrics-col">
<div class="metric-item">
<p class="metric-year">Year 1</p>
<p class="metric-value">$2.4M</p>
<p class="metric-label">ARR</p>
</div>
<div class="metric-item">
<p class="metric-year">Year 3</p>
<p class="metric-value">$18M</p>
<p class="metric-label">ARR</p>
</div>
<div class="metric-item">
<p class="metric-year">Year 5</p>
<p class="metric-value">$65M</p>
<p class="metric-label">ARR</p>
</div>
</div>
<div class="chart-col">
<div id="chart" class="placeholder chart-placeholder"></div>
</div>
</div>
</body></html>`);

    // SLIDE 11: The Ask
    createSlideHTML(11, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; background: ${COLORS.bg}; }
.header { padding: 25pt 40pt 15pt 40pt; }
.header-title { font-size: 28pt; font-weight: bold; color: ${COLORS.primary}; margin: 0; }
.content { flex: 1; padding: 10pt 40pt 30pt 40pt; display: flex; gap: 30pt; }
.ask-main { flex: 1; background: ${COLORS.dark}; border-radius: 10pt; padding: 30pt; text-align: center; display: flex; flex-direction: column; justify-content: center; }
.ask-amount { font-size: 48pt; font-weight: bold; color: ${COLORS.accent}; margin: 0; }
.ask-label { font-size: 16pt; color: ${COLORS.primary}; margin: 10pt 0 0 0; }
.use-col { flex: 1; }
.use-title { font-size: 16pt; font-weight: bold; color: ${COLORS.accent}; margin: 0 0 18pt 0; }
.use-item { display: flex; align-items: center; margin-bottom: 15pt; }
.use-percent { font-size: 16pt; font-weight: bold; color: ${COLORS.accent}; width: 50pt; margin: 0; }
.use-desc { font-size: 12pt; color: ${COLORS.primary}; margin: 0; }
</style></head>
<body>
<div class="header">
<h1 class="header-title">Investment Opportunity</h1>
</div>
<div class="content">
<div class="ask-main">
<p class="ask-amount">$2.5M</p>
<p class="ask-label">Seed Round</p>
</div>
<div class="use-col">
<h3 class="use-title">Use of Funds</h3>
<div class="use-item">
<p class="use-percent">40%</p>
<p class="use-desc">Product Development and AI</p>
</div>
<div class="use-item">
<p class="use-percent">30%</p>
<p class="use-desc">Marketing and User Acquisition</p>
</div>
<div class="use-item">
<p class="use-percent">20%</p>
<p class="use-desc">Team Expansion</p>
</div>
<div class="use-item">
<p class="use-percent">10%</p>
<p class="use-desc">Operations and Infrastructure</p>
</div>
</div>
</div>
</body></html>`);

    // SLIDE 12: Closing
    createSlideHTML(12, `<!DOCTYPE html>
<html><head><style>
html { background: ${COLORS.bg}; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; background: ${COLORS.bg}; }
.accent-line { width: 60pt; height: 4pt; background: ${COLORS.accent}; margin-bottom: 20pt; border-radius: 2pt; }
.logo { font-size: 36pt; font-weight: bold; color: ${COLORS.primary}; margin: 0 0 15pt 0; }
.tagline { font-size: 18pt; color: ${COLORS.accent}; margin: 0 0 30pt 0; }
.cta { font-size: 14pt; color: ${COLORS.primary}; margin: 0; opacity: 0.8; }
.contact { font-size: 12pt; color: ${COLORS.accent}; margin: 15pt 0 0 0; }
</style></head>
<body>
<div class="accent-line"></div>
<h1 class="logo">EduSparring</h1>
<p class="tagline">Turn Knowledge Into Competitive Battles</p>
<p class="cta">Let's transform education together</p>
<p class="contact">investors@edusparring.com</p>
</body></html>`);

    console.log('   12 slides created.\n');

    // Create PowerPoint
    console.log('2. Converting to PowerPoint...');
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'EduSparring';
    pptx.title = 'EduSparring Investor Pitch Deck';
    pptx.subject = 'Seed Investment Opportunity';

    // Process each slide
    for (let i = 1; i <= 12; i++) {
        const htmlFile = path.join(SLIDES_DIR, `slide${i}.html`);
        const result = await html2pptx(htmlFile, pptx);
        console.log(`   Slide ${i} converted`);
        
        // Add chart to slide 10
        if (i === 10 && result.placeholders.length > 0) {
            result.slide.addChart(pptx.charts.BAR, [{
                name: 'Revenue ($M)',
                labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
                values: [2.4, 7.5, 18, 38, 65]
            }], {
                ...result.placeholders[0],
                barDir: 'col',
                showTitle: false,
                showLegend: false,
                chartColors: ['37DCF2'],
                showValue: true,
                dataLabelPosition: 'outEnd',
                dataLabelColor: 'FFFFFF',
                dataLabelFontSize: 10,
                valAxisMaxVal: 80,
                valAxisMinVal: 0,
                catAxisLabelColor: 'FFFFFF',
                valAxisLabelColor: 'FFFFFF',
                catGridLine: { style: 'none' },
                valGridLine: { color: '2A4A3A', style: 'dash' }
            });
        }
    }

    // Save presentation
    const outputPath = '/home/z/my-project/download/EduSparring_Investor_Pitch_Deck.pptx';
    await pptx.writeFile({ fileName: outputPath });
    console.log(`\n3. Presentation saved to: ${outputPath}`);
    console.log('\n✅ Pitch deck creation complete!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
