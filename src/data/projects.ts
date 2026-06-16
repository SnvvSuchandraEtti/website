
import hootImg from '@/assets/projects/hoot-edtech.jpg';
import aclubImg from '@/assets/projects/aclub-management.jpg';
import strackImg from '@/assets/projects/s-track.jpg';
import aiBgRmImg from '@/assets/projects/ai-bg-remover.jpg';
import viggieImg from '@/assets/projects/viggiemart.jpg';
import shopnestImg from '@/assets/projects/shopnest.jpg';
import leezImg from '@/assets/projects/leez.jpg';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  metrics?: string[];
  color?: string;
  category?: 'Flutter' | 'Web' | 'AI' | 'Backend';
}

export const projects: Project[] = [
  {
    id: "hoot-edtech",
    title: "HOOT 2.0 - EdTech Platform",
    description: "Comprehensive placement training and skill enhancement application serving 10,000+ global students.",
    longDescription: "Architected EdTech platform with RESTful APIs, increasing user engagement by 45% and supporting 10,000+ concurrent global users. Optimized application performance through state management implementation, API response caching, and responsive design patterns. Launched automated testing frameworks achieving 95% code coverage, reducing production defects by 30%.",
    technologies: ["Flutter", "Node.js", "Express", "Firebase", "REST APIs", "CI/CD"],
    imageUrl: hootImg,
    liveUrl: "https://play.google.com/store/apps/details?id=com.technicalhub.hoot&hl=en-US",
    featured: true,
    metrics: [
      "45% increase in user engagement",
      "10,000+ concurrent users supported",
      "95% code coverage",
      "30% reduction in production defects"
    ],
    color: "#6366F1",
    category: "Flutter"
  },
  {
    id: "aclub-management",
    title: "ACLUB - College Clubs Management",
    description: "Centralized platform for managing college clubs and events with responsive design.",
    longDescription: "Developed comprehensive mobile application with Firebase backend for college club management, increasing administrative workflow efficiency by 65% and event participation rates by 40% through Material Design UI/UX implementation and custom animations. Built real-time notifications with role-based authentication system, achieving 98% positive feedback and boosted student engagement.",
    technologies: ["Flutter", "Firebase", "Material Design", "Cloud Functions", "Authentication"],
    imageUrl: aclubImg,
    githubUrl: "https://github.com/SnvvSuchandraEtti/ACLUB",
    featured: true,
    metrics: [
      "65% improvement in administrative workflows",
      "40% increase in event participation",
      "98% positive user feedback",
      "Real-time notifications implemented"
    ],
    color: "#8B5CF6",
    category: "Flutter"
  },
  {
    id: "s-track",
    title: "S-TRACK - Profile Tracking System",
    description: "Robust system for tracking students and staff profiles with role-based access serving 18,000+ users.",
    longDescription: "Engineered an app with role-based authentication, reducing administrative overhead by 70% while serving 18,000+ users. Built features for educational materials downloads and session schedule monitoring, improving data accessibility and operational efficiency.",
    technologies: ["Flutter", "Firebase", "MySQL", "Role-based Auth", "JWT"],
    imageUrl: strackImg,
    featured: true,
    metrics: [
      "70% reduction in administrative overhead",
      "18,000+ active users",
      "Improved data accessibility",
      "Enhanced operational efficiency"
    ],
    color: "#F43F5E",
    category: "Flutter"
  },
  {
    id: "ai-bg-remover",
    title: "AI BG-RM - AI Background Remover",
    description: "AI-powered web application for automatic image background removal with 95% accuracy.",
    longDescription: "Built a web application with 95% accuracy in image processing, handling 1,000+ daily requests with 60% faster performance compared to traditional methods. Implemented deep learning models for precise image segmentation and background removal with minimal artifacts.",
    technologies: ["Python", "TensorFlow", "React", "Flask", "Computer Vision", "Deep Learning"],
    imageUrl: aiBgRmImg,
    featured: false,
    metrics: [
      "95% accuracy in image processing",
      "1,000+ daily requests processed",
      "60% faster performance",
      "Minimal artifacts in processed images"
    ],
    color: "#EC4899",
    category: "AI"
  },
  {
    id: "viggiemart-marketplace",
    title: "VIGGIEMART - Direct Farmer-Buyer App",
    description: "Farmer-to-buyer marketplace enabling real-time bidding for fair pricing on vegetables and rice. (SIH Project)",
    longDescription: "Engineered a farmer-to-buyer marketplace app during Smart India Hackathon (SIH), enabling real-time bidding for fair pricing on vegetables and rice. The platform connects farmers directly with buyers, eliminating middlemen and ensuring fair pricing through transparent bidding mechanisms.",
    technologies: ["React Native", "Node.js", "MongoDB", "Real-time Bidding", "Payment Gateway"],
    imageUrl: viggieImg,
    featured: false,
    metrics: [
      "Real-time bidding system",
      "Direct farmer-buyer connection",
      "Fair pricing mechanisms",
      "SIH project completion"
    ],
    color: "#10B981",
    category: "Backend"
  },
  {
    id: "shopnest-ecommerce",
    title: "ShopNest - E-Commerce Application",
    description: "Full-featured e-commerce platform with secure payment integration and intuitive shopping experience.",
    longDescription: "Developed a comprehensive e-commerce platform during Flutter internship with Firebase authentication, delivering 40% performance optimization through state management. Features include product catalog, cart management, secure checkout, and order tracking.",
    technologies: ["Flutter", "Firebase", "Payment APIs", "State Management", "Cloud Functions"],
    imageUrl: shopnestImg,
    githubUrl: "https://github.com/SnvvSuchandraEtti/ShopNest",
    featured: true,
    metrics: [
      "40% performance optimization",
      "Secure payment integration",
      "Real-time inventory management",
      "Order tracking system"
    ],
    color: "#F59E0B",
    category: "Flutter"
  },
  {
    id: "leez-marketplace",
    title: "Leez - P2P Rental Marketplace",
    description: "Innovative peer-to-peer marketplace revolutionizing on-demand rentals for local communities. (Startup)",
    longDescription: "Currently developing an innovative solution peer-to-peer marketplace revolutionizing on-demand rentals for local communities. The platform features secure payment processing, user verification, geolocation-based search, and an intuitive user interface for seamless product listings and rentals.",
    technologies: ["React Native", "Node.js", "MongoDB", "AWS", "Payment APIs", "Geolocation"],
    imageUrl: leezImg,
    featured: false,
    metrics: [
      "Under active development",
      "Secure payment processing",
      "User verification system",
      "Geolocation-based search"
    ],
    color: "#10B981",
    category: "Web"
  }
];
