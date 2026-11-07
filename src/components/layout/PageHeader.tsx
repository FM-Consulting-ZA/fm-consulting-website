import type { ReactNode } from 'react';

/*
 * Opening block for inner pages: the label in the left index column, the
 * page title and one paragraph on columns 4-12. Same grid and type as the
 * home page sections, so every page starts at the same x position.
 */
interface PageHeaderProps {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ label, title, intro, children }: PageHeaderProps) {
  return (
    <section className="w-full bg-fm-paper text-fm-ink pt-32 lg:pt-44 pb-16 lg:pb-24">
      <div className="container-large px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <p className="fm-meta col-span-12 lg:col-span-3 lg:pt-4 text-fm-graphite">{label}</p>
          <div className="col-span-12 lg:col-span-9">
            <h1 className="fm-display-1 max-w-[15ch]">{title}</h1>
            {intro && <div className="fm-lede mt-8 lg:mt-10 max-w-[40rem] text-fm-graphite">{intro}</div>}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
