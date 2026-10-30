import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactConfig, newsletterConfig } from '@/config';
import { trackEvent, trackNewsletterSignup } from '@/lib/analytics';

// Shown beside the field and stored with each sign-up, so there is a record
// of exactly what the subscriber agreed to (POPIA s69).
const NEWSLETTER_CONSENT =
  'I agree to receive FM Consulting insights by email. I can unsubscribe at any time.';

/** Email sign-up for new Insights. Lives at the foot of the Insights page. */
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactConfig.web3formsKey,
          subject: 'Newsletter subscription — FM Consulting website',
          from_name: 'FM Consulting Website',
          email,
          message: `New newsletter subscriber: ${email}`,
          consent_wording: NEWSLETTER_CONSENT,
          consent_given_at: new Date().toISOString(),
          consent_page: window.location.href,
          privacy_policy: 'https://www.fmconsultingza.co.za/privacy',
        }),
      });
      const data = await res.json();
      if (data.success) {
        trackNewsletterSignup();
        setStatus('done');
      } else {
        trackEvent('newsletter_error', { reason: 'web3forms_rejected' });
        setStatus('error');
      }
    } catch {
      trackEvent('newsletter_error', { reason: 'network' });
      setStatus('error');
    }
  };

  return (
    <section className="w-full fm-section bg-fm-paper text-fm-ink" aria-labelledby="newsletter-heading">
      <div className="container-large px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-fm-ink pt-6 lg:pt-8">
          <p className="fm-meta col-span-12 lg:col-span-3 lg:pt-3 text-fm-graphite">Newsletter</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="newsletter-heading" className="fm-display-2 max-w-[17ch]">
              {newsletterConfig.heading}
            </h2>
            <p className="fm-body mt-6 lg:mt-8 max-w-[40rem] text-fm-graphite">{newsletterConfig.description}</p>

            {status === 'done' ? (
              <p className="fm-body mt-10 text-fm-ink" role="status">
                You're subscribed. New insights will arrive at {email}.
              </p>
            ) : (
              <form className="mt-10 max-w-[40rem]" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterConfig.placeholder}
                    className="flex-1 min-w-0 h-14 px-4 bg-white border border-fm-silver text-fm-ink placeholder:text-fm-graphite/70 focus:outline-none focus:border-fm-ink transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="h-14 px-8 bg-fm-ink text-fm-paper font-geist-mono text-sm hover:bg-black transition-colors disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fm-ink"
                  >
                    {status === 'sending' ? 'Subscribing…' : newsletterConfig.buttonText}
                  </button>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fm-graphite">
                  {NEWSLETTER_CONSENT} See our{' '}
                  <Link to="/privacy" className="fm-link decoration-fm-silver hover:text-fm-ink hover:decoration-fm-ink">
                    Privacy Policy
                  </Link>
                  .
                </p>
                {status === 'error' && (
                  <p className="mt-3 text-sm text-red-700" role="alert">
                    The sign-up didn't go through. Check the address and try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
