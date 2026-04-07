const pptxgen = require('pptxgenjs');

// Color scheme (no # prefix for pptxgenjs)
const COLORS = {
    bg: '193328',
    primary: 'FFFFFF',
    accent: '37DCF2',
    dark: '0D1F1A',
    light: '2A4A3A'
};

async function main() {
    console.log('Creating EduSparring Investor Pitch Deck...\n');

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'EduSparring';
    pptx.title = 'EduSparring Investor Pitch Deck';
    pptx.subject = 'Seed Investment Opportunity';

    // SLIDE 1: Cover
    let slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    // Accent line
    slide.addShape(pptx.ShapeType.rect, {
        x: 4.2, y: 2.0, w: 1.1, h: 0.06,
        fill: { color: COLORS.accent }
    });
    // Logo
    slide.addText('EduSparring', {
        x: 0, y: 2.2, w: '100%', h: 0.8,
        fontSize: 48, fontFace: 'Arial', bold: true,
        color: COLORS.primary, align: 'center'
    });
    // Tagline
    slide.addText('Turn Knowledge Into Competitive Battles', {
        x: 0, y: 3.0, w: '100%', h: 0.5,
        fontSize: 22, fontFace: 'Arial',
        color: COLORS.accent, align: 'center'
    });
    // Subtitle
    slide.addText('Investor Pitch Deck 2025', {
        x: 0, y: 3.6, w: '100%', h: 0.4,
        fontSize: 14, fontFace: 'Arial',
        color: COLORS.primary, align: 'center', transparency: 30
    });

    // SLIDE 2: Problem
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('The Education Engagement Crisis', {
        x: 0.5, y: 0.3, w: 9, h: 0.6,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    // Problem cards
    const problems = [
        { num: '65%', desc: 'of students report being bored in traditional classrooms. Passive learning methods fail to capture attention in the digital age.', color: 'FF6B6B' },
        { num: '$1.5T', desc: 'global EdTech market by 2028, yet engagement rates remain critically low across existing platforms.', color: 'FFB84D' },
        { num: '3x', desc: 'better retention with active recall vs passive learning. But most platforms still use outdated one-way content delivery.', color: '6B9FFF' }
    ];
    
    problems.forEach((p, i) => {
        const x = 0.5 + i * 3.1;
        slide.addShape(pptx.ShapeType.roundRect, {
            x: x, y: 1.1, w: 2.9, h: 3.5,
            fill: { color: COLORS.dark }, rectRadius: 0.1
        });
        slide.addText(p.num, {
            x: x, y: 1.3, w: 2.9, h: 0.7,
            fontSize: 32, fontFace: 'Arial', bold: true, color: p.color, align: 'center'
        });
        slide.addText(p.desc, {
            x: x + 0.2, y: 2.1, w: 2.5, h: 2.3,
            fontSize: 11, fontFace: 'Arial', color: COLORS.primary, valign: 'top'
        });
    });

    // SLIDE 3: Solution
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Our Solution: Competitive Learning', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    slide.addText('Social Media for Students + AI-Powered Exam Preparation', {
        x: 0.5, y: 0.8, w: 9, h: 0.3,
        fontSize: 14, fontFace: 'Arial', color: COLORS.accent
    });
    
    const solutions = [
        { title: 'Knowledge Sparring', desc: 'Real-time head-to-head quiz battles where players alternate asking AND answering questions. Active recall meets competitive gaming.' },
        { title: 'Knowledge Rating (KR)', desc: 'Chess-style ELO rating system for academics. 800 (Beginner) to 2000+ (Elite). Quantifiable progress students can track and share.' },
        { title: 'AI-Powered Learning', desc: 'Personalized tutoring, adaptive difficulty, unlimited question generation, and real-time coaching. 24/7 availability at fraction of tutor cost.' }
    ];
    
    solutions.forEach((s, i) => {
        const x = 0.5 + i * 3.1;
        slide.addShape(pptx.ShapeType.roundRect, {
            x: x, y: 1.3, w: 2.9, h: 3.2,
            fill: { color: COLORS.dark }, rectRadius: 0.1
        });
        slide.addText(s.title, {
            x: x + 0.15, y: 1.5, w: 2.6, h: 0.4,
            fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.accent
        });
        slide.addText(s.desc, {
            x: x + 0.15, y: 2.0, w: 2.6, h: 2.3,
            fontSize: 11, fontFace: 'Arial', color: COLORS.primary, valign: 'top'
        });
    });

    // SLIDE 4: Platform Features
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Platform Features', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    const features = [
        ['Live Knowledge Battles', 'Real-time multiplayer sparring matches with ranked matchmaking'],
        ['AI Tutor', 'Personalized tutoring in any subject with adaptive learning paths'],
        ['Play with Bot', 'Practice anytime with AI opponents at 4 difficulty levels'],
        ['Tournament Engine', 'World Cup-style competitions with brackets and prizes'],
        ['Social Hub', 'Connect with peers, form study circles, share achievements'],
        ['Global Leaderboards', 'Climb rankings by subject, region, or globally'],
        ['Career Portal', 'High-KR students qualify for real work opportunities'],
        ['Safety First', 'Student verification, parental controls, AI moderation']
    ];
    
    features.forEach((f, i) => {
        const col = i < 4 ? 0 : 1;
        const row = i % 4;
        const x = 0.5 + col * 4.7;
        const y = 1.0 + row * 0.85;
        
        slide.addShape(pptx.ShapeType.roundRect, {
            x: x, y: y, w: 4.5, h: 0.75,
            fill: { color: COLORS.dark }, rectRadius: 0.05
        });
        slide.addText(f[0], {
            x: x + 0.15, y: y + 0.08, w: 4.2, h: 0.3,
            fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.accent
        });
        slide.addText(f[1], {
            x: x + 0.15, y: y + 0.38, w: 4.2, h: 0.3,
            fontSize: 10, fontFace: 'Arial', color: COLORS.primary, transparency: 15
        });
    });

    // SLIDE 5: Market Opportunity
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Market Opportunity', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    const markets = [
        { label: 'TOTAL ADDRESSABLE MARKET', value: '$404B', desc: 'Global education market' },
        { label: 'SERVICEABLE MARKET', value: '$72B', desc: 'Online learning segment' },
        { label: 'TARGET MARKET', value: '$8.5B', desc: 'Competitive EdTech niche' }
    ];
    
    markets.forEach((m, i) => {
        const x = 0.5 + i * 3.2;
        slide.addText(m.label, {
            x: x, y: 1.5, w: 3, h: 0.3,
            fontSize: 10, fontFace: 'Arial', color: COLORS.primary, align: 'center', transparency: 30
        });
        slide.addText(m.value, {
            x: x, y: 1.9, w: 3, h: 0.8,
            fontSize: 42, fontFace: 'Arial', bold: true, color: COLORS.accent, align: 'center'
        });
        slide.addText(m.desc, {
            x: x, y: 2.7, w: 3, h: 0.3,
            fontSize: 11, fontFace: 'Arial', color: COLORS.primary, align: 'center', transparency: 20
        });
    });

    // SLIDE 6: Business Model
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Business Model', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    // Consumer Plans
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y: 0.95, w: 4.3, h: 0.4,
        fill: { color: COLORS.light }, rectRadius: 0.05
    });
    slide.addText('Consumer Plans', {
        x: 0.5, y: 0.95, w: 4.3, h: 0.4,
        fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.accent, align: 'center', valign: 'middle'
    });
    
    const consumerPlans = [
        ['Free', '$0/month', '5 matches/day, basic features'],
        ['Scholar', '$4.99/month', 'Unlimited matches, AI coach, tournaments'],
        ['Champion', '$9.99/month', 'Priority matchmaking, analytics'],
        ['Elite', '$19.99/month', '1-on-1 AI tutoring, career counseling']
    ];
    
    consumerPlans.forEach((p, i) => {
        const y = 1.5 + i * 0.7;
        slide.addText(p[0], { x: 0.6, y: y, w: 2, h: 0.25, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.primary });
        slide.addText(p[1], { x: 0.6, y: y + 0.22, w: 2, h: 0.2, fontSize: 11, fontFace: 'Arial', color: COLORS.accent });
        slide.addText(p[2], { x: 0.6, y: y + 0.42, w: 4, h: 0.2, fontSize: 9, fontFace: 'Arial', color: COLORS.primary, transparency: 25 });
    });
    
    // Institutional Plans
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 5.2, y: 0.95, w: 4.3, h: 0.4,
        fill: { color: COLORS.light }, rectRadius: 0.05
    });
    slide.addText('Institutional Plans', {
        x: 5.2, y: 0.95, w: 4.3, h: 0.4,
        fontSize: 14, fontFace: 'Arial', bold: true, color: COLORS.accent, align: 'center', valign: 'middle'
    });
    
    const instPlans = [
        ['Trial', 'Free - 30 days', '50 students, basic features'],
        ['Standard', '$299/month', '500 students, internal exams'],
        ['Premium', '$799/month', '2,500 students, regional exams'],
        ['Enterprise', 'Custom pricing', 'Unlimited, white-label, national exams']
    ];
    
    instPlans.forEach((p, i) => {
        const y = 1.5 + i * 0.7;
        slide.addText(p[0], { x: 5.3, y: y, w: 2, h: 0.25, fontSize: 12, fontFace: 'Arial', bold: true, color: COLORS.primary });
        slide.addText(p[1], { x: 5.3, y: y + 0.22, w: 2, h: 0.2, fontSize: 11, fontFace: 'Arial', color: COLORS.accent });
        slide.addText(p[2], { x: 5.3, y: y + 0.42, w: 4, h: 0.2, fontSize: 9, fontFace: 'Arial', color: COLORS.primary, transparency: 25 });
    });

    // SLIDE 7: Competitive Advantage
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Competitive Advantage', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    // Table data
    const tableData = [
        [{ text: 'Feature', options: { fill: { color: COLORS.light }, color: COLORS.accent, bold: true } },
         { text: 'EduSparring', options: { fill: { color: COLORS.light }, color: COLORS.accent, bold: true } },
         { text: 'Duolingo', options: { fill: { color: COLORS.light }, color: COLORS.accent, bold: true } },
         { text: 'Kahoot!', options: { fill: { color: COLORS.light }, color: COLORS.accent, bold: true } },
         { text: 'Tutoring', options: { fill: { color: COLORS.light }, color: COLORS.accent, bold: true } }],
        ['Real-time Multiplayer', { text: 'Yes', options: { color: '4ADE80', bold: true } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'Yes', options: { color: '4ADE80', bold: true } }, { text: 'No', options: { color: 'FF6B6B' } }],
        ['Academic Subjects', { text: 'All', options: { color: '4ADE80', bold: true } }, { text: 'Languages', options: { color: 'FF6B6B' } }, { text: 'All', options: { color: '4ADE80', bold: true } }, { text: 'All', options: { color: '4ADE80', bold: true } }],
        ['Knowledge Rating System', { text: 'Yes', options: { color: '4ADE80', bold: true } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'No', options: { color: 'FF6B6B' } }],
        ['AI Question Generation', { text: 'Unlimited', options: { color: '4ADE80', bold: true } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'Limited', options: { color: 'FF6B6B' } }],
        ['Career Pathway', { text: 'Yes', options: { color: '4ADE80', bold: true } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'No', options: { color: 'FF6B6B' } }, { text: 'No', options: { color: 'FF6B6B' } }],
        ['Cost per Month', '$0-20', '$13', '$3-10', '$50-150/hr']
    ];
    
    slide.addTable(tableData, {
        x: 0.5, y: 1.0, w: 9, colW: [2.2, 1.7, 1.7, 1.7, 1.7],
        border: { pt: 0.5, color: COLORS.dark },
        fontFace: 'Arial', fontSize: 10, color: COLORS.primary,
        align: 'center', valign: 'middle'
    });

    // SLIDE 8: Unique Innovations
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Unique Innovations', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    const innovations = [
        ['True Sparring Concept', 'Players alternate asking AND answering questions, creating deeper engagement and peer-to-peer learning dynamics.'],
        ['Knowledge Rating System', 'First educational platform with chess-style ELO rating, creating addiction loops and measurable progress tracking.'],
        ['Mock Employment Program', 'High-KR students qualify for real work opportunities, bridging education and employment with 92% career clarity rate.'],
        ['Viral Highlights', 'TikTok-style shareable battle recaps with dramatic moments, turning learning into shareable social content.'],
        ['AI-Native Architecture', 'Built from ground up with AI integration for question generation, coaching, moderation, and personalization.'],
        ['28+ Languages', 'Real-time translation enables global reach across 6 continents with localized exam preparation.']
    ];
    
    innovations.forEach((inn, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 0.5 + col * 4.7;
        const y = 1.0 + row * 1.3;
        
        slide.addShape(pptx.ShapeType.roundRect, {
            x: x, y: y, w: 4.5, h: 1.15,
            fill: { color: COLORS.dark }, rectRadius: 0.08
        });
        slide.addText(inn[0], {
            x: x + 0.15, y: y + 0.1, w: 4.2, h: 0.35,
            fontSize: 13, fontFace: 'Arial', bold: true, color: COLORS.accent
        });
        slide.addText(inn[1], {
            x: x + 0.15, y: y + 0.45, w: 4.2, h: 0.65,
            fontSize: 10, fontFace: 'Arial', color: COLORS.primary, valign: 'top', transparency: 10
        });
    });

    // SLIDE 9: Growth Flywheel
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Growth Flywheel', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 26, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    const flywheel = [
        ['Sparring Highlights Go Viral', COLORS.dark],
        ['New Users Join Platform', COLORS.dark],
        ['Seasonal Leagues Create Addiction', COLORS.dark],
        ['Tournaments Drive Spectators', COLORS.dark],
        ['Community Growth = More Highlights', COLORS.accent]
    ];
    
    flywheel.forEach((f, i) => {
        const y = 1.0 + i * 0.75;
        const textColor = f[1] === COLORS.accent ? COLORS.bg : COLORS.primary;
        
        slide.addShape(pptx.ShapeType.roundRect, {
            x: 2.5, y: y, w: 5, h: 0.5,
            fill: { color: f[1] }, rectRadius: 0.05
        });
        slide.addText(f[0], {
            x: 2.5, y: y, w: 5, h: 0.5,
            fontSize: 12, fontFace: 'Arial', bold: f[1] === COLORS.accent, color: textColor, align: 'center', valign: 'middle'
        });
        
        if (i < 4) {
            slide.addText('↓', {
                x: 4.75, y: y + 0.45, w: 0.5, h: 0.3,
                fontSize: 16, fontFace: 'Arial', color: COLORS.accent, align: 'center'
            });
        }
    });

    // SLIDE 10: Financial Projections
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Financial Projections', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    // Metrics
    const metrics = [
        ['Year 1', '$2.4M', 'ARR'],
        ['Year 3', '$18M', 'ARR'],
        ['Year 5', '$65M', 'ARR']
    ];
    
    metrics.forEach((m, i) => {
        const y = 1.1 + i * 0.9;
        slide.addText(m[0], { x: 0.5, y: y, w: 2, h: 0.25, fontSize: 10, fontFace: 'Arial', color: COLORS.primary, transparency: 30 });
        slide.addText(m[1], { x: 0.5, y: y + 0.2, w: 2, h: 0.5, fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.accent });
        slide.addText(m[2], { x: 0.5, y: y + 0.65, w: 2, h: 0.2, fontSize: 10, fontFace: 'Arial', color: COLORS.primary, transparency: 20 });
    });
    
    // Revenue chart
    slide.addChart(pptx.charts.BAR, [{
        name: 'Revenue ($M)',
        labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        values: [2.4, 7.5, 18, 38, 65]
    }], {
        x: 3, y: 1.0, w: 6.5, h: 3.5,
        barDir: 'col',
        showTitle: false,
        showLegend: false,
        chartColors: [COLORS.accent],
        showValue: true,
        dataLabelPosition: 'outEnd',
        dataLabelColor: COLORS.primary,
        dataLabelFontSize: 10,
        valAxisMaxVal: 80,
        valAxisMinVal: 0,
        catAxisLabelColor: COLORS.primary,
        valAxisLabelColor: COLORS.primary,
        catGridLine: { style: 'none' },
        valGridLine: { color: COLORS.light, style: 'dash' }
    });

    // SLIDE 11: Investment Opportunity
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    slide.addText('Investment Opportunity', {
        x: 0.5, y: 0.3, w: 9, h: 0.5,
        fontSize: 28, fontFace: 'Arial', bold: true, color: COLORS.primary
    });
    
    // Ask amount box
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y: 1.0, w: 4, h: 2.5,
        fill: { color: COLORS.dark }, rectRadius: 0.12
    });
    slide.addText('$2.5M', {
        x: 0.5, y: 1.5, w: 4, h: 1,
        fontSize: 48, fontFace: 'Arial', bold: true, color: COLORS.accent, align: 'center'
    });
    slide.addText('Seed Round', {
        x: 0.5, y: 2.5, w: 4, h: 0.5,
        fontSize: 16, fontFace: 'Arial', color: COLORS.primary, align: 'center'
    });
    
    // Use of funds
    slide.addText('Use of Funds', {
        x: 5, y: 1.0, w: 4.5, h: 0.4,
        fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.accent
    });
    
    const funds = [
        ['40%', 'Product Development and AI'],
        ['30%', 'Marketing and User Acquisition'],
        ['20%', 'Team Expansion'],
        ['10%', 'Operations and Infrastructure']
    ];
    
    funds.forEach((f, i) => {
        const y = 1.6 + i * 0.55;
        slide.addText(f[0], {
            x: 5, y: y, w: 0.7, h: 0.35,
            fontSize: 16, fontFace: 'Arial', bold: true, color: COLORS.accent
        });
        slide.addText(f[1], {
            x: 5.8, y: y, w: 3.7, h: 0.35,
            fontSize: 12, fontFace: 'Arial', color: COLORS.primary
        });
    });

    // SLIDE 12: Closing
    slide = pptx.addSlide();
    slide.background = { color: COLORS.bg };
    
    // Accent line
    slide.addShape(pptx.ShapeType.rect, {
        x: 4.5, y: 1.8, w: 0.9, h: 0.06,
        fill: { color: COLORS.accent }
    });
    
    slide.addText('EduSparring', {
        x: 0, y: 2.0, w: '100%', h: 0.7,
        fontSize: 36, fontFace: 'Arial', bold: true, color: COLORS.primary, align: 'center'
    });
    slide.addText('Turn Knowledge Into Competitive Battles', {
        x: 0, y: 2.7, w: '100%', h: 0.4,
        fontSize: 18, fontFace: 'Arial', color: COLORS.accent, align: 'center'
    });
    slide.addText("Let's transform education together", {
        x: 0, y: 3.3, w: '100%', h: 0.3,
        fontSize: 14, fontFace: 'Arial', color: COLORS.primary, align: 'center', transparency: 20
    });
    slide.addText('investors@edusparring.com', {
        x: 0, y: 3.7, w: '100%', h: 0.3,
        fontSize: 12, fontFace: 'Arial', color: COLORS.accent, align: 'center'
    });

    // Save presentation
    const outputPath = '/home/z/my-project/download/EduSparring_Investor_Pitch_Deck.pptx';
    await pptx.writeFile({ fileName: outputPath });
    console.log(`✅ Presentation saved to: ${outputPath}`);
    console.log('\n📊 12-slide investor pitch deck created successfully!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
