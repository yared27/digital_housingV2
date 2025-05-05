"use client" // Required if using interactivity

import { Card, CardContent } from "@/components/ui/card" // Correct import path
import { Home, DollarSign, Lock } from "lucide-react" // For better icons

const ValueProps = ()=> {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Home className="w-8 h-8 text-primary" />, 
              title: "Find Your Home", 
              desc: "5000+ verified listings" 
            },
            { 
              icon: <DollarSign className="w-8 h-8 text-primary" />, 
              title: "Best Prices", 
              desc: "No hidden fees guaranteed" 
            },
            { 
              icon: <Lock className="w-8 h-8 text-primary" />, 
              title: "Secure Process", 
              desc: "End-to-end encrypted" 
            }
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-all ">
              <CardContent className="p-6 flex flex-col items-start  gap-4">
                {item.icon}
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ValueProps