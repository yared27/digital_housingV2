import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 5,000+ happy renters who found their perfect match with us
          </p>
          
          <div className="flex flex-col sm:flex-row  gap-4 justify-center">
            <Link to= "/signup"
              className="gap-2 rounded-full size-bg font-semibold"
            >
              Get started
            </Link>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 bg-transparent hover:bg-white/10"
            >
              Contact us
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-foreground/80" />
              <span>Bole, Addis Ababa</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-foreground/80" />
              <span>+251 912 345 678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-foreground/80" />
              <span>hello@digitalhousing.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction