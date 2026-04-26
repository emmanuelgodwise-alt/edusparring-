const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require("docx");
const fs = require("fs");

const P = {
  primary: "#1A2330",
  body: "#000000", 
  accent: "#D4875A"
};

const c = (hex) => hex.replace("#", "");

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, size: 32, color: c(P.accent), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 26, color: c(P.primary), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })]
  });
}

function bodyPara(text) {
  return new Paragraph({
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 22, font: { ascii: "Courier New", eastAsia: "Microsoft YaHei" } })]
  });
}

function normalPara(text) {
  return new Paragraph({
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 24, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }, size: 24 }
      }
    }
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "EDUSPARRING PROJECT CONTEXT PROMPT", bold: true, size: 36, color: c(P.accent), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [new TextRun({ text: "Copy and paste this at the start of any future AI session", size: 24, italics: true, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })]
      }),
      
      heading2("PROJECT OVERVIEW"),
      bodyPara("I need help with EduSparring, a gamified peer-learning platform. Here's the full context:"),
      bodyPara("EduSparring is a skill-based matchmaking platform for peer learning (like \"peer Tinder\"). Users create profiles with skill levels, get matched with peers for learning sessions (sparring), and can participate in Mock Job placements with employer partners. The platform is built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, and Supabase PostgreSQL."),
      
      heading2("DEPLOYMENT STATUS"),
      bodyPara("- GitHub: github.com/emmanuelgodwise-alt/edusparring"),
      bodyPara("- Database: Supabase PostgreSQL (production pooler available)"),
      bodyPara("- Hosting: Vercel (live MVP)"),
      bodyPara("- Status: MVP is LIVE and functional"),
      
      heading2("KEY FEATURES IMPLEMENTED"),
      bodyPara("1. User Authentication (Clerk)"),
      bodyPara("2. Profile Creation with Knowledge Rating (KR) system for skill levels"),
      bodyPara("3. Peer Matching Algorithm (matchQualityScore based on skill complementarity)"),
      bodyPara("4. Sparring Sessions (learning sessions between matched peers)"),
      bodyPara("5. Onboarding Flow (5 skips = bypass logic implemented)"),
      bodyPara("6. Mobile Responsive Design with hamburger menu"),
      bodyPara("7. Mock Job Placement feature (for employer partners)"),
      
      heading2("DATABASE SCHEMA"),
      bodyPara("- User model: includes onboardingSkipCount, skill ratings, profile data"),
      bodyPara("- Match model: tracks peer matches with quality scores"),
      bodyPara("- Session model: sparring sessions between matched users"),
      bodyPara("- MockJob model: mock job placements with employer partners"),
      
      heading2("BUSINESS CONTEXT & GROWTH STRATEGY"),
      bodyPara("The platform has several \"baits\" for user acquisition:"),
      bodyPara("- Knowledge Rating (KR) system - gamification element for engagement"),
      bodyPara("- Mock Job Placement - incentive for students (career opportunity bait)"),
      bodyPara("- Peer matching algorithm - social connection element"),
      bodyPara("The MVP evaluation positioned EduSparring as:"),
      bodyPara("- \"Smart not overbuilt\" - focused on core value proposition"),
      bodyPara("- Clear monetization potential through employer partnerships"),
      bodyPara("- Gamified learning with real-world outcomes"),
      bodyPara("- Strong investor narrative: peer learning meets career outcomes"),
      
      heading2("CURRENT NEEDS"),
      bodyPara("- API integrations for enhanced functionality"),
      bodyPara("- User testing and feedback collection"),
      bodyPara("- Potential feature expansions based on user behavior"),
      bodyPara("- Growth strategy execution using existing features as baits"),
      
      heading2("IMPORTANT NOTES"),
      bodyPara("- The user may refer to \"the Agent side\" for other project deployments (ChatLingo, Feedmeforward)"),
      bodyPara("- Project uses z-ai-web-dev-sdk for AI capabilities"),
      bodyPara("- All styling uses shadcn/ui components with Tailwind CSS"),
      bodyPara("- Mobile-first responsive design approach")
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/EduSparring_Project_Context_Prompt.docx", buffer);
  console.log("Context prompt document created!");
  console.log("File: /home/z/my-project/download/EduSparring_Project_Context_Prompt.docx");
});
