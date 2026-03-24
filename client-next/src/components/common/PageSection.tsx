import { ReactNode } from "react";

type PageSectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function PageSection({ id, title, subtitle, children, className }: PageSectionProps) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {title ? (
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
