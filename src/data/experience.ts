
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  skills: string[];
  website?: string;
  role?: string;
  responsibilities?: string[];
  technologies?: string[];
}

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Flutter Internship',
    company: 'Technical Hub',
    location: 'Aditya Engineering College',
    startDate: 'June 2024',
    endDate: 'July 2024',
    description: 'Engineered enterprise-class Java Application and Flutter E-commerce platform with Firebase authentication, delivering 40% performance optimization through state management while collaborating in agile environments with 95% sprint completion rate.',
    achievements: [
      'Delivered 40% performance optimization through state management',
      'Achieved 95% sprint completion rate in agile environments',
      'Developed enterprise-class Java Application',
      'Built Flutter E-commerce platform with Firebase authentication'
    ],
    skills: ['Flutter', 'Java', 'Firebase', 'State Management', 'Agile Development'],
    website: 'https://technicalhub.io',
    role: 'Flutter Development Intern',
    responsibilities: [
      'Developing enterprise-class Java applications',
      'Building Flutter E-commerce platform with Firebase integration',
      'Implementing state management for performance optimization',
      'Collaborating in agile development environments',
      'Participating in sprint planning and code reviews'
    ],
    technologies: ['Flutter', 'Java', 'Firebase', 'State Management', 'Git', 'Android Studio']
  },
  {
    id: '2',
    title: 'Java Internship',
    company: 'Technical Hub',
    location: 'Aditya Engineering College',
    startDate: 'April 2024',
    endDate: 'April 2024',
    description: 'Architected a Java-based enterprise with multi-threaded data processing that achieved 70% efficiency improvement by interactive dashboards, and dynamic filtering, transforming complex student data into actionable insights with 60% faster retrieval rates.',
    achievements: [
      'Achieved 70% efficiency improvement through multi-threaded data processing',
      'Implemented interactive dashboards with dynamic filtering',
      'Transformed complex student data into actionable insights',
      '60% faster data retrieval rates'
    ],
    skills: ['Java', 'Multi-threading', 'Data Processing', 'Dashboard Development', 'Performance Optimization'],
    website: 'https://technicalhub.io',
    role: 'Java Developer Intern',
    responsibilities: [
      'Architecting Java-based enterprise applications',
      'Implementing multi-threaded data processing systems',
      'Developing interactive dashboards with dynamic filtering',
      'Optimizing data retrieval performance',
      'Transforming complex data into actionable insights'
    ],
    technologies: ['Java', 'Multi-threading', 'Data Processing', 'Dashboard APIs', 'Performance Optimization']
  },
  {
    id: '3',
    title: 'Professional Development',
    company: 'Technical Hub',
    location: 'Aditya Engineering College',
    startDate: 'August 2023',
    endDate: 'Present',
    description: 'Completed intensive 12-month technical apprenticeship at Technical Hub, mastering 7+ programming languages while delivering 5 client projects with 100% satisfaction rate as Junior Developer. Implemented version control systems, CI/CD & development methodologies.',
    achievements: [
      'Mastered 7+ programming languages',
      'Delivered 5 client projects with 100% satisfaction rate',
      'Implemented version control systems and CI/CD',
      'Applied agile development methodologies'
    ],
    skills: ['Full-Stack Development', 'Version Control', 'CI/CD', 'Agile Methodologies', 'Client Management'],
    website: 'https://technicalhub.io',
    role: 'Junior Developer',
    responsibilities: [
      'Developing client projects using various programming languages',
      'Implementing version control systems and CI/CD pipelines',
      'Collaborating with senior developers on complex features',
      'Participating in client meetings and requirement gathering',
      'Contributing to code reviews and documentation'
    ],
    technologies: ['Git', 'Jenkins', 'Docker', 'JavaScript', 'Python', 'Java', 'React']
  },
  {
    id: '4',
    title: 'Event Organizer',
    company: 'Aditya University',
    location: 'Aditya Engineering College',
    startDate: 'March 2024',
    endDate: 'March 2024',
    description: 'Directed Movie Marathon managing 15 volunteers and technical logistics for 24-hour screenings, increasing attendance by 35% through strategic digital marketing, budget allocation, vendor negotiations, and real-time analytic tracking for optimization.',
    achievements: [
      'Managed 15 volunteers for 24-hour movie marathon event',
      'Increased attendance by 35% through strategic digital marketing',
      'Successfully handled budget allocation and vendor negotiations',
      'Implemented real-time analytic tracking for optimization'
    ],
    skills: ['Event Management', 'Leadership', 'Digital Marketing', 'Budget Management', 'Analytics'],
    website: 'https://adityaedu.net',
    role: 'Event Coordinator',
    responsibilities: [
      'Planning and coordinating all aspects of the movie marathon event',
      'Managing a team of 15 volunteers',
      'Implementing strategic digital marketing campaigns',
      'Handling budget allocation and vendor negotiations',
      'Setting up real-time analytic tracking systems'
    ],
    technologies: ['Event Planning Tools', 'Digital Marketing Platforms', 'Analytics Tools', 'Budget Management Systems']
  },
  {
    id: '5',
    title: 'LEO Club Program Coordinator',
    company: 'Aditya University',
    location: 'Aditya Engineering College',
    startDate: 'January 2023',
    endDate: 'Present',
    description: 'Led LEO Club technical workshops as Program Coordinator, reaching 2500+ students by implementing improved event execution by 40% while developing team collaboration through stakeholder communication and data-driven decision-making processes.',
    achievements: [
      'Reached 2500+ students through technical workshops',
      'Improved event execution efficiency by 40%',
      'Developed enhanced team collaboration processes',
      'Implemented data-driven decision-making processes'
    ],
    skills: ['Workshop Coordination', 'Technical Training', 'Leadership', 'Stakeholder Management', 'Data Analysis'],
    website: 'https://adityaedu.net',
    role: 'Program Coordinator',
    responsibilities: [
      'Leading technical workshops for large student audiences',
      'Coordinating with multiple stakeholders',
      'Implementing data-driven decision-making processes',
      'Developing team collaboration strategies',
      'Managing workshop logistics and execution'
    ],
    technologies: ['Workshop Management Tools', 'Data Analytics', 'Presentation Software', 'Collaboration Platforms']
  },
  {
    id: '6',
    title: 'Startup Experience',
    company: 'Leez',
    location: 'Remote',
    startDate: 'January 2024',
    endDate: 'Present',
    description: 'Currently developing an innovative solution peer-to-peer marketplace revolutionizing on-demand rentals for local communities.',
    achievements: [
      'Designing a scalable peer-to-peer marketplace platform',
      'Implementing innovative rental solutions for local communities',
      'Developing on-demand service architecture',
      'Creating user-centric marketplace features'
    ],
    skills: ['Startup Development', 'Product Design', 'Marketplace Architecture', 'P2P Systems', 'Community Building'],
    role: 'Co-founder & Technical Lead',
    responsibilities: [
      'Leading the technical development of the marketplace platform',
      'Designing and implementing the product architecture',
      'Making key decisions on technology stack and development roadmap',
      'Building and managing the technical team',
      'Ensuring platform scalability and user experience'
    ],
    technologies: ['React Native', 'Node.js', 'MongoDB', 'AWS', 'Payment APIs', 'Geolocation Services']
  }
];
