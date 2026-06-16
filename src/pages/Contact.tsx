import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import emailjs from 'emailjs-com';
import { toast } from 'sonner';
import {
  Send,
  Mail,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  MapPin,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';
import PageTransition from '@/components/ui/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import contactPortraitAsset from '@/assets/profile/suchandra-contact-portrait.jpg.asset.json';

const contactPortrait = contactPortraitAsset.url;

/* ─── Schema & Types ──────────────────────────────────────────────── */

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

/* ─── Environment & Constants ─────────────────────────────────────── */

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const RECIPIENT_EMAIL = 'snvvs369@gmail.com';

/* ─── Sub-components ──────────────────────────────────────────────── */

/** Form field wrapper with label and error handling */
const Field: React.FC<{
  label: string;
  id: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}> = ({ label, id, error, optional, children }) => (
  <div className="relative group/field">
    <label
      htmlFor={id}
      className={cn(
        'eyebrow block mb-3 transition-colors duration-200',
        error ? 'text-destructive/90' : 'text-muted-foreground group-focus-within/field:text-foreground'
      )}
    >
      {label}
      {optional && (
        <span className="opacity-50 normal-case tracking-normal ml-1">(optional)</span>
      )}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          id={`${id}-err`}
          role="alert"
          className="text-[13px] text-destructive/90 mt-2 font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/** Minimalist contact row for the sidebar */
const ContactRow: React.FC<{
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
}> = ({ label, value, href, icon }) => (
  <div className="flex items-center justify-between gap-4 py-4 border-b border-white/[0.04] last:border-b-0 group/row">
    <div className="flex items-center gap-3 text-muted-foreground">
      {icon}
      <span className="eyebrow">{label}</span>
    </div>
    {href ? (
      <a
        href={href}
        className={cn(
          'text-sm font-medium text-foreground transition-colors duration-200',
          'inline-flex items-center gap-1.5',
          'hover:text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
        )}
      >
        {value}
        <ArrowUpRight
          className="h-3.5 w-3.5 opacity-40 group-hover/row:opacity-100 group-hover/row:-translate-y-px group-hover/row:translate-x-px transition-all"
          aria-hidden="true"
        />
      </a>
    ) : (
      <span className="text-sm font-medium text-foreground">{value}</span>
    )}
  </div>
);

/** Social link for the sidebar footer */
const SocialLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={cn(
      'flex items-center justify-center h-10 w-10 rounded-full',
      'border border-white/[0.08] bg-white/[0.02]',
      'text-muted-foreground transition-all duration-200',
      'hover:bg-white/[0.06] hover:text-foreground hover:border-white/[0.12]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    )}
  >
    {icon}
  </a>
);

/* ─── Page Component ──────────────────────────────────────────────── */

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _company: '', // honeypot
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const envWarnedRef = useRef(false);

  // One-shot warning for missing EmailJS env vars
  useEffect(() => {
    if (envWarnedRef.current) return;
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.info('[contact] EmailJS not configured — using backend email fallback.');
      envWarnedRef.current = true;
    }
  }, []);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot trap
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
      // 1. Try EmailJS first
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

      // 2. Fallback to Supabase Edge Function
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
      }

      // 3. Background log to sheets (non-blocking)
      supabase.functions
        .invoke('log-contact-to-sheets', {
          body: {
            name: parsed.data.name,
            email: parsed.data.email,
            message: parsed.data.message,
          },
        })
        .catch((e) => console.warn('Sheets backup failed (non-blocking)', e));

      // Success UI state
      toast.success("Message sent — I'll reply soon.");
      setIsSuccess(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        setIsSuccess(false);
        setFormState({ name: '', email: '', subject: '', message: '', _company: '' });
        resetTimerRef.current = null;
      }, 3000);
    } catch (err) {
      console.error('Contact form submit error', err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field: keyof FieldErrors) =>
    cn(
      'w-full bg-white/[0.02] border',
      errors[field] ? 'border-destructive/50 focus:border-destructive' : 'border-white/[0.08] focus:border-white/[0.2]',
      'rounded-lg px-4 py-3.5 text-[15px] text-foreground',
      'placeholder:text-muted-foreground/40',
      'transition-all duration-200',
      'focus:outline-none focus:ring-1',
      errors[field] ? 'focus:ring-destructive/50' : 'focus:ring-white/[0.2]',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

  return (
    <PageTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO
          title="Contact"
          description="Get in touch with Suchandra Etti — email, GitHub, LinkedIn, and contact form."
          path="/contact"
        />
        <Navbar />

        <main className="flex-grow pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-[1100px]">
            {/* ── Page Header ───────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-20 max-w-2xl"
            >
              <p className="eyebrow eyebrow-accent mb-4" aria-hidden="true">Contact</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24">
              {/* ── Form Section ──────────────────────────────────────── */}
              <motion.form
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
                aria-label="Contact form"
              >
                {/* Honeypot trap */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <Field label="Email address" id="email" error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={inputCls('email')}
                      placeholder="jane@example.com"
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
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    className={cn(inputCls('message'), 'resize-y min-h-[120px]')}
                    placeholder="Tell me a bit about what you're building..."
                    disabled={isSubmitting || isSuccess}
                    maxLength={2000}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-err' : undefined}
                    required
                  />
                </Field>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-4">
                  <motion.button
                    type="submit"
                    whileTap={!isSubmitting && !isSuccess ? { scale: 0.98 } : undefined}
                    disabled={isSubmitting || isSuccess}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full',
                      'bg-foreground text-background font-medium text-[15px]',
                      'transition-all duration-300 disabled:opacity-70',
                      'hover:bg-foreground/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isSubmitting ? (
                        <motion.span
                          key="submitting"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Sending...
                        </motion.span>
                      ) : isSuccess ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-emerald-600"
                        >
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          Message sent
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          Send message
                          <Send className="h-4 w-4" aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <p className="text-[13px] text-muted-foreground/80 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" aria-hidden="true" />
                    Replies typically within 24 hours.
                  </p>
                </div>
              </motion.form>

              {/* ── Sidebar Section ───────────────────────────────────── */}
              <motion.aside
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-10"
                aria-label="Contact details"
              >
                {/* Portrait Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-card aspect-[4/5] max-w-sm">
                  <img
                    src={contactPortrait}
                    alt="Suchandra Etti"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-[center_top]"
                  />
                  {/* Quiet gradient for text legibility */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="eyebrow text-foreground/60 mb-1" aria-hidden="true">Status</p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-foreground font-medium">Open to opportunities</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] text-[11px] font-mono text-foreground/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)] animate-pulse" aria-hidden="true" />
                        Available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Details */}
                <div className="max-w-sm">
                  <ContactRow
                    label="Email"
                    value={RECIPIENT_EMAIL}
                    href={`mailto:${RECIPIENT_EMAIL}`}
                    icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  />
                  <ContactRow
                    label="Phone"
                    value="+91 7989635988"
                    href="tel:+917989635988"
                    icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                  />
                  <ContactRow
                    label="Location"
                    value="Andhra Pradesh, IN"
                    icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                  />
                </div>

                {/* Social Links Grid */}
                <div className="pt-2 max-w-sm">
                  <p className="eyebrow mb-4" aria-hidden="true">Socials</p>
                  <div className="flex items-center gap-3">
                    <SocialLink
                      href="https://github.com/SnvvSuchandraEtti"
                      icon={<Github className="h-4 w-4" aria-hidden="true" />}
                      label="GitHub Profile"
                    />
                    <SocialLink
                      href="https://linkedin.com/in/suchandra-etti"
                      icon={<Linkedin className="h-4 w-4" aria-hidden="true" />}
                      label="LinkedIn Profile"
                    />
                    <SocialLink
                      href="https://twitter.com/snvvs369"
                      icon={<Twitter className="h-4 w-4" aria-hidden="true" />}
                      label="Twitter Profile"
                    />
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
