"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface FooterProps {
  showFullFooter?: boolean;
}

export default function Footer({ showFullFooter = true }: FooterProps) {
  if (!showFullFooter) {
    return (
      <footer className="border-t bg-background/80 backdrop-blur-xl py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>&copy; 2024 Agent Builder Enterprise v2. Tous droits réservés.</p>
          </motion.div>
        </div>
      </footer>
    );
  }

  const footerSections = [
    {
      title: "Produit",
      links: [
        { label: "Fonctionnalités", href: "/#features" },
        { label: "Prix", href: "/billing" },
        { label: "Documentation", href: "/docs" },
        { label: "API", href: "/api" }
      ]
    },
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Carrières", href: "/careers" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Confidentialité", href: "/privacy" },
        { label: "Conditions", href: "/terms" },
        { label: "Sécurité", href: "/security" },
        { label: "Licence MIT", href: "/license" }
      ]
    }
  ];

  const handleLinkClick = (href: string) => {
    // Pour les liens d'ancrage, faire défiler vers la section
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    
    // Pour les liens externes ou non implémentés, afficher un message
    if (href.startsWith("/docs") || href.startsWith("/api") || href.startsWith("/about") || 
        href.startsWith("/blog") || href.startsWith("/careers") || href.startsWith("/contact") ||
        href.startsWith("/privacy") || href.startsWith("/terms") || href.startsWith("/security") || 
        href.startsWith("/license")) {
      alert(`La page "${href}" est en cours de développement. Merci de votre patience !`);
      return;
    }
    
    // Pour les liens internes existants
    if (href === "/billing") {
      window.location.href = href;
    }
  };

  return (
    <footer className="border-t bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <span className="text-lg lg:text-xl font-bold leading-tight">Agent Builder</span>
                <span className="block text-sm lg:text-base text-muted-foreground">Enterprise v2</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transformez vos idées en produits complets avec la puissance de l'AI.
            </p>
          </motion.div>
          
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.7 + index * 0.1 }}
            >
              <h4 className="font-semibold mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer w-full text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
        >
          <p>&copy; 2024 Agent Builder Enterprise v2. Tous droits réservés.</p>
        </motion.div>
      </div>
    </footer>
  );
}