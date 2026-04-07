from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register fonts
pdfmetrics.registerFont(TTFont('Times', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))

# Create the PDF
doc = SimpleDocTemplate(
    "/home/z/my-project/download/EduSparring_UI_Preview.pdf",
    pagesize=letter,
    title="EduSparring UI Preview",
    author="Z.ai",
    creator="Z.ai",
    subject="EduSparring Application Screenshots"
)

story = []
styles = getSampleStyleSheet()

# Title style
title_style = ParagraphStyle(
    name='TitleStyle',
    fontName='Times',
    fontSize=24,
    alignment=TA_CENTER,
    spaceAfter=20
)

heading_style = ParagraphStyle(
    name='HeadingStyle',
    fontName='Times',
    fontSize=16,
    alignment=TA_CENTER,
    spaceAfter=10
)

normal_style = ParagraphStyle(
    name='NormalStyle',
    fontName='Times',
    fontSize=11,
    alignment=TA_CENTER
)

# Cover page
story.append(Spacer(1, 2*inch))
story.append(Paragraph("EduSparring", title_style))
story.append(Paragraph("AI Competitive Learning Platform", heading_style))
story.append(Spacer(1, 0.5*inch))
story.append(Paragraph("UI Screenshots Preview", heading_style))
story.append(Spacer(1, 0.5*inch))
story.append(Paragraph("Features Completed:", normal_style))
story.append(Spacer(1, 0.2*inch))
features = [
    "- Sound Effects (Web Audio API)",
    "- Match History Page",
    "- Difficulty Levels (Easy/Medium/Hard)",
    "- 11 Subjects with 300+ Questions",
    "- Global Leaderboard",
    "- Player vs Bot & Player vs Player Modes"
]
for f in features:
    story.append(Paragraph(f, normal_style))
story.append(PageBreak())

# Page 1: Main Sparring Page
story.append(Paragraph("1. Main Sparring Page", heading_style))
story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("The main page shows two game modes: Play vs Bot and Play vs Player. Quick links to History, Social, and Leaderboard are at the bottom.", normal_style))
story.append(Spacer(1, 0.2*inch))
img = Image('/home/z/my-project/download/01-sparring-main.png', width=6*inch, height=3*inch)
story.append(img)
story.append(PageBreak())

# Page 2: Match History
story.append(Paragraph("2. Match History Page", heading_style))
story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("Shows wins, losses, win rate, and current streak. Filter by result or subject. Each match card shows opponent, subject, difficulty, duration, and XP earned.", normal_style))
story.append(Spacer(1, 0.2*inch))
img = Image('/home/z/my-project/download/02-sparring-history.png', width=6*inch, height=3*inch)
story.append(img)
story.append(PageBreak())

# Page 3: Leaderboard
story.append(Paragraph("3. Global Leaderboard", heading_style))
story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("Top 3 podium display with player rankings. Filter by country and search by name. Shows Knowledge Rating (KR), wins, and streaks.", normal_style))
story.append(Spacer(1, 0.2*inch))
img = Image('/home/z/my-project/download/03-leaderboard.png', width=6*inch, height=3*inch)
story.append(img)
story.append(PageBreak())

# Page 4: Subject Selection
story.append(Paragraph("4. Subject & Difficulty Selection", heading_style))
story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("Choose from 11 subjects: Math, Physics, Chemistry, Biology, History, Geography, Literature, Economics, Computer Science, Civics, English. Three difficulty levels: Easy (10pts), Medium (15pts), Hard (25pts).", normal_style))
story.append(Spacer(1, 0.2*inch))
img = Image('/home/z/my-project/download/04-subject-selection.png', width=6*inch, height=3*inch)
story.append(img)
story.append(PageBreak())

# Page 5: Game in Progress
story.append(Paragraph("5. Game Interface", heading_style))
story.append(Spacer(1, 0.2*inch))
story.append(Paragraph("Real-time scoring, round progress, and timer. Select from multiple choice answers. Sound effects play for correct/wrong answers.", normal_style))
story.append(Spacer(1, 0.2*inch))
img = Image('/home/z/my-project/download/05-game-in-progress.png', width=6*inch, height=3*inch)
story.append(img)

# Build PDF
doc.build(story)
print("PDF created successfully!")
