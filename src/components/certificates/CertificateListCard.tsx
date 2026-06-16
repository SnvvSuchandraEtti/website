import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText, ShieldCheck } from 'lucide-react';
import { Certificate } from '@/data/certificates';
import { getIssuerStyle } from '@/utils/issuerStyle';
import CertificatePdfThumb from './CertificatePdfThumb';

interface Props {
  cert: Certificate;
}

const formatDate = (s: string) => {
  if (!s) return '';
  if (/ongoing|present/i.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  }).format(d);
};

const CertificateListCard: React.FC<Props> = ({ cert }) => {
  const style = getIssuerStyle(cert.issuer, cert.title);
  const verified = !!(cert.credentialUrl && cert.credentialUrl !== '#');
  const skills = cert.skills ?? [];
  const visibleSkills = skills.slice(0, 4);
  const overflow = skills.length - visibleSkills.length;

  return (
    <Link
      to={`/certificates/${cert.id}`}
      className="group flex flex-col h-full rounded-2xl border border-white/[0.06] bg-card overflow-hidden hover:border-white/[0.16] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <CertificatePdfThumb pdfUrl={cert.pdfUrl} title={cert.title} />
      <div className="flex flex-col flex-1 p-5">
      {/* Top row: issuer + verified */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="eyebrow" style={{ color: style.hex }}>
          {cert.issuer}
        </span>
        {verified && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30"
            title="Verified credential"
          >
            <ShieldCheck className="h-3 w-3" /> Verified
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-foreground font-medium leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {cert.title}
      </h3>

      {/* Meta line */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mb-3">
        <span>{formatDate(cert.date)}</span>
        <span className="opacity-40">·</span>
        <span className="uppercase tracking-wider">{cert.category}</span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-relaxed mb-3">
        {cert.description}
      </p>

      {/* Skills */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {visibleSkills.map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70"
            >
              {s}
            </span>
          ))}
          {overflow > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50">
              +{overflow}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
          <FileText className="h-3 w-3" />
          {cert.pdfUrl ? 'PDF certificate' : 'No PDF'}
        </span>
        <span className="text-xs text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 transition-colors">
          View details <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
      </div>
    </Link>
  );
};

export default CertificateListCard;
