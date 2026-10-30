// FM Consulting ZA (Pty) Ltd - Site Configuration
import { workEnabled } from '@/data/work';
// Premium Business Consulting Website

// Measurement IDs. Both tags load only on the production domain, so localhost
// and Vercel previews never pollute reports.
export const analyticsConfig = {
  productionHost: 'www.fmconsultingza.co.za',
  ga4Id: 'G-Z729V3H6EY',
  /** Meta Pixel (dataset) ID from Events Manager. Empty = the pixel stays off. */
  metaPixelId: '2156431668306851', // dataset "FM Consulting Website", FM Consulting Pty Ltd business
  /** Microsoft Clarity project ID (heatmaps and session recordings). Empty = Clarity stays off. */
  clarityId: 'z5cwm7ff3x',
};

// The registered entity, as it appears on the CIPC registration certificate.
// Used by the legal pages and the footer.
export const legalEntity = {
  name: 'FM Consulting ZA (Pty) Ltd',
  tradingName: 'FM Consulting',
  registrationNumber: '2026/673704/07',
  registeredOn: '24 August 2026',
  jurisdiction: 'South Africa',
  /** Public-facing location only. The full registered office is on record at the CIPC. */
  registeredOffice: 'Wynberg, Cape Town',
  informationOfficer: 'Fouad Maasdorp',
  informationOfficerRole: 'Director',
  email: 'info@fmconsultingza.co.za',
  phone: '+27 62 897 6939',
  website: 'www.fmconsultingza.co.za',
};

// One date drives both legal pages' "Effective" and "Last updated" lines.
export const legalDates = {
  effective: '4 October 2026',
  updated: '29 October 2026',
  iso: '2026-10-04',
  updatedIso: '2026-10-29',
};

export interface SiteConfig {
  language: string;
  title: string;
  description: string;
}

export const siteConfig: SiteConfig = {
  language: "en",
  title: "FM Consulting | Business Growth & Strategy Consultants",
  description: "FM Consulting helps South African businesses grow through smarter strategy, sharper execution, and measurable commercial outcomes. Specialising in growth strategy, digital marketing, customer acquisition, and business performance.",
};

// Navigation configuration
export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  links: NavLink[];
  contactLabel: string;
  contactHref: string;
}

export const navigationConfig: NavigationConfig = {
  logo: "FM Consulting",
  links: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    // Appears once at least one project on /work is published (see src/data/work.ts).
    ...(workEnabled ? [{ label: "Work", href: "/work" }] : []),
    { label: "Why FM", href: "/why-fm" },
    { label: "Pricing", href: "/pricing" },
    { label: "Insights", href: "/insights" },
  ],
  contactLabel: "Book a consultation",
  contactHref: "/contact",
};

// Hero section configuration
export interface HeroConfig {
  headline: string;
  lede: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
}

export const heroConfig: HeroConfig = {
  headline: "Break the cycle of spend and hope.",
  lede: "FM Consulting finds where growth is leaking, fixes it, and builds the system that keeps it fixed: acquisition, conversion, retention and reporting tied back to revenue.",
  primaryCta: "Book a consultation",
  primaryHref: "/contact",
  secondaryCta: "See pricing",
  secondaryHref: "/pricing",
};

// About section configuration
export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutImage {
  src: string;
  alt: string;
}

export interface AboutConfig {
  label: string;
  heading: string;
  description: string;
  experienceValue: string;
  experienceLabel: string;
  stats: AboutStat[];
  images: AboutImage[];
}

export const aboutConfig: AboutConfig = {
  label: "About",
  heading: "Senior strategy without the agency overhead.",
  description: "FM Consulting is a South African business growth consultancy that operates at the intersection of strategy, data, and execution. We help SMEs, founder-led businesses, and established companies transform their commercial performance through disciplined, measurable approaches to growth. We do not chase vanity metrics. We build systems that improve efficiency, profitability, and long-term business performance.",
  experienceValue: "15+",
  experienceLabel: "Years of\nCombined Experience",
  stats: [
    { value: "25+", label: "Businesses\nAdvised" },
    { value: "R750M+", label: "Client Revenue\nInfluenced" },
    { value: "75%", label: "Client\nRetention" },
  ],
  images: [
    { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", alt: "Strategic planning session" },
    { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80", alt: "Analytics and data visualization" },
    { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80", alt: "Executive team collaboration" },
    { src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80", alt: "Professional workspace" },
  ],
};

// "Our view" statement on the home page. The link points at the Insights
// article that argues the same point at length.
export interface ViewConfig {
  label: string;
  heading: string;
  body: string;
  linkLabel: string;
  linkHref: string;
}

export const viewConfig: ViewConfig = {
  label: "Our view",
  heading: "Most businesses don't need more traffic. They need fewer leaks.",
  body: "Before another rand goes into reach, we find out where the current spend stops working: the ad that never reaches the right person, the enquiry nobody follows up, the customer who buys once and disappears.",
  linkLabel: "Read: Before you spend more on marketing",
  linkHref: "/insights/before-you-spend-more-on-marketing",
};

// Services section configuration
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesConfig {
  label: string;
  heading: string;
  intro: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  label: "Services",
  heading: "Six disciplines, one growth system.",
  intro: "Each one can be bought on its own. They work best together, because growth leaks between them as often as inside them.",
  services: [
    {
      iconName: "TrendingUp",
      title: "Growth Strategy",
      description: "Business growth planning, market opportunity analysis, channel strategy, and comprehensive growth roadmaps tailored to your commercial objectives.",
      image: "/images/service-1.jpg",
    },
    {
      iconName: "Target",
      title: "Digital Marketing Strategy",
      description: "Paid media strategy, digital channel planning, campaign architecture, audience strategy, and budget efficiency optimisation.",
      image: "/images/service-2.jpg",
    },
    {
      iconName: "Users",
      title: "Customer Acquisition",
      description: "Lead generation strategy, funnel design, campaign performance optimisation, conversion flow improvement, and acquisition efficiency.",
      image: "/images/service-3.jpg",
    },
    {
      iconName: "RefreshCw",
      title: "Customer Lifecycle & Retention",
      description: "Retention strategies, CRM thinking, lifecycle optimisation, customer journey enhancements, and loyalty programme development.",
      image: "/images/service-4.jpg",
    },
    {
      iconName: "BarChart3",
      title: "Analytics & Reporting",
      description: "Performance dashboards, KPI frameworks, campaign measurement, data interpretation, and decision-enabling reporting systems.",
      image: "/images/service-5.jpg",
    },
    {
      iconName: "Settings",
      title: "Business Performance Consulting",
      description: "Commercial diagnostics, process efficiency, digital transformation recommendations, and growth bottleneck identification.",
      image: "/images/service-6.jpg",
    },
  ],
};

// Portfolio/Case Studies section configuration
export interface ProjectItem {
  title: string;
  category: string;
  year: string;
  image: string;
  featured?: boolean;
}

export interface PortfolioCTA {
  label: string;
  heading: string;
  linkText: string;
  linkHref: string;
}

export interface PortfolioConfig {
  label: string;
  heading: string;
  description: string;
  projects: ProjectItem[];
  cta: PortfolioCTA;
  viewAllLabel: string;
}

export const portfolioConfig: PortfolioConfig = {
  label: "Work",
  heading: "Businesses we've helped grow.",
  description: "We work with ambitious companies in South Africa and abroad — hospitality, e-commerce, professional services and manufacturing. Each engagement is scoped to deliver measurable commercial outcomes.",
  // Longest-running engagement leads and carries `featured` (a double-width
  // hero card); the rest run newest first. A five-year retained client is the
  // strongest evidence on the page for the retention figure above.
  projects: [
    {
      title: "Lobster Tavern",
      category: "Hospitality",
      year: "2021 – Present",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
      featured: true,
    },
    {
      title: "International Tobacco Manufacturer",
      category: "FMCG / Manufacturing",
      year: "2026",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Mr Telly",
      category: "E-commerce",
      year: "2025",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Thynkverse",
      category: "Professional Services",
      year: "2024",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  cta: {
    label: "Ready to Grow?",
    heading: "Let's Discuss Your Business Goals",
    linkText: "Book a Consultation",
    linkHref: "/contact",
  },
  viewAllLabel: "View All Case Studies",
};

// Testimonials section configuration
//
// WARNING: the three entries below are placeholder copy from the original
// site build. The people named do not exist and the figures are invented.
// The section is currently NOT rendered (see HomePage.tsx). Do not restore
// it until every quote is real, attributed to a named person who has given
// permission, and carries figures you can evidence.
export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

export interface TestimonialsConfig {
  label: string;
  heading: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  label: "Client Testimonials",
  heading: "What Business Leaders Say",
  testimonials: [
    {
      quote: "FM Consulting transformed how we think about growth. They didn't just run campaigns—they built a complete acquisition system that increased our qualified leads by 180% while reducing cost per acquisition by 40%.",
      author: "Sarah Mitchell",
      role: "Managing Director",
      company: "The Reserve Restaurant Group",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      rating: 5,
    },
    {
      quote: "Finally, a consultancy that understands the difference between marketing activity and commercial outcomes. FM Consulting helped us identify where we were bleeding revenue and built a strategy that improved our bottom line by 35%.",
      author: "David Nkosi",
      role: "CEO",
      company: "Argus Advisory Partners",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
      rating: 5,
    },
    {
      quote: "The strategic clarity FM Consulting brought to our business was invaluable. They helped us understand our customer journey, optimise our funnel, and build a retention strategy that increased customer lifetime value by 60%.",
      author: "Emma van der Merwe",
      role: "Founder",
      company: "Luxe Home Collections",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      rating: 5,
    },
  ],
};

// CTA section configuration
export interface CTAConfig {
  label: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  email: string;
}

export const ctaConfig: CTAConfig = {
  label: "Contact",
  heading: "Tell us where growth is stuck.",
  description: "Book a consultation and you speak to a senior strategist from the first call. We respond within 24 hours.",
  buttonText: "Book a consultation",
  buttonHref: "/contact",
  email: "info@fmconsultingza.co.za",
};

// Footer section configuration: the mark and one line, how to reach us, and
// the legal links in the bottom bar. Page links live in the navigation only.
export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterConfig {
  tagline: string;
  socialLinks: SocialLink[];
  copyright: string;
}

export const footerConfig: FooterConfig = {
  tagline: "Strategy. Execution. Results.",
  // Official business profiles. An entry with an empty href is not rendered,
  // so a profile can be added here the moment its URL exists.
  socialLinks: [
    { iconName: "Linkedin", href: "", label: "LinkedIn" },
    { iconName: "Facebook", href: "https://www.facebook.com/823784920806684", label: "Facebook" },
    { iconName: "Instagram", href: "https://www.instagram.com/fmconsultingza/", label: "Instagram" },
    { iconName: "Twitter", href: "", label: "X (Twitter)" },
    {
      iconName: "MessageCircle",
      href: "https://wa.me/27628976939?text=Hi%20FM%20Consulting%2C%20I%20found%20you%20on%20your%20website.",
      label: "WhatsApp",
    },
  ],
  copyright: "© 2026 FM Consulting ZA (Pty) Ltd. All rights reserved.",
};

// Newsletter sign-up, shown at the foot of the Insights page.
export interface NewsletterConfig {
  heading: string;
  description: string;
  buttonText: string;
  placeholder: string;
}

export const newsletterConfig: NewsletterConfig = {
  heading: "Get new insights by email",
  description: "Practical pieces on growth strategy, performance marketing and getting more out of what you already spend. Unsubscribe at any time.",
  buttonText: "Subscribe",
  placeholder: "Your email address",
};

// Industries page configuration
export interface IndustryItem {
  name: string;
  description: string;
  challenges: string[];
  solutions: string[];
  image: string;
}

export interface IndustriesConfig {
  label: string;
  heading: string;
  description: string;
  industries: IndustryItem[];
}

export const industriesConfig: IndustriesConfig = {
  label: "Industries",
  heading: "Sectors We Serve",
  description: "We understand that different industries face unique commercial challenges. Our expertise spans multiple sectors, each with tailored strategies that address specific market dynamics.",
  industries: [
    {
      name: "Hospitality",
      description: "Restaurants, hotels, and experience-based businesses competing in a dynamic market where customer experience directly impacts revenue.",
      challenges: [
        "Seasonal demand fluctuations",
        "High customer acquisition costs",
        "Online reputation management",
        "Repeat visit optimisation",
      ],
      solutions: [
        "Reservation and booking funnel optimisation",
        "Customer loyalty and retention programmes",
        "Review and reputation strategy",
        "Revenue management consulting",
      ],
      image: "/images/portfolio-1.jpg",
    },
    {
      name: "Retail & E-commerce",
      description: "Physical and digital retailers navigating competitive landscapes, changing consumer behaviours, and margin pressures.",
      challenges: [
        "Cart abandonment and conversion",
        "Customer lifetime value optimisation",
        "Multi-channel attribution",
        "Inventory and demand planning",
      ],
      solutions: [
        "E-commerce conversion optimisation",
        "Customer acquisition strategy",
        "Email and retention marketing",
        "Performance analytics setup",
      ],
      image: "/images/portfolio-2.jpg",
    },
    {
      name: "Professional Services",
      description: "Law firms, consultancies, agencies, and service businesses where expertise is the product and trust is the currency.",
      challenges: [
        "Lead quality and qualification",
        "Long sales cycles",
        "Differentiation in crowded markets",
        "Client retention and expansion",
      ],
      solutions: [
        "Thought leadership and content strategy",
        "Lead generation and nurturing",
        "CRM and pipeline optimisation",
        "Client journey mapping",
      ],
      image: "/images/portfolio-3.jpg",
    },
    {
      name: "B2B & Technology",
      description: "SaaS companies, technology providers, and B2B organisations selling complex solutions to sophisticated buyers.",
      challenges: [
        "Complex buyer journeys",
        "Multiple stakeholder alignment",
        "Demo-to-close optimisation",
        "Churn and expansion revenue",
      ],
      solutions: [
        "Account-based marketing strategy",
        "Sales and marketing alignment",
        "Product-led growth consulting",
        "Customer success optimisation",
      ],
      image: "/images/portfolio-4.jpg",
    },
    {
      name: "SMEs & Founder-led Businesses",
      description: "Growing companies led by entrepreneurs who need strategic expertise without the overhead of a full in-house team.",
      challenges: [
        "Limited marketing resources",
        "Strategic clarity and focus",
        "Scaling customer acquisition",
        "Measuring what matters",
      ],
      solutions: [
        "Fractional CMO services",
        "Growth strategy development",
        "Marketing team structure",
        "Performance reporting systems",
      ],
      image: "/images/portfolio-5.jpg",
    },
    {
      name: "Consumer Services",
      description: "Home services, health and wellness, education, and other consumer-facing service businesses.",
      challenges: [
        "Local market competition",
        "Appointment and booking optimisation",
        "Customer reviews and referrals",
        "Service delivery consistency",
      ],
      solutions: [
        "Local SEO and presence strategy",
        "Booking funnel optimisation",
        "Referral programme development",
        "Customer experience design",
      ],
      image: "/images/service-6.jpg",
    },
  ],
};

// Why FM Consulting page configuration
export interface DifferentiatorItem {
  title: string;
  description: string;
  iconName: string;
}

export interface WhyFMConfig {
  label: string;
  heading: string;
  description: string;
  differentiators: DifferentiatorItem[];
  stats: AboutStat[];
}

export const whyFMConfig: WhyFMConfig = {
  label: "Why FM Consulting",
  heading: "Strategy Without Fluff. Performance With Accountability.",
  description: "Businesses choose FM Consulting because we combine strategic thinking with commercial discipline. We don't just recommend—we help you execute, measure, and optimise.",
  differentiators: [
    {
      title: "Commercially Grounded Thinking",
      description: "We understand that marketing must serve business outcomes. Every recommendation is evaluated through the lens of revenue, profitability, and sustainable growth.",
      iconName: "TrendingUp",
    },
    {
      title: "Strategic Plus Practical Execution",
      description: "We don't deliver thick strategy documents that gather dust. We build actionable plans and help you implement them with the right resources and timelines.",
      iconName: "Target",
    },
    {
      title: "Data-Informed Decision Making",
      description: "We believe in measuring what matters. Our analytics and reporting frameworks give you clear visibility into performance and ROI.",
      iconName: "BarChart3",
    },
    {
      title: "Performance Over Vanity",
      description: "We focus on metrics that drive business value—revenue, margin, customer lifetime value—not superficial engagement numbers that don't translate to growth.",
      iconName: "Award",
    },
    {
      title: "Cross-Functional Understanding",
      description: "We bring expertise across strategy, marketing, operations, and technology—enabling us to see connections and opportunities that siloed consultants miss.",
      iconName: "Layers",
    },
    {
      title: "Tailored Thinking, Not Templates",
      description: "Every business is unique. We develop customised strategies based on your specific market position, competitive landscape, and growth objectives.",
      iconName: "Settings",
    },
  ],
  stats: [
    { value: "2.5x", label: "Average ROI\nDelivered" },
    { value: "92%", label: "Client\nSatisfaction" },
    { value: "12", label: "Weeks Average\nTo First Results" },
  ],
};

// Insights page configuration. Article content lives in src/data/articles.ts.
export interface InsightsConfig {
  label: string;
  heading: string;
  description: string;
}

export const insightsConfig: InsightsConfig = {
  label: "Insights",
  heading: "Thoughts on Growth, Strategy & Performance",
  description: "Practical insights and strategic perspectives on building businesses that grow sustainably and profitably.",
};

// Contact page configuration
export interface ContactConfig {
  /** Web3Forms access key — form submissions are emailed to the address registered with this key. */
  web3formsKey: string;
  label: string;
  heading: string;
  description: string;
  formIntro: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  formFields: {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    budget: string;
  };
}

export const contactConfig: ContactConfig = {
  web3formsKey: "64aa6f02-a054-4ad0-87c6-bb0712d3b50c",
  label: "Contact",
  heading: "Let's Discuss Your Growth Goals",
  description: "Ready to improve your business performance? Book a consultation with our team. We'll explore your challenges, identify opportunities, and outline how we can help.",
  formIntro: "Fill out the form below and we'll respond within 24 hours.",
  contactInfo: {
    email: "info@fmconsultingza.co.za",
    phone: "+27 62 897 6939",
    address: "Cape Town, South Africa",
    hours: "Monday - Friday: 08:00 - 17:00 SAST",
  },
  formFields: {
    name: "Full Name",
    company: "Company Name",
    email: "Email Address",
    phone: "Phone Number",
    service: "Service Required",
    message: "Tell us about your business goals",
    budget: "Estimated Budget Range",
  },
};

// Process/How We Work configuration
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProcessConfig {
  label: string;
  heading: string;
  description: string;
  steps: ProcessStep[];
}

export const processConfig: ProcessConfig = {
  label: "Method",
  heading: "We diagnose before we build.",
  description: "Five stages, in order. Nothing gets built until we know what it has to fix and how we will measure it.",
  steps: [
    {
      number: "01",
      title: "Diagnose",
      description: "We analyse your current performance, identify bottlenecks, and understand your market position, competitive landscape, and growth constraints.",
    },
    {
      number: "02",
      title: "Define",
      description: "We establish clear objectives, define success metrics, and develop a strategic roadmap aligned with your business goals and resources.",
    },
    {
      number: "03",
      title: "Build",
      description: "We implement the systems, processes, and campaigns needed to execute the strategy, ensuring proper tracking and measurement.",
    },
    {
      number: "04",
      title: "Optimise",
      description: "We continuously analyse performance data, test improvements, and refine approaches to maximise efficiency and outcomes.",
    },
    {
      number: "05",
      title: "Scale",
      description: "Once we've proven what works, we help you scale your growth systems while maintaining efficiency and profitability.",
    },
  ],
};

