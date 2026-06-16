
export interface Skill {
  id: string;
  name: string;
  category: "Programming" | "Framework" | "Database" | "Design" | "Tools" | "Development" | "CS Fundamentals" | "Cloud";
  icon: string;
  proficiency: number; // 1-5
  description: string;
  certifications?: string[];
  color?: string;
  secondaryColor?: string;
}

export const skills: Skill[] = [
  // Programming Languages
  {
    id: "python",
    name: "Python",
    category: "Programming",
    icon: "code",
    proficiency: 5,
    description: "Expert in Python programming for backend development, data science, and AI applications.",
    certifications: ["Data Mining", "Introduction to Deep Learning"],
    color: "#3776AB",
    secondaryColor: "#FFD43B"
  },
  {
    id: "java",
    name: "Java",
    category: "Programming",
    icon: "code",
    proficiency: 5,
    description: "Proficient in Java development for enterprise applications with experience in multi-threaded processing.",
    certifications: ["IT Pearson Java", "edX Java Fundamentals"],
    color: "#007396",
    secondaryColor: "#ED8B00"
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Programming",
    icon: "code",
    proficiency: 4,
    description: "Advanced knowledge of JavaScript for frontend and backend development with modern frameworks.",
    certifications: ["HTML Forms with JavaScript"],
    color: "#F7DF1E",
    secondaryColor: "#323330"
  },
  {
    id: "c",
    name: "C",
    category: "Programming",
    icon: "code",
    proficiency: 4,
    description: "Strong foundation in C programming with focus on system-level development and algorithms.",
    certifications: ["Spoken Tutorial - Project C"],
    color: "#A8B9CC",
    secondaryColor: "#044F88"
  },
  {
    id: "cpp",
    name: "C++",
    category: "Programming",
    icon: "code",
    proficiency: 4,
    description: "Strong foundation in C++ programming with focus on object-oriented programming and algorithms.",
    certifications: ["Spoken Tutorial - Project Cpp"],
    color: "#00599C",
    secondaryColor: "#004482"
  },
  {
    id: "r",
    name: "R",
    category: "Programming",
    icon: "code",
    proficiency: 3,
    description: "Experience with R programming for statistical analysis and data visualization.",
    color: "#276DC3",
    secondaryColor: "#8CD2F5"
  },
  {
    id: "html",
    name: "HTML",
    category: "Programming",
    icon: "code",
    proficiency: 5,
    description: "Expert knowledge of HTML for building accessible and semantic web pages.",
    certifications: ["HTML Forms with JavaScript"],
    color: "#E34F26",
    secondaryColor: "#EF652A"
  },
  {
    id: "css",
    name: "CSS",
    category: "Programming",
    icon: "code",
    proficiency: 5,
    description: "Proficient in CSS for creating responsive and visually appealing web designs.",
    color: "#1572B6",
    secondaryColor: "#33A9DC"
  },
  {
    id: "plsql",
    name: "PL/SQL",
    category: "Programming",
    icon: "database",
    proficiency: 3,
    description: "Experience with PL/SQL for database programming and stored procedures.",
    color: "#F80000",
    secondaryColor: "#E38B00"
  },
  
  // Frameworks & Libraries
  {
    id: "flutter",
    name: "Flutter",
    category: "Framework",
    icon: "code",
    proficiency: 5,
    description: "Expertise in building cross-platform mobile applications with Flutter and Firebase integration.",
    certifications: ["Google Flutter Internship", "THUB - Certificate of Internship"],
    color: "#02569B",
    secondaryColor: "#45D1FD"
  },
  {
    id: "react",
    name: "ReactJS",
    category: "Framework",
    icon: "code",
    proficiency: 4,
    description: "Proficient in building dynamic, responsive web applications using React and related libraries.",
    color: "#61DAFB",
    secondaryColor: "#282C34"
  },
  {
    id: "node",
    name: "Node.js",
    category: "Framework",
    icon: "server",
    proficiency: 4,
    description: "Experienced in building RESTful APIs and server-side applications with Node.js and Express.",
    certifications: ["Node.js"],
    color: "#339933",
    secondaryColor: "#1A1A1A"
  },
  {
    id: "expressjs",
    name: "Express.js",
    category: "Framework",
    icon: "server",
    proficiency: 4,
    description: "Skilled in creating robust backend services with Express.js framework for Node.js.",
    color: "#000000",
    secondaryColor: "#F5F5F5"
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    category: "Framework",
    icon: "code",
    proficiency: 4,
    description: "Experience with Bootstrap framework for creating responsive and mobile-first websites.",
    color: "#7952B3",
    secondaryColor: "#563D7C"
  },
  
  // Databases & Cloud
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Database",
    icon: "database",
    proficiency: 4,
    description: "Skilled in designing NoSQL database structures and operations using MongoDB.",
    color: "#47A248",
    secondaryColor: "#000000"
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "Database",
    icon: "database",
    proficiency: 5,
    description: "Expert in Firebase services including authentication, real-time database, and cloud functions.",
    color: "#FFCA28",
    secondaryColor: "#F57C00"
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Database",
    icon: "database",
    proficiency: 4,
    description: "Knowledgeable in database design, optimization, and querying using MySQL and SQL.",
    certifications: ["SQL Basic", "PHP & MySQL Training", "DBMS"],
    color: "#4479A1",
    secondaryColor: "#F29111"
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    icon: "cloud",
    proficiency: 3,
    description: "Experienced in deploying and managing applications on AWS cloud services.",
    certifications: ["Cloud Computing"],
    color: "#232F3E",
    secondaryColor: "#FF9900"
  },
  
  // CS Fundamentals
  {
    id: "oop",
    name: "OOP",
    category: "CS Fundamentals",
    icon: "git-branch",
    proficiency: 5,
    description: "Strong understanding of object-oriented programming principles and design patterns.",
    color: "#6DB33F",
    secondaryColor: "#1B1F23"
  },
  {
    id: "networks",
    name: "Computer Networks",
    category: "CS Fundamentals",
    icon: "network",
    proficiency: 4,
    description: "Solid knowledge of computer networking concepts, protocols, and architecture.",
    certifications: ["CCNA v7: ITN"],
    color: "#0078D7",
    secondaryColor: "#002050"
  },
  {
    id: "dbms",
    name: "DBMS",
    category: "CS Fundamentals",
    icon: "database",
    proficiency: 4,
    description: "Comprehensive understanding of database management systems and principles.",
    certifications: ["DBMS"],
    color: "#E48E00",
    secondaryColor: "#005984"
  },
  {
    id: "os",
    name: "Operating Systems",
    category: "CS Fundamentals",
    icon: "settings",
    proficiency: 4,
    description: "Deep knowledge of operating system concepts, processes, and memory management.",
    certifications: ["NDG Linux Unhatched", "Red Hat System Administration 1", "Red Hat System Administration 2"],
    color: "#0078D4",
    secondaryColor: "#FFB900"
  },
  
  // Developer Tools
  {
    id: "vscode",
    name: "VS Code",
    category: "Tools",
    icon: "code",
    proficiency: 5,
    description: "Expert in using Visual Studio Code for efficient code development and debugging.",
    color: "#007ACC",
    secondaryColor: "#0065A9"
  },
  {
    id: "androidstudio",
    name: "Android Studio",
    category: "Tools",
    icon: "code",
    proficiency: 4,
    description: "Skilled in Android application development using Android Studio IDE.",
    color: "#3DDC84",
    secondaryColor: "#073042"
  },
  {
    id: "github",
    name: "GitHub",
    category: "Tools",
    icon: "git-branch",
    proficiency: 5,
    description: "Expert in version control, collaborative development, and CI/CD workflows using Git and GitHub.",
    color: "#F05032",
    secondaryColor: "#181717"
  },
  {
    id: "vmware",
    name: "VMware",
    category: "Tools",
    icon: "layers",
    proficiency: 4,
    description: "Experience with virtualization and creating development environments using VMware.",
    color: "#607078",
    secondaryColor: "#343639"
  },
  {
    id: "blender",
    name: "Blender",
    category: "Tools",
    icon: "shapes",
    proficiency: 3,
    description: "Knowledge of 3D modeling and animation using Blender software.",
    color: "#E87D0D",
    secondaryColor: "#193C51"
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    icon: "figma",
    proficiency: 4,
    description: "Proficient in creating user interfaces and prototypes using Figma for web and mobile applications.",
    color: "#F24E1E",
    secondaryColor: "#A259FF"
  },
  {
    id: "audacity",
    name: "Audacity",
    category: "Tools",
    icon: "mic",
    proficiency: 3,
    description: "Experience with audio editing and production using Audacity software.",
    color: "#0000CC",
    secondaryColor: "#FF7700"
  },
  {
    id: "davinciresolve",
    name: "DaVinci Resolve",
    category: "Tools",
    icon: "video",
    proficiency: 3,
    description: "Skills in video editing and color grading using DaVinci Resolve.",
    color: "#025D8C",
    secondaryColor: "#8399AF"
  },
  {
    id: "gimp",
    name: "GIMP",
    category: "Tools",
    icon: "image",
    proficiency: 3,
    description: "Experience with image editing and manipulation using GIMP software.",
    color: "#5C5543",
    secondaryColor: "#000000"
  },
  
  // Software Development
  {
    id: "agile",
    name: "Agile/Scrum",
    category: "Development",
    icon: "git-branch",
    proficiency: 4,
    description: "Experienced in agile development methodologies, sprint planning, and scrum practices.",
    certifications: ["Professional Development at Technical Hub"],
    color: "#70B5F9",
    secondaryColor: "#36383F"
  },
  {
    id: "tdd",
    name: "Test-Driven Development",
    category: "Development",
    icon: "bug",
    proficiency: 4,
    description: "Skilled in implementing test-driven development practices for higher code quality.",
    color: "#FF9E0F",
    secondaryColor: "#1A1A1A"
  },
  {
    id: "versioncontrol",
    name: "Version Control",
    category: "Development",
    icon: "git-branch",
    proficiency: 5,
    description: "Expert in version control systems, branching strategies, and collaborative workflows.",
    color: "#F05133",
    secondaryColor: "#3E2C00"
  },
  {
    id: "api",
    name: "API Integration",
    category: "Development",
    icon: "server",
    proficiency: 4,
    description: "Skilled in designing and implementing RESTful APIs for web and mobile applications.",
    certifications: ["Postman API Fundamentals Student Expert", "Postman API"],
    color: "#FF6C37",
    secondaryColor: "#2A2E36"
  }
];
