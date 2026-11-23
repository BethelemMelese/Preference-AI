import type { Metadata } from "next";
import Link from "next/link";
import { Download, Sparkles } from "lucide-react";

import { AIReportPanel } from "@/components/insights/ai-report-panel";
import { FactsPanel } from "@/components/insights/facts-panel";
import { PageHeader } from "@/components/shared/page-header";
import { Panel } from "@/components/shared/panel";
import { SoonButton } from "@/components/shared/soon-button";
import { formatRelativeDay } from "@/lib/format";
import {
  getCategoryProgress,
  getLowCoverageCategories,
  getStrongestCategories,
  groupItemsByDecision,
} from "@/lib/preferences/stats";
import { sampleCategories, sampleItems, samplePreferences, sampleReports } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Insights · PreferenceAI" };

export default async function InsightsPage({ searchParams }: PageProps<"/insights">) {
  const { report: reportParam } = await searchParams;
  const now = new Date();

  // Facts: always calculated from the current decisions.
  const progress = getCategoryProgress(sampleCategories, sampleItems, samplePreferences);
  const strongest = getStrongestCategories(sampleCategories, sampleItems, samplePreferences);
  const groups = groupItemsByDecision(sampleItems, samplePreferences);
  const lowCoverage = getLowCoverageCategories(progress);

  // AI report: the one picked via ?report=…, otherwise the newest.
  const report = sampleReports.find((r) => r.id === reportParam) ?? sampleReports[0];
  const newSince = report ? samplePreferences.length - report.basedOnDecisions : 0;

  return (
    <>
      <PageHeader
        title="Insights"
        description="What your answers show, and what the AI makes of them. The two are always kept separate."
        actions={
          <SoonButton variant="default">
            <Sparkles aria-hidden /> Generate new report
          </SoonButton>
        }
      />

      {report && newSince > 0 && (
        <p className="mb-6 rounded-lg bg-primary-soft px-4 py-3 text-body-md text-primary-soft-foreground">
          You have made {newSince} new decisions since this report. A new report would include them.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <FactsPanel strongest={strongest} groups={groups} lowCoverage={lowCoverage} />
          {report ? (
            <AIReportPanel report={report} now={now} />
          ) : (
            <Panel className="text-center text-body-md text-muted-foreground">
              No AI report yet. Generate one once you have rated at least 10 items.
            </Panel>
          )}
        </div>

        <Panel aria-labelledby="history-heading" className="lg:sticky lg:top-24">
          <h2 id="history-heading" className="text-headline-sm">
            Report history
          </h2>
          <ul className="mt-3 space-y-1">
            {sampleReports.map((r, i) => {
              const selected = r.id === report?.id;
              return (
                <li key={r.id}>
                  <Link
                    href={`/insights?report=${r.id}`}
                    aria-current={selected ? "page" : undefined}
                    scroll={false}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 transition-colors",
                      selected ? "bg-primary-soft" : "hover:bg-accent",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2 text-body-md font-medium">
                      <time dateTime={r.createdAt}>{formatRelativeDay(r.createdAt, now)}</time>
                      {i === 0 && (
                        <span className="rounded-full bg-card px-2 py-px text-label-sm text-muted-foreground">
                          Latest
                        </span>
                      )}
                    </span>
                    <span className="text-body-sm text-muted-foreground">
                      Based on {r.basedOnDecisions} decisions
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <SoonButton className="mt-4 w-full">
            <Download aria-hidden /> Download report
          </SoonButton>
        </Panel>
      </div>
    </>
  );
}
