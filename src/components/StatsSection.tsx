import { Video, Users, Award, Zap } from "lucide-react";

const StatsSection = () => {
  const stats = [
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
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="relative p-6 rounded-2xl bg-card/10 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.number}
                  </div>
                  
                  <div className="text-primary font-semibold mb-2">
                    {stat.label}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;