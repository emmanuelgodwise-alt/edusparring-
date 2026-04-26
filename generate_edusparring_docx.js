const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, PageNumber, AlignmentType, HeadingLevel, BorderStyle, 
        WidthType, ShadingType, PageBreak } = require("docx");
const fs = require("fs");

// ━━ Color Palette (GO-1 Graphite Orange for business proposal) ━━
const P = {
  primary: "#1A2330",
  body: "#000000", 
  secondary: "#506070",
  accent: "#D4875A",
  surface: "#F8F0EB",
  titleColor: "FFFFFF",
  subtitleColor: "B0B8C0"
};

const c = (hex) => hex.replace("#", "");

// Helper functions
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ 
      text, 
      bold: true, 
      size: 32, 
      color: c(P.accent),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ 
      text, 
      bold: true, 
      size: 26, 
      color: c(P.primary),
      font: { ascii: "Times New Roman", eastAsia: "SimHei" }
    })]
  });
}

function bodyPara(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ 
      text, 
      size: 24, 
      color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
    })]
  });
}

function bulletPara(text) {
  return new Paragraph({
    spacing: { line: 312, after: 80 },
    indent: { left: 360 },
    children: [new TextRun({ 
      text: "• " + text, 
      size: 24, 
      color: c(P.body),
      font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
    })]
  });
}

// Create document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" },
          size: 24,
          color: c(P.body)
        },
        paragraph: {
          spacing: { line: 312 }
        }
      }
    }
  },
  sections: [
    // ── COVER PAGE ──
    {
      properties: {
        page: {
          margin: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      },
      children: [
        new Paragraph({ spacing: { before: 3000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ 
            text: "EDUSPARRING", 
            bold: true, 
            size: 72, 
            color: c(P.titleColor),
            font: { ascii: "Times New Roman", eastAsia: "SimHei" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ 
            text: "Comprehensive Investor Narrative", 
            size: 36, 
            color: c(P.subtitleColor),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ 
            text: "&", 
            size: 28, 
            color: c(P.subtitleColor),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ 
            text: "Growth Strategy Using Feature Baits", 
            size: 36, 
            color: c(P.subtitleColor),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 800, after: 200 },
          children: [new TextRun({ 
            text: "A Gamified Peer-Learning Platform", 
            size: 28, 
            color: c(P.accent),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ 
            text: "with Clear Monetization Potential", 
            size: 28, 
            color: c(P.accent),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200 },
          children: [new TextRun({ 
            text: "MVP Live on Vercel | April 2026", 
            size: 22, 
            color: c(P.secondary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        })
      ]
    },
    // ── BODY CONTENT ──
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ 
              text: "EduSparring Business Document", 
              size: 18, 
              color: c(P.secondary),
              font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
            })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ 
              children: [PageNumber.CURRENT], 
              size: 20,
              font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
            })]
          })]
        })
      },
      children: [
        // ═══════════════════════════════════════════════════════════════════
        // PART 1: INVESTOR NARRATIVE
        // ═══════════════════════════════════════════════════════════════════
        heading1("PART ONE: COMPREHENSIVE INVESTOR NARRATIVE"),
        
        heading2("Executive Summary"),
        bodyPara("EduSparring represents a fresh approach to peer learning in the educational technology space. By combining skill-based matchmaking with gamification elements and real-world career outcomes, the platform addresses a fundamental challenge in education: connecting learners with complementary knowledge for mutual growth. The MVP is now live, demonstrating technical execution capability and providing a foundation for user validation and market testing."),
        bodyPara("The platform differentiates itself through a sophisticated Knowledge Rating (KR) system that quantifies skill levels across multiple dimensions, enabling intelligent peer matching that goes beyond simple subject categorization. This creates a 'peer Tinder' experience where meaningful learning connections replace superficial swipes, and each match carries potential for genuine knowledge exchange."),
        
        heading2("The Problem We Solve"),
        bodyPara("Traditional education systems suffer from a one-to-many bottleneck: a single instructor attempting to address the diverse needs of many students. Peer learning offers a solution, but existing platforms lack systematic approaches to match learners effectively. Students struggle to find peers with complementary skill levels, leading to unproductive study sessions or abandoned learning partnerships."),
        bodyPara("Furthermore, the disconnect between academic learning and career outcomes leaves students questioning the practical value of their educational investments. The job market demands demonstrable skills, yet most learning platforms focus on content consumption rather than skill application and validation. This gap represents a significant opportunity for platforms that bridge learning and career advancement."),
        
        heading2("Our Solution: The EduSparring Platform"),
        bodyPara("EduSparring transforms peer learning through three integrated pillars that work together to create a comprehensive learning ecosystem:"),
        
        bulletPara("Knowledge Rating (KR) System - The KR system quantifies skill levels across multiple dimensions, creating a detailed skill profile for each user. Unlike simple beginner-intermediate-advanced labels, the KR system captures nuance in competency, allowing for precise matching. Users rate their own abilities and receive ratings from peers, creating a self-correcting reputation system that builds trust and accountability."),
        bulletPara("Intelligent Match Quality Score - The matching algorithm calculates a match quality score based on skill complementarity. Rather than matching identical skill levels, EduSparring identifies pairs where one user's strengths align with another's growth areas. This creates optimal learning dyads where both participants gain value, transforming each match into a potential growth opportunity."),
        bulletPara("Mock Job Placement Feature - The Mock Job placement system connects learning outcomes with career preparation. Employer partners post simulated job assignments that allow students to demonstrate real-world skills in a low-stakes environment. This creates a direct pipeline from learning to employment, addressing the employability gap that plagues traditional education."),
        
        heading2("Market Opportunity"),
        bodyPara("The global e-learning market exceeded $300 billion in 2024 and continues to grow as remote learning becomes normalized. Within this market, peer learning represents a rapidly expanding segment as students seek alternatives to expensive tutoring and impersonal MOOCs. The career preparation market adds another dimension, with job seekers actively seeking ways to demonstrate practical skills to employers."),
        bodyPara("EduSparring positions itself at the intersection of these markets: peer learning for skill acquisition, and career preparation for skill validation. This dual positioning creates multiple revenue streams and user acquisition channels, reducing platform risk and increasing total addressable market."),
        
        heading2("Competitive Advantage"),
        bodyPara("Unlike traditional tutoring platforms that charge premium fees for expert instruction, EduSparring leverages peer-to-peer exchanges that scale efficiently. Unlike MOOCs that suffer from low completion rates, EduSparring creates accountability through matched partnerships. Unlike generic networking platforms, EduSparring focuses specifically on learning outcomes with measurable skill progression."),
        bodyPara("The platform's technical foundation demonstrates production-ready capability. Built with Next.js 14, TypeScript, and Supabase PostgreSQL, the MVP showcases modern development practices and scalable architecture. Mobile-first responsive design ensures accessibility across devices, addressing the mobile learning trend that dominates student preferences."),
        
        heading2("Monetization Strategy"),
        bodyPara("EduSparring's monetization strategy leverages multiple revenue streams designed to align platform incentives with user success:"),
        
        // Revenue Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Revenue Stream", bold: true, size: 22, color: "FFFFFF" })] 
                  })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 }
                }),
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Description", bold: true, size: 22, color: "FFFFFF" })] 
                  })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 }
                }),
                new TableCell({
                  children: [new Paragraph({ 
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Timeline", bold: true, size: 22, color: "FFFFFF" })] 
                  })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Employer Partnerships", size: 22 })] })], margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Companies pay to post Mock Jobs and access talent pipeline", size: 22 })] })], margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Phase 2", size: 22 })] })], margins: { top: 60, bottom: 60, left: 120, right: 120 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Premium Matching", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Enhanced matching algorithms and priority pairing for subscribers", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Phase 2", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 120, right: 120 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Certification Fees", size: 22 })] })], margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Verified skill certifications based on peer assessments", size: 22 })] })], margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Phase 3", size: 22 })] })], margins: { top: 60, bottom: 60, left: 120, right: 120 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Enterprise Learning", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Corporate training programs using peer learning methodology", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 120, right: 120 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Phase 3", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 120, right: 120 } })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { before: 200, after: 200 } }),
        
        heading2("Technical Excellence"),
        bodyPara("The MVP demonstrates production-ready technical capability with a modern, maintainable architecture. The technology stack reflects industry best practices and positions the platform for rapid iteration and scaling:"),
        
        bulletPara("Next.js 14.2.35 with App Router for optimal performance and SEO"),
        bulletPara("TypeScript for type safety and developer productivity"),
        bulletPara("Tailwind CSS + shadcn/ui for consistent, accessible design"),
        bulletPara("Prisma ORM with Supabase PostgreSQL for reliable data management"),
        bulletPara("Vercel deployment for global CDN and serverless scalability"),
        bulletPara("Mobile-first responsive design ensuring accessibility across all devices"),
        
        heading2("MVP Evaluation: Smart Not Overbuilt"),
        bodyPara("The EduSparring MVP represents a focused execution of core value propositions without feature creep. Key features implemented include user authentication, profile creation with Knowledge Rating system, peer matching algorithm, sparring session management, onboarding flow with skip logic, and mobile responsive design with hamburger navigation. This focused approach demonstrates product discipline and creates a foundation for iterative enhancement based on user feedback."),
        bodyPara("The platform's evaluation can be summarized as 'smart not overbuilt' - a compliment in product development. Rather than attempting to solve every problem, EduSparring focuses on doing one thing exceptionally well: connecting peers for meaningful learning exchanges. This focus allows for deeper refinement of core features and clearer measurement of user success metrics."),
        
        heading2("The Ask"),
        bodyPara("EduSparring seeks strategic investment to accelerate user acquisition, deepen employer partnerships, and expand the platform's feature set based on validated user needs. The MVP demonstrates technical capability; the next phase requires resources to validate market fit and establish sustainable growth channels. Investors gain access to a differentiated educational platform with clear monetization potential and a team committed to measurable outcomes."),
        
        // Page break before Part 2
        new Paragraph({ children: [new PageBreak()] }),
        
        // ═══════════════════════════════════════════════════════════════════
        // PART 2: GROWTH STRATEGY - FEATURES AS BAITS
        // ═══════════════════════════════════════════════════════════════════
        heading1("PART TWO: GROWTH STRATEGY"),
        new Paragraph({
          spacing: { before: 120, after: 240 },
          children: [new TextRun({ 
            text: "Using Features as Baits for User Acquisition", 
            size: 26, 
            italics: true,
            color: c(P.secondary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        
        heading2("The Baits Strategy Framework"),
        bodyPara("In competitive markets, user acquisition often determines platform success or failure. EduSparring's existing features can be strategically positioned as 'baits' - compelling entry points that attract users who might not initially seek a peer learning platform. This approach transforms each feature into a marketing channel, leveraging product value for organic growth."),
        bodyPara("The baits strategy works because it reframes the user journey. Instead of asking users to adopt an entirely new learning paradigm, each bait offers immediate standalone value. Once users experience this value, the broader platform ecosystem becomes a natural extension of their engagement. This creates a low-friction entry path with high conversion potential."),
        
        heading2("Primary Baits: High-Value Entry Points"),
        
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ 
            text: "1. Mock Job Placement as Career Bait", 
            bold: true, 
            size: 24,
            color: c(P.primary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        bodyPara("The Mock Job placement feature represents the most powerful bait in EduSparring's arsenal. Students actively seeking career opportunities represent a massive, motivated user base. By positioning Mock Jobs as a standalone career preparation tool, EduSparring can attract users who may not initially be interested in peer learning but desperately want to demonstrate their skills to potential employers."),
        bodyPara("The conversion pathway is clear: users join to complete Mock Jobs, discover peer matching during the process, and gradually engage with the broader learning ecosystem. Employers benefit from a pre-vetted talent pipeline, creating a virtuous cycle where employer participation attracts more students, and student participation attracts more employers."),
        bodyPara("Implementation requires targeted outreach to career services departments, job fairs, and professional networking platforms. Messaging should emphasize practical outcomes: 'Complete real assignments from actual employers' and 'Build a portfolio that gets noticed.' The career bait addresses the fundamental question every student asks: 'How will this help me get a job?'"),
        
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ 
            text: "2. Knowledge Rating System as Validation Bait", 
            bold: true, 
            size: 24,
            color: c(P.primary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        bodyPara("The KR system offers intrinsic value beyond matchmaking. Users seek validation of their knowledge - a quantified confirmation that their skills matter. The KR system provides this validation through structured assessment and peer recognition. This transforms skill profiling from a functional necessity into a compelling user experience."),
        bodyPara("Marketing can position KR ratings as portable credentials that users can share on LinkedIn, include in resumes, or reference in interviews. The gamification element - earning higher ratings through demonstrated knowledge - creates engagement loops that encourage continued platform use. Users return to improve ratings, discover new learning opportunities, and deepen their investment in the platform."),
        bodyPara("The validation bait appeals particularly to competitive users and those seeking formal recognition of informal learning. It addresses a real pain point: the difficulty of proving competency outside traditional educational institutions. EduSparring becomes not just a learning platform but a credentialing authority in emerging skill areas."),
        
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ 
            text: "3. Peer Matching as Social Bait", 
            bold: true, 
            size: 24,
            color: c(P.primary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        bodyPara("The matchmaking feature taps into fundamental human desires for connection and community. Positioned effectively, peer matching becomes a social experience rather than a purely educational one. Users seeking study partners, accountability partners, or intellectual peers find value beyond subject matter expertise."),
        bodyPara("The 'peer Tinder' framing, while reductive, captures an important insight: matching mechanics create engagement through anticipation and discovery. Each potential match becomes a possibility, and successful matches create emotional investment. Users who find valuable learning partnerships become advocates, sharing their experiences and attracting similar users."),
        bodyPara("Social bait implementation requires emphasizing the human element in marketing. Testimonials from matched peers, success stories of learning partnerships, and community spotlights demonstrate that EduSparring facilitates real connections, not just algorithmic pairings."),
        
        heading2("Secondary Baits: Supporting Engagement"),
        
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ 
            text: "4. Sparring Sessions as Habit Bait", 
            bold: true, 
            size: 24,
            color: c(P.primary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        bodyPara("Once users enter the platform through primary baits, sparring sessions create habit loops. Regularly scheduled sessions build routine engagement, transforming occasional users into daily participants. The session format - structured learning exchanges with clear expectations - reduces cognitive load and increases follow-through."),
        bodyPara("Gamification elements within sessions, such as streaks, achievements, and progress tracking, reinforce habit formation. Users who establish learning routines through sparring sessions develop platform loyalty that transcends any single feature."),
        
        new Paragraph({
          spacing: { before: 200, after: 120 },
          children: [new TextRun({ 
            text: "5. Profile Building as Identity Bait", 
            bold: true, 
            size: 24,
            color: c(P.primary),
            font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }
          })]
        }),
        bodyPara("Profile creation represents an often-overlooked engagement opportunity. A well-designed profile system allows users to express their learning identity - their goals, interests, and achievements. This investment in digital identity creates switching costs; users who have built detailed profiles are less likely to abandon the platform."),
        bodyPara("Profile visibility features, such as public skill showcases and learning journey timelines, transform profiles from internal tools into external marketing assets. Users share their profiles, driving organic awareness and referral traffic."),
        
        heading2("Baits Strategy Summary"),
        
        // Baits Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Bait Type", bold: true, size: 22, color: "FFFFFF" })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Feature", bold: true, size: 22, color: "FFFFFF" })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Target User", bold: true, size: 22, color: "FFFFFF" })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 }
                }),
                new TableCell({
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Key Value", bold: true, size: 22, color: "FFFFFF" })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.accent) },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Career", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Mock Jobs", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Job seekers", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Employer exposure", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Validation", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "KR System", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Skill builders", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Portable credentials", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Social", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Peer Matching", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Community seekers", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Meaningful connections", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Habit", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Sparring Sessions", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Active learners", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Routine engagement", size: 22 })] })], shading: { type: ShadingType.CLEAR, fill: c(P.surface) }, margins: { top: 60, bottom: 60, left: 100, right: 100 } })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Identity", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Profile Building", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "All users", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Digital presence", size: 22 })] })], margins: { top: 60, bottom: 60, left: 100, right: 100 } })
              ]
            })
          ]
        }),
        
        new Paragraph({ spacing: { before: 200, after: 200 } }),
        
        heading2("Implementation Roadmap"),
        bodyPara("The baits strategy requires phased implementation to avoid diluting message clarity. Phase one focuses on career bait activation through employer partnership development and Mock Job feature enhancement. This phase targets immediate user acquisition through the most compelling value proposition."),
        bodyPara("Phase two introduces validation bait optimization through KR system refinement and credential sharing features. Phase three activates social and habit baits through community features and gamification enhancement. This sequencing ensures each phase builds on previous success while maintaining clear user communication."),
        
        heading2("Measuring Bait Effectiveness"),
        bodyPara("Success metrics should track both acquisition and conversion. Key metrics include: users acquired per bait type, conversion rate from bait entry to multi-feature engagement, retention rates by entry point, and lifetime value by acquisition channel. These metrics enable continuous optimization of bait positioning and resource allocation."),
        bodyPara("A/B testing different messaging and positioning for each bait reveals user preferences and guides marketing investment. The goal is not to identify a single best bait but to understand how different baits attract different user segments, enabling targeted acquisition strategies."),
        
        heading2("Conclusion: Integrated Growth"),
        bodyPara("The baits strategy transforms EduSparring's features from passive functionality into active growth engines. By recognizing and amplifying the inherent attraction value of each feature, the platform can achieve organic growth that compounds over time. Users acquired through baits arrive with clear expectations and immediate value realization, creating higher engagement and retention than generic marketing approaches."),
        bodyPara("Combined with the strong technical foundation demonstrated by the MVP and the clear investor narrative around monetization potential, the baits strategy positions EduSparring for sustainable growth. The platform moves beyond feature competition into value-based user attraction, where each feature serves dual purposes: functionality for existing users and marketing for prospective users.")
      ]
    }
  ]
});

// Generate document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/EduSparring_Investor_Narrative_and_Growth_Strategy.docx", buffer);
  console.log("Document created successfully!");
  console.log("File: /home/z/my-project/download/EduSparring_Investor_Narrative_and_Growth_Strategy.docx");
});
