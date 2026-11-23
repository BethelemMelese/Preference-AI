import { Panel } from "@/components/shared/panel";
import { SourceBadge } from "@/components/shared/source-badge";
import { formatRelativeDay } from "@/lib/format";
import type { AIReport } from "@/types/preferences";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-headline-sm">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-body-md text-muted-foreground marker:text-primary">
      {items.map((text) => (
        <li key={text}>{text}</li>
      ))}
    </ul>
  );
}

/** INTERPRETATION: produced by the AI from the decisions above. Labelled,
 *  dated, and tied to how many decisions it was based on. */
export function AIReportPanel({ report, now }: { report: AIReport; now: Date }) {
  const { content } = report;
  return (
    <Panel aria-labelledby="ai-heading" className="bg-linear-to-br from-primary-soft/50 to-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ai-heading" className="text-headline-md">
          What the AI makes of it
        </h2>
        <SourceBadge source="ai" />
      </div>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Based on {report.basedOnDecisions} decisions ·{" "}
        <time dateTime={report.createdAt}>{formatRelativeDay(report.createdAt, now)}</time>
      </p>

      <p className="mt-5 text-body-lg">{content.overview}</p>

      <Section title="Patterns">
        <BulletList items={content.patterns} />
      </Section>
      <Section title="Connections between your interests">
        <BulletList items={content.connections} />
      </Section>
      <Section title="Recommendations">
        <ul className="grid gap-3 sm:grid-cols-2">
          {content.recommendations.map((r) => (
            <li key={r.title} className="rounded-lg border border-border/60 bg-card p-4">
              <p className="text-body-md font-medium">{r.title}</p>
              <p className="mt-1 text-body-sm text-muted-foreground">{r.reason}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Worth exploring">
        <BulletList items={content.worthExploring} />
      </Section>

      <p className="mt-6 border-t border-border/60 pt-4 text-body-sm text-muted-foreground">
        This is an AI interpretation of your answers. It may be wrong, and it never changes them.
      </p>
    </Panel>
  );
}
