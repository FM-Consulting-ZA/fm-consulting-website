import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedButton } from '@/components/AnimatedButton';
import { Reveal } from '@/components/motion/Reveal';
import { Seo } from '@/components/Seo';
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
      <span className="text-4xl lg:text-6xl font-semibold tracking-tight text-white leading-none transition-transform duration-700 ease-out-quart group-hover:-translate-y-1">
        {project.client}
      </span>
      {project.url && (
        <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
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
        <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm font-mono text-[10px] uppercase tracking-[0.14em] text-fm-ink">
          {kindLabel[project.kind]}
        </span>
        {!project.published && (
          <span
            title={project.clearance}
            className="px-3 py-1.5 rounded-full bg-amber-300 font-mono text-[10px] uppercase tracking-[0.14em] text-fm-ink"
          >
            Draft · hidden on live site
          </span>
        )}
      </div>

      {viewable && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fm-ink opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
          View site
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
        </div>
      )}
    </div>
  );

  const body = (
    <div className="mt-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-fm-ink">{project.client}</h2>
        <span className="shrink-0 font-mono text-xs text-fm-graphite">{project.year}</span>
      </div>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fm-graphite">{project.sector}</p>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-fm-graphite">{project.summary}</p>
      {project.credit && <p className="mt-3 text-sm text-fm-graphite/80">{project.credit}</p>}
      {!viewable && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fm-silver">Preview to follow</p>
      )}
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
    <div className="w-full pt-24 lg:pt-32 bg-white">
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

      <section className="w-full pb-16 lg:pb-20">
        <div className="container-large px-6 lg:px-12">
          <Reveal y={16}>
            <span className="text-xs font-geist-mono uppercase tracking-widest text-exvia-black/50">Work</span>
          </Reveal>
          <Reveal delay={0.08} y={20}>
            <h1 className="mt-6 max-w-4xl text-4xl lg:text-6xl font-semibold leading-tight tracking-tight text-fm-ink">
              Use the work, don’t just look at it.
            </h1>
          </Reveal>
          <Reveal delay={0.16} y={20}>
            <p className="mt-6 max-w-2xl text-lg lg:text-xl leading-relaxed text-fm-graphite">
              Open any project and the real site runs right here. Live sites are in use by the client. Concepts are
              builds made to show a business what its next site could do.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="w-full pb-24 lg:pb-32">
        <div className="container-large px-6 lg:px-12 grid md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-20">
          {visibleWork.map((project, i) => (
            <WorkCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <section className="w-full bg-fm-ink text-white">
        <div className="container-large px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight leading-tight">
              Want to see yours before you commit?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Most of these started as a concept. If your site is holding the business back, book a call and we will
              talk through what a rebuild would change.
            </p>
          </div>
          <AnimatedButton to="/contact" variant="outline-white" size="lg" showIcon>
            Book a call
          </AnimatedButton>
        </div>
      </section>

      <SiteViewer project={active} onClose={close} />
    </div>
  );
}
