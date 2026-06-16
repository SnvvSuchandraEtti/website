import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Home, User, Briefcase, Code, FileText, Award, Mail, Download, Folder } from 'lucide-react';
import { projects } from '@/data/projects';
import { certificates } from '@/data/certificates';

const RESUME_URL = 'https://drive.google.com/file/d/1cuPFyM5g54188X2fGUGGPn7Y6CTDq67u/view?usp=drive_link';

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const pages = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'About', path: '/about' },
    { icon: Folder, label: 'Projects', path: '/projects' },
    { icon: Code, label: 'Skills', path: '/skills' },
    { icon: Briefcase, label: 'Experience', path: '/experience' },
    { icon: Award, label: 'Certificates', path: '/certificates' },
    { icon: Mail, label: 'Contact', path: '/contact' },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.path} onSelect={() => go(p.path)}>
              <p.icon className="h-4 w-4 mr-2" />
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { setOpen(false); window.open(RESUME_URL, '_blank'); }}>
            <Download className="h-4 w-4 mr-2" /> Download / View Resume
          </CommandItem>
          <CommandItem onSelect={() => { setOpen(false); window.location.href = 'mailto:snvvs369@gmail.com'; }}>
            <Mail className="h-4 w-4 mr-2" /> Email Me
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Projects">
          {projects.slice(0, 8).map((p) => (
            <CommandItem key={p.id} onSelect={() => go(`/projects/${p.id}`)}>
              <Folder className="h-4 w-4 mr-2" />
              {p.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Certificates">
          {certificates.slice(0, 8).map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/certificates/${c.id}`)}>
              <Award className="h-4 w-4 mr-2" />
              {c.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
