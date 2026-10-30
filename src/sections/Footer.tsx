import { Link } from 'react-router-dom';
import { footerConfig, contactConfig, legalEntity } from '@/config';
import { openConsentPreferences } from '@/lib/analytics';
import { BrandLogo } from '@/components/BrandLogo';

/*
 * The mark and one line, how to reach us, and a bottom bar for the legal
 * small print. Page links live in the navigation, not here.
 */
const linkQuiet =
  'text-fm-paper/65 hover:text-fm-paper transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-paper';

export function Footer() {
  const socials = footerConfig.socialLinks.filter((s) => s.href);
  const phoneHref = `tel:${contactConfig.contactInfo.phone.replace(/[^+\d]/g, '')}`;

  return (
    <footer className="w-full bg-fm-ink text-fm-paper">
      <div className="container-large px-6 lg:px-12 pt-20 lg:pt-28 pb-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 border-t border-fm-paper/25 pt-10 lg:pt-12">
          <div className="col-span-12 lg:col-span-3">
            <Link
              to="/"
              aria-label="FM Consulting home"
              className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-paper"
            >
              <BrandLogo variant="lockup" reverse className="h-9 text-fm-paper" />
            </Link>
            <p className="fm-meta mt-6 text-fm-paper/55">{footerConfig.tagline}</p>
          </div>

          <div className="col-span-12 lg:col-span-9">

            <ul className="flex flex-wrap gap-x-8 gap-y-3 fm-body lg:pt-2">
              <li>
                <a href={`mailto:${contactConfig.contactInfo.email}`} className={linkQuiet}>
                  {contactConfig.contactInfo.email}
                </a>
              </li>
              <li>
                <a href={phoneHref} className={linkQuiet}>
                  {contactConfig.contactInfo.phone}
                </a>
              </li>
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkQuiet}>
                    {social.label}
                  </a>
                </li>
              ))}
              <li className="text-fm-paper/45">{contactConfig.contactInfo.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 pt-6 border-t border-fm-paper/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-fm-paper/45">
            {footerConfig.copyright}
            <span className="block sm:inline sm:ml-3">Reg. {legalEntity.registrationNumber}</span>
          </p>
          <nav aria-label="Legal" className="fm-meta flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className={linkQuiet}>Privacy</Link>
            <Link to="/terms" className={linkQuiet}>Terms</Link>
            <button type="button" onClick={openConsentPreferences} className={`fm-meta ${linkQuiet}`}>
              Cookie preferences
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
