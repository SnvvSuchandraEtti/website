import homeAsset from "@/assets/audio/home.mp3.asset.json";
import aboutAsset from "@/assets/audio/about.mp3.asset.json";
import experienceAsset from "@/assets/audio/experience.mp3.asset.json";
import skillAsset from "@/assets/audio/skill.mp3.asset.json";
import projectAsset from "@/assets/audio/project.mp3.asset.json";
import detailedAsset from "@/assets/audio/detailed.mp3.asset.json";
import certificateAsset from "@/assets/audio/certificate.mp3.asset.json";
import contactAsset from "@/assets/audio/contact.mp3.asset.json";

export type AmbientTrack = { src: string; volume: number; id: string };

const TRACKS = {
  home: { id: "home", src: homeAsset.url, volume: 0.1 },
  about: { id: "about", src: aboutAsset.url, volume: 0.08 },
  experience: { id: "experience", src: experienceAsset.url, volume: 0.08 },
  skills: { id: "skills", src: skillAsset.url, volume: 0.08 },
  projects: { id: "projects", src: projectAsset.url, volume: 0.1 },
  detailed: { id: "detailed", src: detailedAsset.url, volume: 0.07 },
  certificates: { id: "certificates", src: certificateAsset.url, volume: 0.07 },
  contact: { id: "contact", src: contactAsset.url, volume: 0.09 },
} as const satisfies Record<string, AmbientTrack>;

export function resolveTrackForPath(pathname: string): AmbientTrack | null {
  const p = pathname.replace(/\/+$/, "") || "/";

  if (p === "/") return TRACKS.home;
  if (p === "/about") return TRACKS.about;
  if (p === "/experience") return TRACKS.experience;
  if (p === "/skills") return TRACKS.skills;
  if (p === "/contact") return TRACKS.contact;

  if (p === "/projects") return TRACKS.projects;
  if (/^\/projects\/[^/]+/.test(p)) return TRACKS.detailed;

  if (p === "/certificates") return TRACKS.certificates;
  if (/^\/certificates\/[^/]+/.test(p)) return TRACKS.detailed;

  return null;
}
