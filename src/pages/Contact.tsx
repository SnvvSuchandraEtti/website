import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import emailjs from 'emailjs-com';
import { toast } from 'sonner';
import {
  Send,
  Mail,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';
import { supabase } from '@/integrations/supabase/client';
import contactPortrait from '@/assets/profile/suchandra-contact-portrait.jpg.asset.json';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().trim().email('Please enter a valid email').max(255),
  subject: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long'),
});

type FieldErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const RECIPIENT_EMAIL = 'snvvs369@gmail.com';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _company: '', // honeypot — bots fill all visible-looking fields
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const envWarnedRef = useRef(false);

  // One-shot warning for missing EmailJS env vars; backend fallback still runs.
  useEffect(() => {
    if (envWarnedRef.current) return;
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.info('[contact] EmailJS not configured — using backend email fallback.');
      envWarnedRef.current = true;
    }
  }, []);

  // Clear any pending reset timer on unmount.
  useEffect(() => () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FieldErrors]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: silently succeed and bail.
    if (formState._company.trim()) {
      setIsSuccess(true);
      return;
    }

    const parsed = contactSchema.safeParse(formState);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error('Please fix the errors and try again.');
      return;
    }

    setIsSubmitting(true);
    let delivered = false;
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              from_name: parsed.data.name,
              from_email: parsed.data.email,
              subject: parsed.data.subject || 'Portfolio contact',
              message: parsed.data.message,
              to_email: RECIPIENT_EMAIL,
            },
            EMAILJS_PUBLIC_KEY
          );
          delivered = true;
        } catch (err) {
          console.warn('EmailJS failed, falling back', err);
        }
      }

      if (!delivered) {
        const { error } = await supabase.functions.invoke('send-contact-gmail', {
          body: {
            name: parsed.data.name,
            email: parsed.data.email,
            subject: parsed.data.subject,
            message: parsed.data.message,
          },
        });
        if (error) throw error;
        delivered = true;
      }

      supabase.functions
        .invoke('log-contact-to-sheets', {
          body: { name: parsed.data.name, email: parsed.data.email, message: parsed.data.message },
        })
        .catch((e) => console.warn('Sheets backup failed (non-blocking)', e));

      toast.success("Message sent — I'll reply soon.");
      setIsSuccess(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setIsSuccess(false);
        setFormState({ name: '', email: '', subject: '', message: '', _company: '' });
        resetTimerRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Contact form submit error', err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field: keyof FieldErrors) =>
    `w-full bg-transparent border-0 border-b ${
      errors[field] ? 'border-destructive/60' : 'border-white/[0.12]'
    } focus:border-foreground focus:ring-0 focus:outline-none py-3 text-base placeholder:text-muted-foreground/60 transition-colors`;

  return (
    <div className="min-h-dvh flex flex-col">
      <SEO
        title="Contact"
        description="Get in touch with Suchandra Etti — email, GitHub, LinkedIn, and contact form."
        path="/contact"
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-[1100px]">
          {/* Editorial closing — big statement */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20 max-w-3xl"
          >
            <p className="eyebrow eyebrow-accent mb-5">Contact</p>
            <h1 className="fluid-h1 text-foreground mb-6">
              Let's build something
              <br />
              worth shipping.
            </h1>
            <p className="fluid-lead text-muted-foreground prose-measure">
              I'm open to internships, full-time roles, freelance, and collaborations on
              ambitious side projects. Reply time is usually under 24 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-24">
            {/* Form — minimal, bottom-bordered inputs */}
            <motion.form
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Honeypot — visually hidden, ignored by real users, filled by bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="_company">Company</label>
                <input
                  id="_company"
                  name="_company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formState._company}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Field label="Your name" id="name" error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={inputCls('name')}
                    placeholder="Jane Doe"
                    disabled={isSubmitting || isSuccess}
                    maxLength={100}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-err' : undefined}
                    required
                  />
                </Field>
                <Field label="Email" id="email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={inputCls('email')}
                    placeholder="jane@company.com"
                    disabled={isSubmitting || isSuccess}
                    maxLength={255}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-err' : undefined}
                    required
                  />
                </Field>
              </div>

              <Field label="Subject" id="subject" optional>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formState.subject}
                  onChange={handleChange}
                  className={inputCls('subject')}
                  placeholder="What's this about?"
                  disabled={isSubmitting || isSuccess}
                  maxLength={200}
                />
              </Field>

              <Field label="Message" id="message" error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  className={`${inputCls('message')} resize-none`}
                  placeholder="Tell me a bit about what you're building…"
                  disabled={isSubmitting || isSuccess}
                  maxLength={2000}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-err' : undefined}
                  required
                />
              </Field>

              <div className="flex items-center gap-4 pt-2">
                <motion.button
                  type="submit"
                  whileTap={!isSubmitting && !isSuccess ? { scale: 0.98 } : undefined}
                  disabled={isSubmitting || isSuccess}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</>
                  ) : isSuccess ? (
                    <><CheckCircle className="h-4 w-4" aria-hidden="true" /> Sent</>
                  ) : (
                    <>Send message <Send className="h-4 w-4" aria-hidden="true" /></>
                  )}
                </motion.button>
                <p className="text-xs text-muted-foreground">Replies within 24h.</p>
              </div>
            </motion.form>

            {/* Right column — quiet portrait + contact details */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-10"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] aspect-[4/5]">
                <img
                  src={contactPortrait.url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-[center_top]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div>
                    <p className="eyebrow text-foreground/70">Status</p>
                    <p className="text-sm text-foreground font-medium mt-1">Open to opportunities</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur border border-white/[0.1] text-[11px] font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    Available
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <ContactRow label="Email" value={RECIPIENT_EMAIL} href={`mailto:${RECIPIENT_EMAIL}`} />
                <ContactRow label="Location" value="Andhra Pradesh, India" />
                <ContactRow label="Phone" value="+91 7989635988" href="tel:+917989635988" />
              </div>

              <div className="flex items-center gap-5 pt-6 border-t border-white/[0.08]">
                {[
                  { href: 'https://github.com/SnvvSuchandraEtti', icon: Github, label: 'GitHub' },
                  { href: 'https://linkedin.com/in/suchandra-etti', icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://twitter.com/snvvs369', icon: Twitter, label: 'Twitter' },
                  { href: `mailto:${RECIPIENT_EMAIL}`, icon: Mail, label: 'Email' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Field: React.FC<{
  label: string;
  id: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}> = ({ label, id, error, optional, children }) => (
  <div>
    <label htmlFor={id} className="eyebrow block mb-2">
      {label} {optional && <span className="opacity-50 normal-case tracking-normal">(optional)</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-err`} role="alert" className="text-xs text-destructive mt-2">
        {error}
      </p>
    )}
  </div>
);

const ContactRow: React.FC<{ label: string; value: string; href?: string }> = ({ label, value, href }) => (
  <div className="flex items-baseline justify-between gap-4 py-3 border-b border-white/[0.06]">
    <span className="eyebrow shrink-0">{label}</span>
    {href ? (
      <a
        href={href}
        className="text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
      >
        {value} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    ) : (
      <span className="text-sm text-foreground text-right">{value}</span>
    )}
  </div>
);

export default Contact;
