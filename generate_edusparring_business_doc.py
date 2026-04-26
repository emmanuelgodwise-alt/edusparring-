#!/usr/bin/env python3
"""
EduSparring Business Document Generator
Includes: Investor Narrative + Growth Strategy (Baits)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# ━━ Color Palette (auto-generated) ━━
ACCENT       = colors.HexColor('#197998')
TEXT_PRIMARY = colors.HexColor('#232527')
TEXT_MUTED   = colors.HexColor('#80868c')
BG_SURFACE   = colors.HexColor('#e1e5e8')
BG_PAGE      = colors.HexColor('#edeef0')

# Register fonts
pdfmetrics.registerFont(TTFont('Liberation Serif', '/usr/share/fonts/truetype/chinese/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Liberation Serif Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
registerFontFamily('Liberation Serif', normal='Liberation Serif', bold='Liberation Serif Bold')

# Output path
OUTPUT_PATH = '/home/z/my-project/download/EduSparring_Investor_Narrative_and_Growth_Strategy.pdf'

def create_styles():
    """Create paragraph styles for the document."""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='DocTitle',
        fontName='Liberation Serif',
        fontSize=28,
        leading=36,
        alignment=TA_CENTER,
        textColor=TEXT_PRIMARY,
        spaceAfter=20
    ))
    
    # Subtitle
    styles.add(ParagraphStyle(
        name='DocSubtitle',
        fontName='Liberation Serif',
        fontSize=14,
        leading=20,
        alignment=TA_CENTER,
        textColor=TEXT_MUTED,
        spaceAfter=30
    ))
    
    # Section Header (H1)
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Liberation Serif',
        fontSize=18,
        leading=26,
        alignment=TA_LEFT,
        textColor=ACCENT,
        spaceBefore=24,
        spaceAfter=12
    ))
    
    # Subsection Header (H2)
    styles.add(ParagraphStyle(
        name='SubsectionHeader',
        fontName='Liberation Serif',
        fontSize=14,
        leading=20,
        alignment=TA_LEFT,
        textColor=TEXT_PRIMARY,
        spaceBefore=16,
        spaceAfter=8
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='DocBody',
        fontName='Liberation Serif',
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY,
        textColor=TEXT_PRIMARY,
        spaceBefore=6,
        spaceAfter=6,
        firstLineIndent=0
    ))
    
    # Bullet point
    styles.add(ParagraphStyle(
        name='DocBullet',
        fontName='Liberation Serif',
        fontSize=11,
        leading=16,
        alignment=TA_LEFT,
        textColor=TEXT_PRIMARY,
        spaceBefore=4,
        spaceAfter=4,
        leftIndent=20,
        bulletIndent=10
    ))
    
    # Quote / Highlight
    styles.add(ParagraphStyle(
        name='Highlight',
        fontName='Liberation Serif',
        fontSize=12,
        leading=18,
        alignment=TA_LEFT,
        textColor=ACCENT,
        spaceBefore=12,
        spaceAfter=12,
        leftIndent=30,
        borderPadding=10
    ))
    
    # Table header style
    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='Liberation Serif',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.white
    ))
    
    # Table cell style
    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Liberation Serif',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        textColor=TEXT_PRIMARY
    ))
    
    return styles

def build_document():
    """Build the complete PDF document."""
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=1*inch,
        rightMargin=1*inch,
        topMargin=1*inch,
        bottomMargin=1*inch
    )
    
    styles = create_styles()
    story = []
    
    # ═══════════════════════════════════════════════════════════════════
    # COVER / TITLE PAGE
    # ═══════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 100))
    story.append(Paragraph("EDUSPARRING", styles['DocTitle']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Comprehensive Investor Narrative", styles['DocSubtitle']))
    story.append(Paragraph("&", styles['DocSubtitle']))
    story.append(Paragraph("Growth Strategy Using Feature Baits", styles['DocSubtitle']))
    story.append(Spacer(1, 40))
    story.append(Paragraph("A Gamified Peer-Learning Platform with Clear Monetization Potential", styles['DocBody']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("MVP Live on Vercel | April 2026", styles['DocBody']))
    story.append(PageBreak())
    
    # ═══════════════════════════════════════════════════════════════════
    # PART 1: INVESTOR NARRATIVE
    # ═══════════════════════════════════════════════════════════════════
    story.append(Paragraph("PART ONE: COMPREHENSIVE INVESTOR NARRATIVE", styles['SectionHeader']))
    story.append(Spacer(1, 10))
    
    # Executive Summary
    story.append(Paragraph("Executive Summary", styles['SubsectionHeader']))
    story.append(Paragraph(
        "EduSparring represents a fresh approach to peer learning in the educational technology space. By combining skill-based matchmaking with gamification elements and real-world career outcomes, the platform addresses a fundamental challenge in education: connecting learners with complementary knowledge for mutual growth. The MVP is now live, demonstrating technical execution capability and providing a foundation for user validation and market testing.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The platform differentiates itself through a sophisticated Knowledge Rating (KR) system that quantifies skill levels across multiple dimensions, enabling intelligent peer matching that goes beyond simple subject categorization. This creates a 'peer Tinder' experience where meaningful learning connections replace superficial swipes, and each match carries potential for genuine knowledge exchange.",
        styles['DocBody']
    ))
    
    # The Problem We Solve
    story.append(Paragraph("The Problem We Solve", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Traditional education systems suffer from a one-to-many bottleneck: a single instructor attempting to address the diverse needs of many students. Peer learning offers a solution, but existing platforms lack systematic approaches to match learners effectively. Students struggle to find peers with complementary skill levels, leading to unproductive study sessions or abandoned learning partnerships.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Furthermore, the disconnect between academic learning and career outcomes leaves students questioning the practical value of their educational investments. The job market demands demonstrable skills, yet most learning platforms focus on content consumption rather than skill application and validation. This gap represents a significant opportunity for platforms that bridge learning and career advancement.",
        styles['DocBody']
    ))
    
    # Our Solution
    story.append(Paragraph("Our Solution: The EduSparring Platform", styles['SubsectionHeader']))
    story.append(Paragraph(
        "EduSparring transforms peer learning through three integrated pillars that work together to create a comprehensive learning ecosystem:",
        styles['DocBody']
    ))
    
    story.append(Paragraph("<b>1. Knowledge Rating (KR) System</b>", styles['DocBullet']))
    story.append(Paragraph(
        "The KR system quantifies skill levels across multiple dimensions, creating a detailed skill profile for each user. Unlike simple beginner-intermediate-advanced labels, the KR system captures nuance in competency, allowing for precise matching. Users rate their own abilities and receive ratings from peers, creating a self-correcting reputation system that builds trust and accountability.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("<b>2. Intelligent Match Quality Score</b>", styles['DocBullet']))
    story.append(Paragraph(
        "The matching algorithm calculates a match quality score based on skill complementarity. Rather than matching identical skill levels, EduSparring identifies pairs where one user's strengths align with another's growth areas. This creates optimal learning dyads where both participants gain value, transforming each match into a potential growth opportunity.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("<b>3. Mock Job Placement Feature</b>", styles['DocBullet']))
    story.append(Paragraph(
        "The Mock Job placement system connects learning outcomes with career preparation. Employer partners post simulated job assignments that allow students to demonstrate real-world skills in a low-stakes environment. This creates a direct pipeline from learning to employment, addressing the employability gap that plagues traditional education.",
        styles['DocBody']
    ))
    
    # Market Opportunity
    story.append(Paragraph("Market Opportunity", styles['SubsectionHeader']))
    story.append(Paragraph(
        "The global e-learning market exceeded $300 billion in 2024 and continues to grow as remote learning becomes normalized. Within this market, peer learning represents a rapidly expanding segment as students seek alternatives to expensive tutoring and impersonal MOOCs. The career preparation market adds another dimension, with job seekers actively seeking ways to demonstrate practical skills to employers.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "EduSparring positions itself at the intersection of these markets: peer learning for skill acquisition, and career preparation for skill validation. This dual positioning creates multiple revenue streams and user acquisition channels, reducing platform risk and increasing total addressable market.",
        styles['DocBody']
    ))
    
    # Competitive Advantage
    story.append(Paragraph("Competitive Advantage", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Unlike traditional tutoring platforms that charge premium fees for expert instruction, EduSparring leverages peer-to-peer exchanges that scale efficiently. Unlike MOOCs that suffer from low completion rates, EduSparring creates accountability through matched partnerships. Unlike generic networking platforms, EduSparring focuses specifically on learning outcomes with measurable skill progression.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The platform's technical foundation demonstrates production-ready capability. Built with Next.js 14, TypeScript, and Supabase PostgreSQL, the MVP showcases modern development practices and scalable architecture. Mobile-first responsive design ensures accessibility across devices, addressing the mobile learning trend that dominates student preferences.",
        styles['DocBody']
    ))
    
    # Monetization Strategy
    story.append(Paragraph("Monetization Strategy", styles['SubsectionHeader']))
    story.append(Paragraph(
        "EduSparring's monetization strategy leverages multiple revenue streams designed to align platform incentives with user success:",
        styles['DocBody']
    ))
    
    # Revenue streams table
    table_data = [
        [Paragraph('<b>Revenue Stream</b>', styles['TableHeader']),
         Paragraph('<b>Description</b>', styles['TableHeader']),
         Paragraph('<b>Timeline</b>', styles['TableHeader'])],
        [Paragraph('Employer Partnerships', styles['TableCell']),
         Paragraph('Companies pay to post Mock Jobs and access talent pipeline', styles['TableCell']),
         Paragraph('Phase 2', styles['TableCell'])],
        [Paragraph('Premium Matching', styles['TableCell']),
         Paragraph('Enhanced matching algorithms and priority pairing for subscribers', styles['TableCell']),
         Paragraph('Phase 2', styles['TableCell'])],
        [Paragraph('Certification Fees', styles['TableCell']),
         Paragraph('Verified skill certifications based on peer assessments', styles['TableCell']),
         Paragraph('Phase 3', styles['TableCell'])],
        [Paragraph('Enterprise Learning', styles['TableCell']),
         Paragraph('Corporate training programs using peer learning methodology', styles['TableCell']),
         Paragraph('Phase 3', styles['TableCell'])]
    ]
    
    table = Table(table_data, colWidths=[120, 220, 80])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.white),
        ('BACKGROUND', (0, 2), (-1, 2), BG_SURFACE),
        ('BACKGROUND', (0, 3), (-1, 3), colors.white),
        ('BACKGROUND', (0, 4), (-1, 4), BG_SURFACE),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(Spacer(1, 12))
    story.append(table)
    story.append(Spacer(1, 12))
    
    # Technical Excellence
    story.append(Paragraph("Technical Excellence", styles['SubsectionHeader']))
    story.append(Paragraph(
        "The MVP demonstrates production-ready technical capability with a modern, maintainable architecture. The technology stack reflects industry best practices and positions the platform for rapid iteration and scaling:",
        styles['DocBody']
    ))
    
    story.append(Paragraph("• <b>Next.js 14.2.35</b> with App Router for optimal performance and SEO", styles['DocBullet']))
    story.append(Paragraph("• <b>TypeScript</b> for type safety and developer productivity", styles['DocBullet']))
    story.append(Paragraph("• <b>Tailwind CSS + shadcn/ui</b> for consistent, accessible design", styles['DocBullet']))
    story.append(Paragraph("• <b>Prisma ORM</b> with Supabase PostgreSQL for reliable data management", styles['DocBullet']))
    story.append(Paragraph("• <b>Vercel deployment</b> for global CDN and serverless scalability", styles['DocBullet']))
    story.append(Paragraph("• <b>Mobile-first responsive design</b> ensuring accessibility across all devices", styles['DocBullet']))
    
    # MVP Evaluation
    story.append(Paragraph("MVP Evaluation: Smart Not Overbuilt", styles['SubsectionHeader']))
    story.append(Paragraph(
        "The EduSparring MVP represents a focused execution of core value propositions without feature creep. Key features implemented include user authentication, profile creation with Knowledge Rating system, peer matching algorithm, sparring session management, onboarding flow with skip logic, and mobile responsive design with hamburger navigation. This focused approach demonstrates product discipline and creates a foundation for iterative enhancement based on user feedback.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The platform's evaluation can be summarized as 'smart not overbuilt' - a compliment in product development. Rather than attempting to solve every problem, EduSparring focuses on doing one thing exceptionally well: connecting peers for meaningful learning exchanges. This focus allows for deeper refinement of core features and clearer measurement of user success metrics.",
        styles['DocBody']
    ))
    
    # The Ask
    story.append(Paragraph("The Ask", styles['SubsectionHeader']))
    story.append(Paragraph(
        "EduSparring seeks strategic investment to accelerate user acquisition, deepen employer partnerships, and expand the platform's feature set based on validated user needs. The MVP demonstrates technical capability; the next phase requires resources to validate market fit and establish sustainable growth channels. Investors gain access to a differentiated educational platform with clear monetization potential and a team committed to measurable outcomes.",
        styles['DocBody']
    ))
    
    story.append(PageBreak())
    
    # ═══════════════════════════════════════════════════════════════════
    # PART 2: GROWTH STRATEGY - FEATURES AS BAITS
    # ═══════════════════════════════════════════════════════════════════
    story.append(Paragraph("PART TWO: GROWTH STRATEGY", styles['SectionHeader']))
    story.append(Paragraph("Using Features as Baits for User Acquisition", styles['SubsectionHeader']))
    story.append(Spacer(1, 10))
    
    # Introduction
    story.append(Paragraph("The Baits Strategy Framework", styles['SubsectionHeader']))
    story.append(Paragraph(
        "In competitive markets, user acquisition often determines platform success or failure. EduSparring's existing features can be strategically positioned as 'baits' - compelling entry points that attract users who might not initially seek a peer learning platform. This approach transforms each feature into a marketing channel, leveraging product value for organic growth.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The baits strategy works because it reframes the user journey. Instead of asking users to adopt an entirely new learning paradigm, each bait offers immediate standalone value. Once users experience this value, the broader platform ecosystem becomes a natural extension of their engagement. This creates a low-friction entry path with high conversion potential.",
        styles['DocBody']
    ))
    
    # Primary Baits
    story.append(Paragraph("Primary Baits: High-Value Entry Points", styles['SubsectionHeader']))
    
    story.append(Paragraph("<b>1. Mock Job Placement as Career Bait</b>", styles['DocBullet']))
    story.append(Paragraph(
        "The Mock Job placement feature represents the most powerful bait in EduSparring's arsenal. Students actively seeking career opportunities represent a massive, motivated user base. By positioning Mock Jobs as a standalone career preparation tool, EduSparring can attract users who may not initially be interested in peer learning but desperately want to demonstrate their skills to potential employers.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The conversion pathway is clear: users join to complete Mock Jobs, discover peer matching during the process, and gradually engage with the broader learning ecosystem. Employers benefit from a pre-vetted talent pipeline, creating a virtuous cycle where employer participation attracts more students, and student participation attracts more employers.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Implementation requires targeted outreach to career services departments, job fairs, and professional networking platforms. Messaging should emphasize practical outcomes: 'Complete real assignments from actual employers' and 'Build a portfolio that gets noticed.' The career bait addresses the fundamental question every student asks: 'How will this help me get a job?'",
        styles['DocBody']
    ))
    
    story.append(Paragraph("<b>2. Knowledge Rating System as Validation Bait</b>", styles['DocBullet']))
    story.append(Paragraph(
        "The KR system offers intrinsic value beyond matchmaking. Users seek validation of their knowledge - a quantified confirmation that their skills matter. The KR system provides this validation through structured assessment and peer recognition. This transforms skill profiling from a functional necessity into a compelling user experience.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Marketing can position KR ratings as portable credentials that users can share on LinkedIn, include in resumes, or reference in interviews. The gamification element - earning higher ratings through demonstrated knowledge - creates engagement loops that encourage continued platform use. Users return to improve ratings, discover new learning opportunities, and deepen their investment in the platform.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The validation bait appeals particularly to competitive users and those seeking formal recognition of informal learning. It addresses a real pain point: the difficulty of proving competency outside traditional educational institutions. EduSparring becomes not just a learning platform but a credentialing authority in emerging skill areas.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("<b>3. Peer Matching as Social Bait</b>", styles['DocBullet']))
    story.append(Paragraph(
        "The matchmaking feature taps into fundamental human desires for connection and community. Positioned effectively, peer matching becomes a social experience rather than a purely educational one. Users seeking study partners, accountability partners, or intellectual peers find value beyond subject matter expertise.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "The 'peer Tinder' framing, while reductive, captures an important insight: matching mechanics create engagement through anticipation and discovery. Each potential match becomes a possibility, and successful matches create emotional investment. Users who find valuable learning partnerships become advocates, sharing their experiences and attracting similar users.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Social bait implementation requires emphasizing the human element in marketing. Testimonials from matched peers, success stories of learning partnerships, and community spotlights demonstrate that EduSparring facilitates real connections, not just algorithmic pairings.",
        styles['DocBody']
    ))
    
    # Secondary Baits
    story.append(Paragraph("Secondary Baits: Supporting Engagement", styles['SubsectionHeader']))
    
    story.append(Paragraph("<b>4. Sparring Sessions as Habit Bait</b>", styles['DocBullet']))
    story.append(Paragraph(
        "Once users enter the platform through primary baits, sparring sessions create habit loops. Regularly scheduled sessions build routine engagement, transforming occasional users into daily participants. The session format - structured learning exchanges with clear expectations - reduces cognitive load and increases follow-through.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Gamification elements within sessions, such as streaks, achievements, and progress tracking, reinforce habit formation. Users who establish learning routines through sparring sessions develop platform loyalty that transcends any single feature.",
        styles['DocBody']
    ))
    
    story.append(Paragraph("<b>5. Profile Building as Identity Bait</b>", styles['DocBullet']))
    story.append(Paragraph(
        "Profile creation represents an often-overlooked engagement opportunity. A well-designed profile system allows users to express their learning identity - their goals, interests, and achievements. This investment in digital identity creates switching costs; users who have built detailed profiles are less likely to abandon the platform.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Profile visibility features, such as public skill showcases and learning journey timelines, transform profiles from internal tools into external marketing assets. Users share their profiles, driving organic awareness and referral traffic.",
        styles['DocBody']
    ))
    
    # Baits Strategy Table
    story.append(Paragraph("Baits Strategy Summary", styles['SubsectionHeader']))
    
    baits_table = [
        [Paragraph('<b>Bait Type</b>', styles['TableHeader']),
         Paragraph('<b>Feature</b>', styles['TableHeader']),
         Paragraph('<b>Target User</b>', styles['TableHeader']),
         Paragraph('<b>Key Value</b>', styles['TableHeader'])],
        [Paragraph('Career', styles['TableCell']),
         Paragraph('Mock Jobs', styles['TableCell']),
         Paragraph('Job seekers', styles['TableCell']),
         Paragraph('Employer exposure', styles['TableCell'])],
        [Paragraph('Validation', styles['TableCell']),
         Paragraph('KR System', styles['TableCell']),
         Paragraph('Skill builders', styles['TableCell']),
         Paragraph('Portable credentials', styles['TableCell'])],
        [Paragraph('Social', styles['TableCell']),
         Paragraph('Peer Matching', styles['TableCell']),
         Paragraph('Community seekers', styles['TableCell']),
         Paragraph('Meaningful connections', styles['TableCell'])],
        [Paragraph('Habit', styles['TableCell']),
         Paragraph('Sparring Sessions', styles['TableCell']),
         Paragraph('Active learners', styles['TableCell']),
         Paragraph('Routine engagement', styles['TableCell'])],
        [Paragraph('Identity', styles['TableCell']),
         Paragraph('Profile Building', styles['TableCell']),
         Paragraph('All users', styles['TableCell']),
         Paragraph('Digital presence', styles['TableCell'])]
    ]
    
    baits_table_obj = Table(baits_table, colWidths=[80, 100, 100, 140])
    baits_table_obj.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.white),
        ('BACKGROUND', (0, 2), (-1, 2), BG_SURFACE),
        ('BACKGROUND', (0, 3), (-1, 3), colors.white),
        ('BACKGROUND', (0, 4), (-1, 4), BG_SURFACE),
        ('BACKGROUND', (0, 5), (-1, 5), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(Spacer(1, 12))
    story.append(baits_table_obj)
    story.append(Spacer(1, 12))
    
    # Implementation Roadmap
    story.append(Paragraph("Implementation Roadmap", styles['SubsectionHeader']))
    story.append(Paragraph(
        "The baits strategy requires phased implementation to avoid diluting message clarity. Phase one focuses on career bait activation through employer partnership development and Mock Job feature enhancement. This phase targets immediate user acquisition through the most compelling value proposition.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Phase two introduces validation bait optimization through KR system refinement and credential sharing features. Phase three activates social and habit baits through community features and gamification enhancement. This sequencing ensures each phase builds on previous success while maintaining clear user communication.",
        styles['DocBody']
    ))
    
    # Measuring Success
    story.append(Paragraph("Measuring Bait Effectiveness", styles['SubsectionHeader']))
    story.append(Paragraph(
        "Success metrics should track both acquisition and conversion. Key metrics include: users acquired per bait type, conversion rate from bait entry to multi-feature engagement, retention rates by entry point, and lifetime value by acquisition channel. These metrics enable continuous optimization of bait positioning and resource allocation.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "A/B testing different messaging and positioning for each bait reveals user preferences and guides marketing investment. The goal is not to identify a single best bait but to understand how different baits attract different user segments, enabling targeted acquisition strategies.",
        styles['DocBody']
    ))
    
    # Conclusion
    story.append(Paragraph("Conclusion: Integrated Growth", styles['SubsectionHeader']))
    story.append(Paragraph(
        "The baits strategy transforms EduSparring's features from passive functionality into active growth engines. By recognizing and amplifying the inherent attraction value of each feature, the platform can achieve organic growth that compounds over time. Users acquired through baits arrive with clear expectations and immediate value realization, creating higher engagement and retention than generic marketing approaches.",
        styles['DocBody']
    ))
    story.append(Paragraph(
        "Combined with the strong technical foundation demonstrated by the MVP and the clear investor narrative around monetization potential, the baits strategy positions EduSparring for sustainable growth. The platform moves beyond feature competition into value-based user attraction, where each feature serves dual purposes: functionality for existing users and marketing for prospective users.",
        styles['DocBody']
    ))
    
    # Build the document
    doc.build(story)
    print(f"Document generated successfully: {OUTPUT_PATH}")
    return OUTPUT_PATH

if __name__ == "__main__":
    output = build_document()
    print(f"\nPDF saved to: {output}")
