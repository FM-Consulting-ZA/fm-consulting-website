import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { CTA } from '@/sections/CTA';

const serviceDetails = [
  {
    title: "Growth Strategy",
    overview: "We help you define and execute a clear path to sustainable business growth.",
    problems: [
      "Unclear growth priorities and resource allocation",
      "Lack of market opportunity analysis",
      "Inconsistent channel performance",
      "No structured growth roadmap"
    ],
    outcomes: [
      "Clear growth objectives and KPIs",
      "Prioritised market opportunities",
      "Optimised channel mix and budget allocation",
      "Actionable 12-month growth roadmap"
    ],
    features: [
      "Business growth planning",
      "Market opportunity analysis",
      "Channel strategy development",
      "Customer journey mapping",
      "Growth roadmap creation"
    ]
  },
  {
    title: "Digital Marketing Strategy",
    overview: "Strategic planning and execution for digital channels that drive measurable results.",
    problems: [
      "Wasted ad spend on underperforming channels",
      "Poor campaign structure and targeting",
      "Unclear audience segmentation",
      "Inefficient budget allocation"
    ],
    outcomes: [
      "Improved ROAS and cost per acquisition",
      "Better audience targeting and messaging",
      "Streamlined campaign architecture",
      "Data-driven budget optimisation"
    ],
    features: [
      "Paid media strategy (Google, Meta, LinkedIn)",
      "Digital channel planning",
      "Campaign architecture design",
      "Audience strategy and segmentation",
      "Budget efficiency planning"
    ]
  },
  {
    title: "Customer Acquisition",
    overview: "Build systems that consistently attract and convert high-quality customers.",
    problems: [
      "Low lead volume or poor lead quality",
      "High cost per acquisition",
      "Leaky conversion funnels",
      "Inconsistent acquisition performance"
    ],
    outcomes: [
      "Increased qualified lead volume",
      "Reduced customer acquisition costs",
      "Improved conversion rates",
      "Scalable acquisition systems"
    ],
    features: [
      "Lead generation strategy",
      "Funnel design and optimisation",
      "Landing page and CRO",
      "Campaign performance management",
      "Acquisition efficiency analysis"
    ]
  },
  {
    title: "Customer Lifecycle & Retention",
    overview: "Maximise customer lifetime value through strategic retention and loyalty programmes.",
    problems: [
      "High customer churn rates",
      "Low repeat purchase frequency",
      "Underutilised customer database",
      "Disconnected customer touchpoints"
    ],
    outcomes: [
      "Improved customer retention rates",
      "Increased repeat purchase frequency",
      "Higher customer lifetime value",
      "Stronger customer relationships"
    ],
    features: [
      "Retention strategy development",
      "CRM strategy and implementation",
      "Lifecycle marketing automation",
      "Customer journey optimisation",
      "Loyalty programme design"
    ]
  },
  {
    title: "Analytics & Reporting",
    overview: "Turn data into actionable insights with comprehensive measurement frameworks.",
    problems: [
      "Lack of visibility into marketing performance",
      "No clear KPIs or success metrics",
      "Data scattered across platforms",
      "Inability to attribute results"
    ],
    outcomes: [
      "Clear performance dashboards",
      "Defined KPIs and targets",
      "Unified data and reporting",
      "Improved decision-making speed"
    ],
    features: [
      "Performance dashboard setup",
      "KPI framework development",
      "Campaign measurement and attribution",
      "Data interpretation and insights",
      "Decision-enabling reporting"
    ]
  },
  {
    title: "Business Performance Consulting",
    overview: "Identify and remove bottlenecks to improve overall business performance.",
    problems: [
      "Unclear where revenue is being lost",
      "Inefficient processes and workflows",
      "Misalignment between teams",
      "Difficulty scaling operations"
    ],
    outcomes: [
      "Identified revenue opportunities",
      "Streamlined processes",
      "Improved team alignment",
      "Scalable growth systems"
    ],
    features: [
      "Commercial diagnostics",
      "Process efficiency analysis",
      "Digital transformation roadmap",
      "Operational alignment consulting",
      "Growth bottleneck identification"
    ]
  }
];

const columns = [
  { key: 'problems', title: 'Problems we solve' },
  { key: 'outcomes', title: 'Outcomes we deliver' },
  { key: 'features', title: "What's included" },
] as const;

export function ServicesPage() {
  const total = String(serviceDetails.length).padStart(2, '0');

  return (
    <div className="w-full">
      <PageHeader
        label="Services"
        title="Six disciplines, one growth system."
        intro="Consulting that helps you acquire more customers, keep them longer and run the business more efficiently. Each service can be bought on its own; they work best together."
      >
        <nav aria-label="Services on this page" className="mt-12 lg:mt-16 border-t border-fm-ink">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
            {serviceDetails.map((service, index) => (
              <li key={service.title} className="border-b border-fm-silver">
                <a
                  href={`#service-${index + 1}`}
                  className="flex items-baseline gap-4 py-4 text-fm-ink hover:text-fm-graphite transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fm-ink"
                >
                  <span className="fm-meta text-fm-graphite">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-base">{service.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {serviceDetails.map((service, index) => (
        <Section
          key={service.title}
          id={`service-${index + 1}`}
          tone={index % 2 === 0 ? 'white' : 'paper'}
          label={`${String(index + 1).padStart(2, '0')} / ${total}`}
          heading={service.title}
          intro={<p>{service.overview}</p>}
          className="scroll-mt-20"
        >
          <div className="grid md:grid-cols-3 gap-x-6 gap-y-10">
            {columns.map((col) => (
              <div key={col.key}>
                <h3 className="fm-meta text-fm-graphite">{col.title}</h3>
                <ul className="mt-4 border-t border-fm-ink">
                  {service[col.key].map((item) => (
                    <li key={item} className="py-3 border-b border-fm-silver fm-body text-fm-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="fm-link inline-block mt-10 text-base text-fm-ink decoration-fm-silver hover:decoration-fm-ink"
          >
            Discuss {service.title.toLowerCase()}
          </Link>
        </Section>
      ))}

      <CTA />
    </div>
  );
}
