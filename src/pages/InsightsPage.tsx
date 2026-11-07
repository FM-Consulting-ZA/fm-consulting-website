import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { insightsConfig } from '@/config';
import { articles } from '@/data/articles';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { CTA } from '@/sections/CTA';

/** Insights as an editorial index: the latest piece, then every piece as a row. */
export function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(articles.map((article) => article.category)))];
  const featured = articles[0];
  const listed = activeCategory === 'All' ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="w-full">
      <PageHeader
        label={insightsConfig.label}
        title="Thoughts on growth, strategy and performance."
        intro={insightsConfig.description}
      />

      <Section
        tone="white"
        label="Latest"
        heading={
          <Link to={`/insights/${featured.slug}`} className="hover:text-fm-graphite transition-colors">
            {featured.title}
          </Link>
        }
        intro={<p>{featured.excerpt}</p>}
      >
        <Link
          to={`/insights/${featured.slug}`}
          className="group block border-t border-fm-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-ink"
          aria-label={`Read ${featured.title}`}
        >
          <div className="aspect-[16/8] overflow-hidden bg-fm-mist">
            <img
              src={featured.image}
              alt={featured.imageAlt}
              className="editorial-hero-image h-full w-full object-cover"
              fetchPriority="high"
            />
          </div>
          <p className="mt-5 flex flex-wrap gap-x-8 gap-y-2 fm-meta text-fm-graphite">
            <span>{featured.category}</span>
            <span>{featured.date}</span>
            <span>{featured.readTime}</span>
          </p>
        </Link>
      </Section>

      <Section tone="paper" id="latest-articles" label="All insights" heading="The complete series." className="scroll-mt-20">
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8" role="group" aria-label="Filter by topic">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={cn(
                'text-base pb-1 border-b transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-ink',
                activeCategory === category
                  ? 'text-fm-ink border-fm-ink'
                  : 'text-fm-graphite border-transparent hover:text-fm-ink'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <ul className="border-t border-fm-ink">
          {listed.map((article) => (
            <li key={article.slug} className="border-b border-fm-silver">
              <Link
                to={`/insights/${article.slug}`}
                className="group grid grid-cols-9 gap-x-6 gap-y-2 py-6 lg:py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fm-ink"
              >
                <span className="col-span-9 md:col-span-2 fm-meta text-fm-graphite md:pt-2">{article.date}</span>
                <span className="col-span-9 md:col-span-5">
                  <span className="fm-display-3 block text-fm-ink group-hover:text-fm-graphite transition-colors">
                    {article.title}
                  </span>
                  <span className="fm-body block mt-2 text-fm-graphite line-clamp-2">{article.excerpt}</span>
                </span>
                <span className="col-span-9 md:col-span-2 md:text-right fm-meta text-fm-graphite md:pt-2">
                  {article.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <NewsletterSignup />
      <CTA />
    </div>
  );
}
