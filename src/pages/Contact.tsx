import { Phone, Mail, MessageCircle, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone",
      value: "+92 332 4112404",
      href: "tel:+923324112404",
      description: "Call me directly for urgent projects"
    },
    {
      icon: Mail,
      label: "Email",
      value: "syed4abdurrehman@gmail.com",
      href: "mailto:syed4abdurrehman@gmail.com",
      description: "Send detailed project requirements"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+92 332 4112404",
      href: "https://wa.me/923324112404",
      description: "Quick chat about your project"
    }
  ];

  const workingHours = [
    { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
    { day: "Saturday", time: "10:00 AM - 6:00 PM" },
    { day: "Sunday", time: "Available for urgent projects" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your next video project? Let's discuss how I can help bring your vision to life.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{method.label}</h3>
                <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                <a
                  href={method.href}
                  target={method.label === "WhatsApp" ? "_blank" : undefined}
                  rel={method.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                >
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:border-primary/50 group-hover:text-primary"
                  >
                    {method.value}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Working Hours */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">Working Hours</h2>
              </div>
              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <span className="text-foreground font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> I'm based in Pakistan (PKT timezone) but work with clients globally. 
                  I'm flexible with timing for international projects and urgent deadlines.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact Info */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Send className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">Let's Collaborate</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What I Need From You:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Project details and requirements</li>
                    <li>• Timeline and deadlines</li>
                    <li>• Budget range</li>
                    <li>• Reference videos or style preferences</li>
                    <li>• Raw footage or content to edit</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What You Can Expect:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Quick response within 24 hours</li>
                    <li>• Detailed project proposal</li>
                    <li>• Regular progress updates</li>
                    <li>• High-quality deliverables</li>
                    <li>• Revisions included</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Based in Pakistan, serving clients worldwide
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Don't hesitate to reach out! Whether you have a clear vision or just an idea, 
            I'm here to help you create compelling video content that stands out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/923324112404" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-5 h-5 mr-2" />
                Message on WhatsApp
              </Button>
            </a>
            <a href="mailto:syed4abdurrehman@gmail.com">
              <Button size="lg" variant="outline">
                <Mail className="w-5 h-5 mr-2" />
                Send an Email
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;