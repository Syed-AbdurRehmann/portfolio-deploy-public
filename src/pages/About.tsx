import { Award, Users, Video, Zap } from "lucide-react";

const About = () => {
  const achievements = [
    {
      icon: Video,
      number: "200+",
      label: "Videos Edited",
      description: "Across multiple platforms and niches"
    },
    {
      icon: Users,
      number: "3+",
      label: "Years Experience",
      description: "Working with local and international clients"
    },
    {
      icon: Award,
      number: "10k+",
      label: "Subscribers Managed",
      description: "Across 3 client channels"
    },
    {
      icon: Zap,
      number: "AI-Powered",
      label: "Workflows",
      description: "Cutting-edge tools and techniques"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Me
          </h1>
          <p className="text-xl text-muted-foreground">
            Passionate video editor transforming ideas into engaging visual stories
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">My Journey</h2>
            <div className="prose prose-lg text-muted-foreground max-w-none">
              <p className="mb-4">
                I'm Syed Abdurrehman, a highly versatile Video Editor & Content Creator with over 3 years 
                of experience delivering creative and engaging videos across multiple niches. My passion 
                for storytelling through video has led me to work with clients ranging from local 
                businesses to international agencies.
              </p>
              <p className="mb-4">
                Specializing in both short-form content (reels, TikToks, YouTube Shorts) and long-form 
                videos (corporate, personal branding, storytelling), I bring a unique blend of technical 
                expertise and creative vision to every project. My experience managing 3 client channels 
                with over 10k+ subscribers has given me deep insights into audience engagement and 
                platform optimization.
              </p>
              <p>
                I'm constantly evolving with the industry, incorporating cutting-edge AI tools and 
                workflows to deliver faster results without compromising quality. Whether it's advanced 
                motion graphics, complex VFX, or AI-enhanced content, I'm equipped to bring your vision to life.
              </p>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border text-center hover:border-primary/50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <achievement.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{achievement.number}</div>
                <div className="text-primary font-medium mb-2">{achievement.label}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
            ))}
          </div>

          {/* Skills & Education */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Core Expertise */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Core Expertise</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Editing & Post Production</h4>
                  <p className="text-muted-foreground text-sm">
                    Rotoscoping, Motion Tracking, 3D Camera, VFX, Shape Morphing, Speed Ramping, 
                    Puppet Tool, Compositing, Graph Editing
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Color & Visuals</h4>
                  <p className="text-muted-foreground text-sm">
                    Color Grading, Color Correction, S-Log & RAW Footage Handling
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">AI Tools & Enhancement</h4>
                  <p className="text-muted-foreground text-sm">
                    RunwayML, Haliuo AI, Kling AI, PixVerse, MidJourney, Topaz Video AI, 
                    Google Veo 3, ChatGPT, Gemini
                  </p>
                </div>
              </div>
            </div>

            {/* Education & Background */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Education & Background</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Intermediate (ICS)</h4>
                  <p className="text-muted-foreground text-sm">2024–2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Matriculation</h4>
                  <p className="text-muted-foreground text-sm">2022–2023</p>
                </div>
                <div className="pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Professional Experience</h4>
                  <p className="text-muted-foreground text-sm">
                    Since 2022, I've been working as a freelance video editor, constantly learning 
                    and adapting to new technologies and client needs. My self-taught expertise 
                    combined with formal education provides a unique perspective on creative problem-solving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Bring Your Vision to Life?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's collaborate to create compelling video content that engages your audience and 
              achieves your goals. Whether you need quick social media edits or complex cinematic 
              productions, I'm here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;