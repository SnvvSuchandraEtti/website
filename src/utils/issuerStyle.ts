// Maps a certificate issuer string to a brand-style accent color + label color class
// Used to differentiate certificate cards visually.

export interface IssuerStyle {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
}

const map: Array<{ match: RegExp; style: IssuerStyle }> = [
  { match: /google|flutter/i, style: { name: 'Google', hex: '#4285F4', bgClass: 'bg-[#4285F4]/15', textClass: 'text-[#4285F4]' } },
  { match: /microsoft|azure/i, style: { name: 'Microsoft', hex: '#00BCF2', bgClass: 'bg-[#00BCF2]/15', textClass: 'text-[#00BCF2]' } },
  { match: /aws|amazon/i, style: { name: 'AWS', hex: '#FF9900', bgClass: 'bg-[#FF9900]/15', textClass: 'text-[#FF9900]' } },
  { match: /red hat/i, style: { name: 'Red Hat', hex: '#EE0000', bgClass: 'bg-[#EE0000]/15', textClass: 'text-[#EE0000]' } },
  { match: /cisco/i, style: { name: 'Cisco', hex: '#1BA0D7', bgClass: 'bg-[#1BA0D7]/15', textClass: 'text-[#1BA0D7]' } },
  { match: /oracle/i, style: { name: 'Oracle', hex: '#F80000', bgClass: 'bg-[#F80000]/15', textClass: 'text-[#F80000]' } },
  { match: /nptel|iit/i, style: { name: 'NPTEL', hex: '#8B5CF6', bgClass: 'bg-[#8B5CF6]/15', textClass: 'text-[#8B5CF6]' } },
  { match: /ai|deep learning|nlp/i, style: { name: 'AI', hex: '#A855F7', bgClass: 'bg-[#A855F7]/15', textClass: 'text-[#A855F7]' } },
  { match: /hackerrank|postman|edx/i, style: { name: 'Dev', hex: '#10B981', bgClass: 'bg-[#10B981]/15', textClass: 'text-[#10B981]' } },
  { match: /web|html|php/i, style: { name: 'Web', hex: '#22C55E', bgClass: 'bg-[#22C55E]/15', textClass: 'text-[#22C55E]' } },
  { match: /pega/i, style: { name: 'Pega', hex: '#F97316', bgClass: 'bg-[#F97316]/15', textClass: 'text-[#F97316]' } },
  { match: /flipkart|hackathon/i, style: { name: 'Event', hex: '#EAB308', bgClass: 'bg-[#EAB308]/15', textClass: 'text-[#EAB308]' } },
];

export const getIssuerStyle = (issuer: string, title?: string): IssuerStyle => {
  const haystack = `${issuer} ${title ?? ''}`;
  const hit = map.find((m) => m.match.test(haystack));
  return (
    hit?.style ?? {
      name: 'Other',
      hex: '#6366F1',
      bgClass: 'bg-primary/15',
      textClass: 'text-primary',
    }
  );
};
