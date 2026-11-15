"use client";
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { METRICS, formatValue, STATUS_LABELS } from "@/lib/analysis";
import type { Indicator, Result, Workspace } from "@/lib/types";

export default function MetricPlot({ workspace, day, result, selected, onSelect }: { workspace: Workspace; day: number; result: Result; selected: boolean; onSelect: (indicator: Indicator) => void }) {
  const metric = METRICS[result.indicator];
  const center = result.reference.median;
  const band = result.reference.threshold;
  const plotEnd = Math.max(28, Math.min(workspace.currentDay, Math.max(180, day)));
  const plotStart = Math.max(1, plotEnd - 179);
  const readings = new Map(workspace.checkIns.map(row => [row.day, row]));
  const ticks = plotEnd === 28 ? [1, 7, 14, 21, 28] : Array.from({ length: 5 }, (_, index) => Math.round(plotStart + (plotEnd - plotStart) * index / 4));
  const plot = Array.from({ length: plotEnd - plotStart + 1 }, (_, index) => {
    const missionDay = index + plotStart;
    const row = readings.get(missionDay);
    return { day: missionDay, value: missionDay <= day && !(result.indicator === "heartRate" && !row?.comparable) ? row?.[result.indicator] ?? null : null };
  });
  return <div className={`metric-row ${selected ? "is-selected" : ""}`}>
    <button className="metric-heading" onClick={() => onSelect(result.indicator)} aria-pressed={selected}>
      <span className="metric-name"><span className="metric-dot" style={{ background: metric.color }} />{metric.name}</span>
      <span className="metric-number">{formatValue(result.value, result.indicator)} <span>{metric.unit}</span></span>
      <span className={`metric-state ${result.status === "review" || result.status === "change" ? "text-amber" : ""}`}>{STATUS_LABELS[result.status]}</span>
      <span className="metric-reference">Reference {formatValue(center, result.indicator)} {metric.unit}</span>
    </button>
    <div className="plot" role="img" aria-label={`${metric.name} through mission day ${day}. ${STATUS_LABELS[result.status]}. Reference ${formatValue(center, result.indicator)} ${metric.unit}. Data table below.`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={plot} margin={{ top: 13, right: 15, bottom: 2, left: 0 }} accessibilityLayer>
          <CartesianGrid vertical={false} stroke="#E8EEEB" strokeDasharray="3 4" />
          <XAxis dataKey="day" type="number" domain={[plotStart, plotEnd]} ticks={ticks} tick={{ fontSize: 12, fill: "#536761" }} axisLine={false} tickLine={false} height={22} />
          <YAxis domain={result.indicator === "fatigue" ? [1, 5] : [(min: number) => Math.floor(Math.min(min, (center ?? min) - band) - (result.indicator === "sleep" ? .3 : 2)), (max: number) => Math.ceil(Math.max(max, (center ?? max) + (result.indicator === "sleep" ? .3 : band)) + (result.indicator === "sleep" ? .3 : 2))]} ticks={result.indicator === "fatigue" ? [1, 3, 5] : undefined} tick={{ fontSize: 11, fill: "#61736F" }} axisLine={false} tickLine={false} width={34} tickCount={3} />
          {plotStart <= workspace.referenceEnd && <ReferenceArea x1={Math.max(plotStart, workspace.referenceStart)} x2={Math.min(day, workspace.referenceEnd)} fill="#DBE9E4" fillOpacity={.55} />}
          {center !== null && <ReferenceLine y={center} stroke="#728A81" strokeDasharray="4 4" />}
          {center !== null && result.reference.sufficient && <ReferenceLine y={result.indicator === "sleep" ? center - band : center + (result.indicator === "fatigue" ? 2 : band)} stroke="#B3803E" strokeDasharray="2 5" />}
          {center !== null && result.reference.sufficient && result.indicator === "heartRate" && <ReferenceLine y={center - band} stroke="#B3803E" strokeDasharray="2 5" />}
          <ReferenceLine x={day} stroke="#182B3A" strokeOpacity={.65} strokeDasharray="3 3" />
          <Tooltip labelFormatter={value => `Mission day ${value}`} formatter={value => [value === undefined ? "Missing" : `${value} ${metric.unit}`, metric.short]} contentStyle={{ borderRadius: 8, border: "1px solid #D8E2DC", fontSize: 13 }} />
          <Line dataKey="value" type={result.indicator === "fatigue" ? "stepAfter" : "linear"} stroke={metric.color} strokeWidth={2} dot={{ r: 2.4, fill: "#fff", strokeWidth: 1.5 }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />
          {result.value !== null && <ReferenceDot x={day} y={result.value} r={5.5} fill={metric.color} stroke="#fff" strokeWidth={2.5} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>;
}
