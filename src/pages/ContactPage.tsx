import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { contactConfig } from '@/config';
import { pricingConfig } from '@/data/pricing';
import { PLAYBOOK_SUMMARY_KEY, type PlaybookSummary } from '@/data/playbook';
import { trackContactFormStart, trackEvent, trackLead } from '@/lib/analytics';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';

export function ContactPage() {
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({ threshold: 0.2 });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const formStarted = useRef(false);
  // Arriving from a pricing CTA (/contact?plan=<id>) starts the message for them.
  const [searchParams] = useSearchParams();
  const chosenPlan = pricingConfig.plans.find((p) => p.id === searchParams.get('plan'));
  // Arriving from the Growth Playbook (/contact?from=playbook) carries the
  // visitor's leak summary and details, saved in this browser tab only.
  const fromPlaybook = (() => {
    if (searchParams.get('from') !== 'playbook') return null;
    try {
      const raw = sessionStorage.getItem(PLAYBOOK_SUMMARY_KEY);
      return raw ? (JSON.parse(raw) as PlaybookSummary) : null;
    } catch {
      return null;
    }
  })();

  // First interaction with the form, so the funnel reads
  // CTA click → form start → lead.
  const handleFormFocus = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackContactFormStart();
  };
  const [formData, setFormData] = useState({
    name: fromPlaybook?.name ?? '',
    company: fromPlaybook?.business ?? '',
    email: fromPlaybook?.email ?? '',
    phone: '',
    service: '',
    message: fromPlaybook?.message ?? (chosenPlan ? `I'm interested in the ${chosenPlan.name} plan.` : ''),
    budget: ''
  });

  const buildMailto = () => {
    const subject = encodeURIComponent(
      `Consultation Request — ${formData.name}${formData.company ? ` (${formData.company})` : ''}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${formData.name}`,
        `Company: ${formData.company}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone}`,
        `Service Required: ${formData.service}`,
        `Budget Range: ${formData.budget}`,
        '',
        'Message:',
        formData.message,
      ].join('\n')
    );
    return `mailto:${contactConfig.contactInfo.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // No key configured yet — fall back to the visitor's email client
    if (!contactConfig.web3formsKey) {
      trackLead({ method: 'mailto_fallback', service: formData.service, budget: formData.budget });
      window.location.href = buildMailto();
      setSubmitted(true);
      return;
    }

    setSending(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactConfig.web3formsKey,
          subject: `Consultation Request — ${formData.name}${formData.company ? ` (${formData.company})` : ''}`,
          from_name: 'FM Consulting Website',
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Key event in GA4 and a Lead in Meta. No personal details are
        // sent, only the service and budget the visitor picked.
        trackLead({ method: 'web3forms', service: formData.service, budget: formData.budget });
        setSubmitted(true);
      } else {
        trackEvent('contact_form_error', { reason: 'web3forms_rejected' });
        setError('Something went wrong sending your message. Please email us directly instead.');
      }
    } catch {
      trackEvent('contact_form_error', { reason: 'network' });
      setError('Something went wrong sending your message. Please email us directly instead.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="w-full">
      <PageHeader
        label="Contact"
        title="Tell us where growth is stuck."
        intro="Book a consultation and you speak to a senior strategist from the first call. We respond within 24 hours."
      />

      <section className="w-full fm-section bg-white text-fm-ink" aria-label="Contact form">
        <div className="container-large px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 border-t border-fm-ink pt-6 lg:pt-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="fm-meta text-fm-graphite lg:pt-3">Details</p>
              <div className="mt-6">
              <dl className="border-t border-fm-ink">
                {[
                  { term: 'Email', value: <a href={`mailto:${contactConfig.contactInfo.email}`} className="fm-link decoration-fm-silver hover:decoration-fm-ink">{contactConfig.contactInfo.email}</a> },
                  { term: 'Phone', value: <a href={`tel:${contactConfig.contactInfo.phone.replace(/[^+\d]/g, '')}`} className="fm-link decoration-fm-silver hover:decoration-fm-ink">{contactConfig.contactInfo.phone}</a> },
                  { term: 'Location', value: contactConfig.contactInfo.address },
                  { term: 'Hours', value: contactConfig.contactInfo.hours },
                ].map((row) => (
                  <div key={row.term} className="py-4 border-b border-fm-silver">
                    <dt className="fm-meta text-fm-graphite">{row.term}</dt>
                    <dd className="mt-2 fm-body text-fm-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
              </div>
            </div>

            <div className="col-span-12 lg:col-start-5 lg:col-span-8" ref={formRef}>
              <div className={cn('transition-opacity duration-700', formVisible ? 'opacity-100' : 'opacity-0')}>
                {submitted ? (
                  <div className="py-6" role="status">
                                        <h3 className="fm-display-2 text-fm-ink mb-4">
                      Message received.
                    </h3>
                    <p className="fm-body text-fm-graphite">
                      We've received your message and will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-fm-ink mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-fm-ink mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-fm-ink mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-fm-ink mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors"
                          placeholder="+27 21 555 0123"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-fm-ink mb-2">
                          Service Required *
                        </label>
                        <select
                          id="service"
                          name="service"
                          required
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors bg-white"
                        >
                          <option value="">Select a service</option>
                          <option value="growth-strategy">Growth Strategy</option>
                          <option value="digital-marketing">Digital Marketing Strategy</option>
                          <option value="customer-acquisition">Customer Acquisition</option>
                          <option value="customer-lifecycle">Customer Lifecycle & Retention</option>
                          <option value="analytics">Analytics & Reporting</option>
                          <option value="business-performance">Business Performance Consulting</option>
                          <option value="other">Other / Not Sure</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-fm-ink mb-2">
                          Estimated Budget Range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors bg-white"
                        >
                          <option value="">Select budget range</option>
                          {/* Bands follow the published plan prices on /pricing. */}
                          <option value="under-20k">Under R20,000</option>
                          <option value="20k-50k">R20,000 - R50,000</option>
                          <option value="50k-100k">R50,000 - R100,000</option>
                          <option value="over-100k">Over R100,000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-fm-ink mb-2">
                        Tell us about your business goals *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-fm-silver focus:outline-none focus:border-fm-ink transition-colors resize-none"
                        placeholder="What challenges are you facing? What are your growth objectives?"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600">
                        {error}{' '}
                        <a href={buildMailto()} className="underline">
                          Email us directly
                        </a>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-fm-ink text-fm-paper font-geist-mono text-sm hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      
                      {sending ? 'Sending…' : 'Send Message'}
                    </button>

                    <p className="text-sm text-fm-graphite">
                      We use your details only to respond to your enquiry. See our{' '}
                      <Link to="/privacy" className="underline underline-offset-4 hover:text-exvia-black">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper" label="What happens next" heading="Three steps after you get in touch." wide>
        <ol className="grid md:grid-cols-3 gap-x-6 gap-y-10">
          {[
            { step: '01', title: 'Discovery', description: "We discuss your business model, current performance and growth objectives." },
            { step: '02', title: 'Diagnosis', description: 'We identify the biggest opportunities and bottlenecks in your growth system.' },
            { step: '03', title: 'Direction', description: 'We outline how FM Consulting can help you reach your goals, and what it costs.' },
          ].map((item) => (
            <li key={item.step} className="border-t border-fm-ink pt-5">
              <span className="fm-meta text-fm-graphite" aria-hidden="true">{item.step}</span>
              <h3 className="fm-display-3 mt-8 text-fm-ink">{item.title}</h3>
              <p className="fm-body mt-4 text-fm-graphite">{item.description}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
