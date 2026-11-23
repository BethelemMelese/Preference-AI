import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Panel } from "@/components/shared/panel";
import { SourceBadge } from "@/components/shared/source-badge";
import { formatRelativeDay } from "@/lib/format";
import type { AIReport } from "@/types/preferences";

const MIN_DECISIONS_FOR_REPORT = 10;

type LatestInsightProps = {
  report: AIReport | undefined;
  totalDecisions: number;
  now: Date;
};

/** Teaser of the newest AI report (Module 1 "recent AI reports"). Clearly
 *  labelled AI-generated; the full report lives on /insights. */
export function LatestInsight({ report, totalDecisions, now }: LatestInsightProps) {
  return (
    <Panel aria-labelledby="insight-heading" className="flex flex-col bg-linear-to-br from-primary-soft/70 to-card">
      <div className="flex items-center justify-between gap-3">
        <h2 id="insight-heading" className="text-headline-sm">
          Latest insight
        </h2>
        <SourceBadge source="ai" />
      </div>

      {report ? (
        <>
          <p className="mt-4 line-clamp-5 text-body-lg">{report.content.overview}</p>
          <p className="mt-3 text-body-sm text-muted-foreground">
            Based on {report.basedOnDecisions} decisions ·{" "}
            <time dateTime={report.createdAt}>{formatRelativeDay(report.createdAt, now)}</time>
          </p>
          <Link
            href="/insights"
            className="mt-auto inline-flex items-center gap-1.5 pt-5 text-label-md text-primary hover:underline"
          >
            Read the full report <ArrowRight className="size-4" aria-hidden />
          </Link>
        </>
      ) : (
        <p className="mt-4 text-body-md text-muted-foreground">
          {totalDecisions < MIN_DECISIONS_FOR_REPORT
            ? `Rate ${MIN_DECISIONS_FOR_REPORT - totalDecisions} more items to unlock your first AI report.`
            : "You have enough decisions for your first AI report."}
        </p>
      )}
    </Panel>
  );
}
