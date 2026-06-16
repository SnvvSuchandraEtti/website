// Centralized skill -> logo URL map.
// Uses devicon where a logo exists, simple-icons CDN otherwise.
// Keep this in sync with src/data/skills.ts ids.

const devicon = (name: string, variant: string = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

// simple-icons serves a single colored SVG per slug.
const simple = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

const SKILL_ICONS: Record<string, string> = {
  // Programming
  python: devicon("python"),
  java: devicon("java"),
  javascript: devicon("javascript"),
  c: devicon("c"),
  cpp: devicon("cplusplus"),
  r: devicon("r"),
  html: devicon("html5"),
  css: devicon("css3"),
  plsql: devicon("oracle"),

  // Frameworks
  flutter: devicon("flutter"),
  react: devicon("react"),
  node: devicon("nodejs"),
  expressjs: devicon("express"),
  bootstrap: devicon("bootstrap"),

  // Databases
  mongodb: devicon("mongodb"),
  firebase: devicon("firebase", "plain"),
  mysql: devicon("mysql"),

  // Cloud
  aws: devicon("amazonwebservices", "original-wordmark"),

  // CS Fundamentals — no real brand logos; use simple-icons proxies
  oop: simple("uml"),
  networks: simple("cisco"),
  dbms: simple("databricks"),
  os: simple("linux"),

  // Tools
  vscode: devicon("vscode"),
  androidstudio: devicon("androidstudio"),
  github: devicon("github"),
  vmware: simple("vmware"),
  blender: devicon("blender"),
  audacity: simple("audacity"),
  davinciresolve: simple("davinciresolve"),
  gimp: simple("gimp"),

  // Design
  figma: devicon("figma"),

  // Development practices — brand-ish proxies
  agile: simple("jira"),
  tdd: simple("jest"),
  versioncontrol: devicon("git"),
  api: simple("postman"),
};

export const FALLBACK_SKILL_ICON = devicon("devicon");

export const getSkillIconUrl = (skillId: string): string =>
  SKILL_ICONS[skillId] ?? FALLBACK_SKILL_ICON;
