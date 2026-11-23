type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  /** Buttons on the right (desktop) / below (mobile). */
  actions?: React.ReactNode;
};

/** The same title block on every page, so pages feel like one product. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-headline-lg-mobile md:text-headline-lg">{title}</h1>
        {description && (
          <p className="mt-2 text-body-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
