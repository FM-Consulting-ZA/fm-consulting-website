import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { articles, type RichTextSegment } from '@/data/articles';
import { CTA } from '@/sections/CTA';

function RichText({ segments }: { segments: RichTextSegment[] }) {
  return (
    <>
      {segments.map((segment, index) => (
        <Fragment key={`${segment.text}-${index}`}>
          {segment.href ? (
            <a href={segment.href} target="_blank" rel="noreferrer" className="editorial-link">
              {segment.text}
            </a>
          ) : (
            segment.text
          )}
        </Fragment>
      ))}
    </>
  );
}

function createHeadingId(text: string, index: number) {
  const readableId = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return `${readableId || 'section'}-${index + 1}`;
}

export function ArticlePage() {
  const { slug } = useParams();
  const articleIndex = articles.findIndex((item) => item.slug === slug);
  const article = articles[articleIndex];

  if (!article) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh]">
        <Seo title="Article not found" description="The requested FM Consulting insight could not be found." path="/insights" noIndex />
        <div className="container-large px-6 lg:px-12 text-center">
          <p className="text-xs font-geist-mono uppercase tracking-widest text-exvia-black/50">404</p>
          <h1 className="text-4xl lg:text-6xl font-semibold mt-5">This article is not available.</h1>
          <Link to="/insights" className="inline-flex items-center gap-2 mt-8 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const previousArticle = articles[articleIndex - 1];
  const nextArticle = articles[articleIndex + 1];
  const canonicalPath = `/insights/${article.slug}`;
  const issueNumber = String(article.number).padStart(2, '0');
  const firstParagraphIndex = article.blocks.findIndex((block) => block.type === 'paragraph');
  const headings = article.blocks.flatMap((block, blockIndex) => (
    block.type === 'heading'
      ? [{ blockIndex, id: createHeadingId(block.text, blockIndex), text: block.text }]
      : []
  ));
  const headingNumbers = new Map(headings.map((heading, index) => [heading.blockIndex, index + 1]));
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: `https://www.fmconsultingza.co.za${article.image}`,
    datePublished: article.publishedTime,
    dateModified: article.publishedTime,
    author: {
      '@type': 'Organization',
      name: article.byline,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FM Consulting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.fmconsultingza.co.za/icon-512.png',
      },
    },
    mainEntityOfPage: `https://www.fmconsultingza.co.za${canonicalPath}`,
  };

  return (
    <article className="editorial-article w-full bg-white">
      <Seo
        title={article.title}
        description={article.excerpt}
        path={canonicalPath}
        image={article.image}
        imageAlt={article.imageAlt}
        type="article"
        publishedTime={article.publishedTime}
        author={article.byline}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="bg-fm-paper text-fm-ink pt-32 lg:pt-44 pb-14 lg:pb-20">
        <div className="container-large px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 lg:col-span-3 lg:pt-4">
              <Link
                to="/insights"
                className="fm-link fm-meta text-fm-graphite decoration-fm-silver hover:text-fm-ink hover:decoration-fm-ink"
              >
                All insights
              </Link>
              <dl className="mt-8 hidden lg:block">
                {[
                  ['Insight', `${issueNumber} / ${String(articles.length).padStart(2, '0')}`],
                  ['Topic', article.category],
                  ['By', article.byline],
                ].map(([term, value]) => (
                  <div key={term} className="py-3 border-t border-fm-silver">
                    <dt className="fm-meta text-fm-graphite">{term}</dt>
                    <dd className="mt-1 text-sm text-fm-ink">{value}</dd>
                  </div>
                ))}
                <div className="py-3 border-t border-fm-silver">
                  <dt className="fm-meta text-fm-graphite">Published</dt>
                  <dd className="mt-1 text-sm text-fm-ink"><time dateTime={article.publishedTime}>{article.date}</time></dd>
                </div>
                <div className="py-3 border-y border-fm-silver">
                  <dt className="fm-meta text-fm-graphite">Reading time</dt>
                  <dd className="mt-1 text-sm text-fm-ink">{article.readTime}</dd>
                </div>
              </dl>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h1 className="fm-display-1 max-w-[15ch]">{article.title}</h1>
              <p className="fm-lede mt-8 lg:mt-10 max-w-[40rem] text-fm-graphite">{article.excerpt}</p>
              <p className="lg:hidden mt-8 fm-meta text-fm-graphite">
                {article.category} <span aria-hidden="true">/</span> <time dateTime={article.publishedTime}>{article.date}</time>{' '}
                <span aria-hidden="true">/</span> {article.readTime}
              </p>
            </div>
          </div>
        </div>
      </header>

      <figure className="bg-white container-large px-6 lg:px-12 pt-12 lg:pt-16 grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-start-4 lg:col-span-9">
        <div className="editorial-hero-media overflow-hidden bg-fm-mist">
          <img src={article.image} alt={article.imageAlt} className="editorial-hero-image w-full h-full object-cover" fetchPriority="high" />
        </div>
        <figcaption className="grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-8 pt-3 text-xs leading-relaxed text-fm-graphite">
          <span>{article.imageAlt}</span>
          <span>
            Image /{' '}
            <a href={article.imageSource} target="_blank" rel="noreferrer" className="hover:text-exvia-black underline underline-offset-4">
              {article.imageCredit}
            </a>
          </span>
        </figcaption>
        </div>
      </figure>

      <section className="bg-white">
        <div className="container-large px-6 lg:px-12 py-14 lg:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <aside className="hidden lg:block lg:col-span-3 pr-6">
              <div className="sticky top-28 border-t border-fm-ink pt-5">
                <p className="fm-meta text-fm-graphite">In this article</p>
                <ol className="mt-6 space-y-4">
                  {headings.map((heading, index) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="editorial-toc-link group grid grid-cols-[1.8rem_1fr] gap-2 text-sm leading-snug text-exvia-black/55 hover:text-exvia-black transition-colors">
                        <span className="font-geist-mono text-[0.6rem] pt-0.5 text-exvia-black/35 group-hover:text-exvia-black">{String(index + 1).padStart(2, '0')}</span>
                        <span>{heading.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="lg:col-span-9 max-w-[48rem]">
              <details className="editorial-mobile-toc lg:hidden mb-12 border-y border-exvia-border py-4">
                <summary className="font-geist-mono text-[0.68rem] uppercase tracking-[0.15em] text-exvia-black cursor-pointer">In this article</summary>
                <ol className="mt-5 space-y-3 pb-2">
                  {headings.map((heading, index) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="grid grid-cols-[1.75rem_1fr] gap-2 text-sm leading-snug text-exvia-black/65">
                        <span className="font-geist-mono text-[0.6rem] pt-0.5 text-exvia-black/35">{String(index + 1).padStart(2, '0')}</span>
                        <span>{heading.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <div className="editorial-prose">

                {article.blocks.map((block, index) => {
                  if (block.type === 'heading') {
                    const sectionNumber = headingNumbers.get(index) || 1;
                    const headingId = createHeadingId(block.text, index);
                    const isSourcesHeading = /^sources\b/i.test(block.text);
                    return (
                      <h2 key={`${block.text}-${index}`} id={headingId} className={`editorial-section-heading ${isSourcesHeading ? 'editorial-sources-heading' : ''}`}>
                        <span className="editorial-section-number">{String(sectionNumber).padStart(2, '0')}</span>
                        <span>{block.text}</span>
                      </h2>
                    );
                  }

                  if (block.type === 'list') {
                    const previousBlock = article.blocks[index - 1];
                    const isSourcesList = previousBlock?.type === 'heading' && /^sources\b/i.test(previousBlock.text);
                    const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
                    return (
                      <ListTag key={`list-${index}`} className={`editorial-list ${block.style === 'ordered' ? 'editorial-list-ordered' : 'editorial-list-unordered'} ${isSourcesList ? 'editorial-sources-list' : ''}`}>
                        {block.items.map((item, itemIndex) => (
                          <li key={`item-${itemIndex}`}><span><RichText segments={item} /></span></li>
                        ))}
                      </ListTag>
                    );
                  }

                  if (block.type === 'note') {
                    return (
                      <aside key={`note-${index}`} className="editorial-note">
                        <span className="editorial-note-label">Note</span>
                        <p><RichText segments={block.content} /></p>
                      </aside>
                    );
                  }

                  return (
                    <p key={`paragraph-${index}`} className={index === firstParagraphIndex ? 'editorial-lede' : 'editorial-paragraph'}>
                      <RichText segments={block.content} />
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="More FM Consulting insights" className="bg-fm-paper text-fm-ink fm-section">
        <div className="container-large px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-fm-ink pt-6 lg:pt-8">
            <p className="fm-meta col-span-12 lg:col-span-3 lg:pt-3 text-fm-graphite">Continue reading</p>
            <div className="col-span-12 lg:col-span-9 grid md:grid-cols-2 gap-x-6 gap-y-10">
              {[
                previousArticle && { label: 'Previous insight', item: previousArticle },
                nextArticle && { label: 'Next insight', item: nextArticle },
              ]
                .filter(Boolean)
                .map((entry) => {
                  const { label, item } = entry as { label: string; item: typeof article };
                  return (
                    <Link
                      key={item.slug}
                      to={`/insights/${item.slug}`}
                      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fm-ink"
                    >
                      <span className="fm-meta text-fm-graphite">{label}</span>
                      <span className="fm-display-3 block mt-3 text-fm-ink group-hover:text-fm-graphite transition-colors">
                        {item.title}
                      </span>
                      <span className="fm-body block mt-3 text-fm-graphite line-clamp-2">{item.excerpt}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </nav>

      <CTA />
    </article>
  );
}
