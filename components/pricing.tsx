"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: "Basic",
      description: "For small projects and individuals",
      price: annual ? 1900 : 199,
      features: ["Minimalist design", "Responsive layout", "Basic animations", "1 revision round", "14-day delivery"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Standard",
      description: "For growing businesses and brands",
      price: annual ? 3900 : 399,
      features: [
        "Everything in Basic",
        "Custom brutalist design",
        "Advanced animations",
        "3 revision rounds",
        "Content strategy",
        "7-day delivery",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Premium",
      description: "For established companies and enterprises",
      price: annual ? 7900 : 799,
      features: [
        "Everything in Standard",
        "Comprehensive design system",
        "Custom functionality",
        "Unlimited revisions",
        "SEO optimization",
        "Priority support",
        "5-day delivery",
      ],
      cta: "Contact Us",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-white/40"></div>
            <div className="text-xs uppercase tracking-widest text-white/80">Pricing</div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Simple Pricing
            <br />
            <span className="text-white/70">No Hidden Fees</span>
          </h2>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="border-2 border-white/20 p-1 inline-flex rounded-sm backdrop-blur-sm bg-white/5">
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 text-sm transition-all duration-300 ${
                annual ? "bg-white text-black font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Annual <span className="text-xs opacity-80">(Save 20%)</span>
            </button>
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 text-sm transition-all duration-300 ${
                !annual ? "bg-white text-black font-medium" : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`border-2 ${
                plan.popular ? "border-white" : "border-white/20"
              } p-8 relative bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-white text-black text-xs uppercase tracking-widest py-1 px-3 -mt-3 -mr-3 font-medium">
                  Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
              <p className="text-white/70 mb-6">{plan.description}</p>
              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-white/70 ml-2">{annual ? "/year" : "/month"}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start group">
                    <Check className="w-5 h-5 mr-2 text-white/60 group-hover:text-white flex-shrink-0 mt-0.5 transition-colors duration-300" />
                    <span className="text-white/80 group-hover:text-white transition-colors duration-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 text-sm uppercase tracking-widest transition-all duration-300 ${
                  plan.popular 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "border-2 border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </button>
              
              {/* Add subtle highlight for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 border-b-2 border-white opacity-20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-40 left-10 w-32 h-32 border border-white/10"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-white/5"></div>
    </section>
  )
}
