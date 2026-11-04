import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Seo } from '@/components/Seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { AnimatedButton } from '@/components/AnimatedButton';
import { SiteViewer } from '@/components/work/SiteViewer';
import { hostOf, kindLabel, visibleWork, type WorkProject } from '@/data/work';

/** A card opens the viewer only when there is something to show in it. */
const canView = (p: WorkProject) => (p.view === 'video' ? !!p.video : !!p.url);

function CardVisual({ project }: { project: WorkProject }) {
  if (project.poster) {
    return (
      <img
        src={project.poster}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 bg-fm-ink">
      <span className="fm-display-1 text-fm-paper transition-transform duration-700 ease-out-quart group-hover:-translate-y-1">
        {project.client}
      </span>
      {project.url && (
        <span className="mt-4 fm-meta text-fm-paper/45">
          {hostOf(project.url)}
        </span>
      )}
    </div>
  );
}

function WorkCard({ project, index }: { project: WorkProject; index: number }) {
  const viewable = canView(project);

  const visual = (
    <div className="relative aspect-[16/10] overflow-hidden bg-fm-mist">
      <CardVisual project={project} />

      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-3 py-1.5 bg-fm-paper fm-meta text-fm-ink">
          {kindLabel[project.kind]}
        </span>
        {!project.published && (
          <span
            title={project.clearance}
            className="px-3 py-1.5 bg-amber-300 fm-meta text-fm-ink"
          >
            Draft · hidden on live site
          </span>
        )}
      </div>

      {viewable && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-fm-paper px-4 py-2 fm-meta text-fm-ink opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
          View site
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
        </div>
      )}
    </div>
  );

  const body = (
    <div className="mt-5 border-t border-fm-ink pt-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="fm-display-3 text-fm-ink">{project.client}</h3>
        <span className="shrink-0 fm-meta text-fm-graphite">{project.year}</span>
      </div>
      <p className="mt-2 fm-meta text-fm-graphite">{project.sector}</p>
      <p className="mt-4 max-w-xl fm-body text-fm-graphite">{project.summary}</p>
      {project.credit && <p className="mt-3 text-sm text-fm-graphite/80">{project.credit}</p>}
      {!viewable && <p className="mt-3 fm-meta text-fm-graphite/70">Preview to follow</p>}
    </div>
  );

  return (
    <Reveal delay={(index % 2) * 0.08} y={24}>
      {viewable ? (
        <Link
          to={`/work/${project.slug}`}
          state={{ fromIndex: true }}
          className="group block focus:outline-none"
          aria-label={`View the ${project.client} site`}
        >
          {visual}
          {body}
        </Link>
      ) : (
        <div className="group">
          {visual}
          {body}
        </div>
      )}
    </Reveal>
  );
}

export function WorkPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const active = visibleWork.find((p) => p.slug === slug && canView(p)) ?? null;

  const close = () => {
    if ((location.state as { fromIndex?: boolean } | null)?.fromIndex) navigate(-1);
    else navigate('/work', { replace: true });
  };

  return (
    <div className="w-full">
      {active ? (
        <Seo
          title={`${active.client} | Work`}
          description={active.summary}
          path={`/work/${active.slug}`}
          noIndex={!active.published}
        />
      ) : (
        <Seo
          title="Work"
          description="Sites FM Consulting has built and shaped, from client launches to concept builds. Open any of them without leaving this page."
          path="/work"
        />
      )}

      <PageHeader
        label="Work"
        title="Use the work, don’t just look at it."
        intro="Open any project and the real site runs right here. Live sites are in use by the client. Concepts are builds made to show a business what its next site could do."
      />

      <Section tone="white" label="Projects" heading="Built and shaped by FM." wide>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-16 lg:gap-y-20">
          {visibleWork.map((project, i) => (
            <WorkCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </Section>

      <Section
        tone="ink"
        compact
        label="Your site"
        heading="Want to see yours before you commit?"
        intro={
          <p>
            Most of these started as a concept. If your site is holding the business back, book a call and we will talk
            through what a rebuild would change.
          </p>
        }
        className="pb-0 lg:pb-0"
      >
        <AnimatedButton to="/contact" variant="secondary" size="lg" className="border-fm-paper">
          Book a call
        </AnimatedButton>
      </Section>

      <SiteViewer project={active} onClose={close} />
    </div>
  );
}
