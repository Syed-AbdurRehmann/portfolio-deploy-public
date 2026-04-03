import { Download, FileText, FolderOpenDot } from "lucide-react";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resumeSummary = {
  name: "Syed Abdurrehman",
  role: "Video Editor & Motion Graphics Specialist",
  email: "syed4abdurrehman@gmail.com",
  location: "Pakistan",
  highlights: [
    "300+ completed projects across short-form and long-form formats",
    "Advanced workflow with After Effects, Premiere Pro, and AI-powered tools",
    "Fast turnaround and platform-optimized content delivery",
  ],
  tools: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Photoshop", "RunwayML", "Midjourney"],
};

const CV = () => {
  const handleGeneratedDownload = () => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    let y = 64;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(resumeSummary.name, 56, y);

    y += 26;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(resumeSummary.role, 56, y);

    y += 22;
    pdf.text(`Email: ${resumeSummary.email}`, 56, y);
    y += 18;
    pdf.text(`Location: ${resumeSummary.location}`, 56, y);

    y += 34;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Highlights", 56, y);

    y += 20;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    resumeSummary.highlights.forEach((item) => {
      const lines = pdf.splitTextToSize(`- ${item}`, 480);
      pdf.text(lines, 56, y);
      y += lines.length * 16;
    });

    y += 18;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Core Tools", 56, y);

    y += 20;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(resumeSummary.tools.join(", "), 56, y, { maxWidth: 480 });

    pdf.save("Syed-Abdurrehman-CV.pdf");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="container mx-auto max-w-5xl space-y-6">
        <Card className="border-primary/25 bg-card/60 backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl md:text-4xl font-display">
              Curriculum Vitae
            </CardTitle>
            <CardDescription className="text-base font-main">
              Share a clean professional profile and a ready-to-send PDF resume.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handleGeneratedDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download One-Page CV
            </Button>
            <a href="/resume.pdf" download>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Full Resume (PDF)
              </Button>
            </a>
            <Link to="/portfolio">
              <Button variant="outline">
                <FolderOpenDot className="h-4 w-4 mr-2" />
                Open Portfolio
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{resumeSummary.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{resumeSummary.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{resumeSummary.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">{resumeSummary.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Highlights</p>
                <ul className="space-y-2 list-disc pl-4">
                  {resumeSummary.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>
                Preview the same PDF version you share with clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <iframe
                title="CV PDF Preview"
                src="/resume.pdf#view=FitH"
                className="w-full h-[540px] rounded-md border border-border"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CV;
