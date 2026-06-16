
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'technical' | 'participation';
  description: string;
  pdfUrl?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
  /** Fallback hint for PDF orientation when auto-detect fails */
  orientation?: 'portrait' | 'landscape';
  // Deprecated — kept for back-compat
  imageUrl?: string;
  pdfFilename?: string;
  thumbnailFilename?: string;
}

import postmanPdf from '@/assets/certificates/postman-api-student-expert.pdf.asset.json';
import awsPdf from '@/assets/certificates/aws-cloud-practitioner.pdf.asset.json';
import ccnaPdf from '@/assets/certificates/ccna-v7-itn.pdf.asset.json';
import cloudComputingPdf from '@/assets/certificates/cloud-computing-nptel.pdf.asset.json';
import pearsonJavaPdf from '@/assets/certificates/it-pearson-java.pdf.asset.json';
import privacySecurityPdf from '@/assets/certificates/nptel-privacy-security.pdf.asset.json';
import debateKlPdf from '@/assets/certificates/debate-kl.pdf.asset.json';
import ettiMarvadiPdf from '@/assets/certificates/etti-marvadi-quiz.pdf.asset.json';
import gfgSummerPdf from '@/assets/certificates/gfg-summer-training.pdf.asset.json';
import jntuvCodeWars3Pdf from '@/assets/certificates/jntuv-code-wars-3.pdf.asset.json';
import naukriCampusPdf from '@/assets/certificates/naukri-campus.pdf.asset.json';
import paperSimatsPdf from '@/assets/certificates/paper-presentation-simats.pdf.asset.json';
import techTalkPdf from '@/assets/certificates/tech-talk.pdf.asset.json';
import youngTurksR1Pdf from '@/assets/certificates/young-turks-r1.pdf.asset.json';

export const certificates: Certificate[] = [
  // Technical
  {
    id: 'tech-privacy-security',
    title: 'Privacy and Security in Online Social Media',
    issuer: 'NPTEL - IIT',
    date: 'December 2023',
    category: 'technical',
    description: 'Comprehensive course on privacy and security aspects of online social media platforms.',
    pdfUrl: privacySecurityPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Privacy', 'Security', 'Social Media'],
  },
  {
    id: 'tech-postman',
    title: 'Postman API Fundamentals Student Expert',
    issuer: 'Postman',
    date: 'December 2022',
    category: 'technical',
    description: 'Student Expert certification in API testing and documentation using Postman.',
    pdfUrl: postmanPdf.url,
    orientation: 'landscape',
    credentialUrl: '#',
    skills: ['API Testing', 'Postman', 'API Documentation'],
  },
  {
    id: 'tech-ccna',
    title: 'CCNA v7: Introduction to Networks',
    issuer: 'Cisco',
    date: 'October 2022',
    category: 'technical',
    description: 'Cisco Certified Network Associate — Introduction to Networks.',
    pdfUrl: ccnaPdf.url,
    orientation: 'landscape',
    credentialUrl: '#',
    skills: ['Networking', 'Cisco', 'Network Administration'],
  },
  {
    id: 'tech-pearson-java',
    title: 'IT Pearson Java',
    issuer: 'Pearson',
    date: 'August 2022',
    category: 'technical',
    description: 'Java programming certification from Pearson IT Academy.',
    pdfUrl: pearsonJavaPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Java', 'Programming', 'OOP'],
  },
  {
    id: 'tech-cloud-computing',
    title: 'Cloud Computing',
    issuer: 'NPTEL - IIT',
    date: 'June 2022',
    category: 'technical',
    description: 'Comprehensive course on cloud computing concepts and technologies.',
    pdfUrl: cloudComputingPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Cloud Computing', 'AWS', 'Distributed Systems'],
  },
  {
    id: 'tech-aws-ccp',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'May 2026',
    category: 'technical',
    description: 'Foundational AWS certification covering core services, security, architecture, pricing, and cloud value proposition.',
    pdfUrl: awsPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['AWS', 'Cloud', 'Security', 'Architecture'],
  },

  // Participation
  {
    id: 'part-jntuv-code-wars-3',
    title: 'JNTUV Code Wars 3.0',
    issuer: 'JNTUV',
    date: 'November 2023',
    category: 'participation',
    description: 'University level coding competition and programming contest.',
    pdfUrl: jntuvCodeWars3Pdf.url,
    orientation: 'landscape',
    credentialUrl: '#',
    skills: ['Competitive Coding', 'Programming Contest'],
  },
  {
    id: 'part-debate-kl',
    title: 'Debate Competition',
    issuer: 'KL University',
    date: '2024',
    category: 'participation',
    description: 'Participation in inter-college debate competition hosted by KL University.',
    pdfUrl: debateKlPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Public Speaking', 'Debate', 'Critical Thinking'],
  },
  {
    id: 'part-etti-marvadi',
    title: 'University Quiz',
    issuer: 'Etti Marvadi University',
    date: '2024',
    category: 'participation',
    description: 'Participation in a university-level quiz competition.',
    pdfUrl: ettiMarvadiPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Quiz', 'General Knowledge'],
  },
  {
    id: 'part-paper-simats',
    title: 'Paper Presentation',
    issuer: 'SIMATS',
    date: '2024',
    category: 'participation',
    description: 'Presented a technical research paper at SIMATS paper presentation event.',
    pdfUrl: paperSimatsPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Research', 'Presentation', 'Technical Writing'],
  },
  {
    id: 'part-gfg-summer',
    title: 'Summer Training Program',
    issuer: 'GeeksforGeeks',
    date: '2024',
    category: 'participation',
    description: 'Completed GeeksforGeeks summer training program covering DSA and problem solving.',
    pdfUrl: gfgSummerPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['DSA', 'Problem Solving', 'Programming'],
  },
  {
    id: 'part-tech-talk',
    title: 'Tech Talk',
    issuer: 'Technical Hub',
    date: '2024',
    category: 'participation',
    description: 'Participation in a tech talk session on emerging technologies.',
    pdfUrl: techTalkPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Emerging Tech', 'Communication'],
  },
  {
    id: 'part-young-turks',
    title: 'Young Turks — Round 1',
    issuer: 'Young Turks',
    date: '2024',
    category: 'participation',
    description: 'Qualified Round 1 of the Young Turks competition.',
    pdfUrl: youngTurksR1Pdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Competition', 'Problem Solving'],
  },
  {
    id: 'part-naukri-campus',
    title: 'Naukri Campus Certificate',
    issuer: 'NaukriCampus',
    date: '2024',
    category: 'participation',
    description: 'Participation certificate from NaukriCampus assessment program.',
    pdfUrl: naukriCampusPdf.url,
    orientation: 'portrait',
    credentialUrl: '#',
    skills: ['Assessment', 'Aptitude', 'Career Readiness'],
  },
];

// Helper function to get certificates by category
export const getCertificatesByCategory = (category: 'technical' | 'participation'): Certificate[] => {
  return certificates.filter(cert => cert.category === category);
};
