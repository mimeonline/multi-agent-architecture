import type { Diagram, Domain } from "../types/pattern";

type Props = {
  diagram: Diagram;
  domain: Domain;
};

const W = 560;
const H = 220;

function NodeBox({
  x,
  y,
  w,
  h,
  label,
  variant = "solid",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  variant?: "solid" | "outline" | "dashed" | "muted";
}) {
  const fill = variant === "solid" ? "var(--diag-fill)" : "var(--diag-bg)";
  const stroke = variant === "muted" ? "var(--line)" : "var(--diag-stroke)";
  const dashed = variant === "dashed" ? "4 4" : undefined;
  const textColor = variant === "solid" ? "var(--diag-fg-on)" : "var(--ink)";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={dashed}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill={textColor}
      >
        {label}
      </text>
    </g>
  );
}

function NodeCircle({ cx, cy, r, label }: { cx: number; cy: number; r: number; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--diag-fill)" stroke="var(--diag-stroke)" strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--diag-fg-on)">
        {label}
      </text>
    </g>
  );
}

function Cylinder({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const ry = 7;
  return (
    <g>
      <path
        d={`M ${x} ${y + ry} a ${w / 2} ${ry} 0 0 1 ${w} 0 v ${h - 2 * ry} a ${w / 2} ${ry} 0 0 1 ${-w} 0 z`}
        fill="var(--diag-bg)"
        stroke="var(--diag-stroke)"
        strokeWidth={1.5}
      />
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} fill="none" stroke="var(--diag-stroke)" strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
        {label}
      </text>
    </g>
  );
}

function Arrow({
  from,
  to,
  curved = false,
  dashed = false,
  label,
}: {
  from: [number, number];
  to: [number, number];
  curved?: boolean;
  dashed?: boolean;
  label?: string;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const d = curved
    ? `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="var(--diag-edge)"
        strokeWidth={1.5}
        strokeDasharray={dashed ? "4 4" : undefined}
        markerEnd="url(#arrow)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 6}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill="var(--muted)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--diag-edge)" />
      </marker>
    </defs>
  );
}

function LoopShape({ nodes }: { nodes: string[] }) {
  const [a, b, c] = [nodes[0] ?? "Thought", nodes[1] ?? "Action", nodes[2] ?? "Observation"];
  const boxW = 130;
  const boxH = 52;
  const cy = 90;
  const x1 = 50;
  const x2 = 215;
  const x3 = 380;
  return (
    <>
      <NodeBox x={x1} y={cy} w={boxW} h={boxH} label={a} variant="solid" />
      <NodeBox x={x2} y={cy} w={boxW} h={boxH} label={b} variant="outline" />
      <NodeBox x={x3} y={cy} w={boxW} h={boxH} label={c} variant="outline" />
      <Arrow from={[x1 + boxW, cy + boxH / 2]} to={[x2, cy + boxH / 2]} />
      <Arrow from={[x2 + boxW, cy + boxH / 2]} to={[x3, cy + boxH / 2]} />
      <path
        d={`M ${x3 + boxW / 2} ${cy + boxH} Q ${x3 + boxW / 2} ${cy + boxH + 50}, ${(x1 + x3) / 2 + boxW / 2} ${cy + boxH + 50} T ${x1 + boxW / 2} ${cy + boxH}`}
        fill="none"
        stroke="var(--diag-edge)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        markerEnd="url(#arrow)"
      />
      <text x={W / 2} y={cy + boxH + 70} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--muted)">
        nächste Iteration
      </text>
    </>
  );
}

function LinearShape({ nodes }: { nodes: string[] }) {
  const labels = nodes.length ? nodes : ["Schritt 1", "Schritt 2", "Schritt 3", "Output"];
  const n = labels.length;
  const boxW = Math.min(120, (W - 40 - (n - 1) * 16) / n);
  const boxH = 52;
  const gap = (W - n * boxW - 40) / Math.max(1, n - 1);
  const cy = (H - boxH) / 2;
  return (
    <>
      {labels.map((label, i) => {
        const x = 20 + i * (boxW + gap);
        const variant = i === 0 || i === n - 1 ? "solid" : "outline";
        return (
          <g key={i}>
            <NodeBox x={x} y={cy} w={boxW} h={boxH} label={label} variant={variant} />
            {i < n - 1 && (
              <Arrow from={[x + boxW, cy + boxH / 2]} to={[x + boxW + gap, cy + boxH / 2]} />
            )}
          </g>
        );
      })}
    </>
  );
}

function BranchShape({ nodes }: { nodes: string[] }) {
  const [router, ...branches] = nodes.length ? nodes : ["Router", "Pfad A", "Pfad B", "Pfad C"];
  const all = branches.length ? branches : ["Pfad A", "Pfad B", "Pfad C"];
  const routerW = 130;
  const routerH = 52;
  const routerX = 30;
  const routerY = (H - routerH) / 2;
  const branchW = 150;
  const branchH = 44;
  const branchX = 360;
  const count = all.length;
  return (
    <>
      <NodeBox x={routerX} y={routerY} w={routerW} h={routerH} label={router} variant="solid" />
      {all.map((label, i) => {
        const yStep = count === 1 ? H / 2 - branchH / 2 : 30 + i * ((H - 60 - branchH) / Math.max(1, count - 1));
        return (
          <g key={i}>
            <NodeBox x={branchX} y={yStep} w={branchW} h={branchH} label={label} variant="outline" />
            <Arrow
              from={[routerX + routerW, routerY + routerH / 2]}
              to={[branchX, yStep + branchH / 2]}
            />
          </g>
        );
      })}
    </>
  );
}

function FanoutShape({ nodes }: { nodes: string[] }) {
  const [src, ...rest] = nodes.length ? nodes : ["Input", "W1", "W2", "W3", "Aggregate"];
  const aggregate = rest[rest.length - 1] ?? "Aggregate";
  const workers = rest.slice(0, -1).length ? rest.slice(0, -1) : ["W1", "W2", "W3"];

  const srcW = 110;
  const wW = 90;
  const aggW = 130;
  const boxH = 44;
  const srcX = 30;
  const wX = 200;
  const aggX = 400;
  const srcY = (H - boxH) / 2;
  const aggY = (H - boxH) / 2;
  const count = workers.length;

  return (
    <>
      <NodeBox x={srcX} y={srcY} w={srcW} h={boxH} label={src} variant="solid" />
      <NodeBox x={aggX} y={aggY} w={aggW} h={boxH} label={aggregate} variant="solid" />
      {workers.map((label, i) => {
        const wY = count === 1 ? H / 2 - boxH / 2 : 30 + i * ((H - 60 - boxH) / Math.max(1, count - 1));
        return (
          <g key={i}>
            <NodeBox x={wX} y={wY} w={wW} h={boxH} label={label} variant="outline" />
            <Arrow from={[srcX + srcW, srcY + boxH / 2]} to={[wX, wY + boxH / 2]} />
            <Arrow from={[wX + wW, wY + boxH / 2]} to={[aggX, aggY + boxH / 2]} />
          </g>
        );
      })}
    </>
  );
}

function SupervisorShape({ nodes }: { nodes: string[] }) {
  const [sup, ...workers] = nodes.length ? nodes : ["Supervisor", "Agent A", "Agent B", "Agent C"];
  const list = workers.length ? workers : ["Agent A", "Agent B", "Agent C"];
  const supW = 150;
  const supH = 50;
  const supX = (W - supW) / 2;
  const supY = 24;
  const wW = 120;
  const wH = 44;
  const wY = 138;
  const count = list.length;
  const totalW = count * wW + (count - 1) * 24;
  const startX = (W - totalW) / 2;
  return (
    <>
      <NodeBox x={supX} y={supY} w={supW} h={supH} label={sup} variant="solid" />
      {list.map((label, i) => {
        const x = startX + i * (wW + 24);
        return (
          <g key={i}>
            <NodeBox x={x} y={wY} w={wW} h={wH} label={label} variant="outline" />
            <Arrow from={[supX + supW / 2, supY + supH]} to={[x + wW / 2, wY]} curved />
          </g>
        );
      })}
    </>
  );
}

function HandoffShape({ nodes }: { nodes: string[] }) {
  const labels = nodes.length ? nodes : ["Triage", "Spezialist A", "Spezialist B"];
  const n = labels.length;
  const boxW = Math.min(150, (W - 40 - (n - 1) * 30) / n);
  const boxH = 52;
  const gap = (W - n * boxW - 40) / Math.max(1, n - 1);
  const cy = (H - boxH) / 2;
  return (
    <>
      {labels.map((label, i) => {
        const x = 20 + i * (boxW + gap);
        return (
          <g key={i}>
            <NodeBox x={x} y={cy} w={boxW} h={boxH} label={label} variant={i === 0 ? "solid" : "outline"} />
            {i < n - 1 && (
              <Arrow
                from={[x + boxW, cy + boxH / 2]}
                to={[x + boxW + gap, cy + boxH / 2]}
                label="Kontext"
              />
            )}
          </g>
        );
      })}
    </>
  );
}

function GenCriticShape({ nodes }: { nodes: string[] }) {
  const [a, b] = [nodes[0] ?? "Generator", nodes[1] ?? "Evaluator"];
  const boxW = 160;
  const boxH = 64;
  const cy = (H - boxH) / 2;
  const xA = 70;
  const xB = W - 70 - boxW;
  return (
    <>
      <NodeBox x={xA} y={cy} w={boxW} h={boxH} label={a} variant="solid" />
      <NodeBox x={xB} y={cy} w={boxW} h={boxH} label={b} variant="outline" />
      <path
        d={`M ${xA + boxW} ${cy + 18} C ${xA + boxW + 60} ${cy - 10}, ${xB - 60} ${cy - 10}, ${xB} ${cy + 18}`}
        fill="none"
        stroke="var(--diag-edge)"
        strokeWidth={1.5}
        markerEnd="url(#arrow)"
      />
      <text x={W / 2} y={cy - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--muted)">
        Entwurf
      </text>
      <path
        d={`M ${xB} ${cy + boxH - 18} C ${xB - 60} ${cy + boxH + 16}, ${xA + boxW + 60} ${cy + boxH + 16}, ${xA + boxW} ${cy + boxH - 18}`}
        fill="none"
        stroke="var(--diag-edge)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        markerEnd="url(#arrow)"
      />
      <text x={W / 2} y={cy + boxH + 30} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--muted)">
        Kritik · Revision
      </text>
    </>
  );
}

function MeshShape({ nodes }: { nodes: string[] }) {
  const labels = nodes.length ? nodes : ["Agent A", "Agent B", "Agent C", "Agent D"];
  const r = 28;
  const cx = W / 2;
  const cy = H / 2;
  const radius = 75;
  const positions = labels.map((_, i) => {
    const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  return (
    <>
      {positions.map(([x, y], i) =>
        positions.map((_, j) => {
          if (j <= i) return null;
          const [x2, y2] = positions[j];
          return (
            <line
              key={`${i}-${j}`}
              x1={x}
              y1={y}
              x2={x2}
              y2={y2}
              stroke="var(--diag-edge)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.6}
            />
          );
        }),
      )}
      {positions.map(([x, y], i) => (
        <NodeCircle key={i} cx={x} cy={y} r={r} label={labels[i].slice(0, 4)} />
      ))}
    </>
  );
}

function GateShape({ nodes }: { nodes: string[] }) {
  const [src, gate, ok, fail] = [
    nodes[0] ?? "Agent",
    nodes[1] ?? "Gate",
    nodes[2] ?? "Pass",
    nodes[3] ?? "Reject",
  ];
  const boxW = 130;
  const boxH = 52;
  const cy = (H - boxH) / 2;
  return (
    <>
      <NodeBox x={20} y={cy} w={boxW} h={boxH} label={src} variant="solid" />
      <NodeBox x={210} y={cy} w={boxW} h={boxH} label={gate} variant="outline" />
      <NodeBox x={400} y={30} w={140} h={44} label={ok} variant="outline" />
      <NodeBox x={400} y={H - 74} w={140} h={44} label={fail} variant="dashed" />
      <Arrow from={[20 + boxW, cy + boxH / 2]} to={[210, cy + boxH / 2]} />
      <Arrow from={[210 + boxW, cy + boxH / 2]} to={[400, 52]} curved label="Ja" />
      <Arrow from={[210 + boxW, cy + boxH / 2]} to={[400, H - 52]} curved label="Nein" />
    </>
  );
}

function AgentStoreShape({ nodes }: { nodes: string[] }) {
  const [agent, store] = [nodes[0] ?? "Agent", nodes[1] ?? "Store"];
  const boxW = 140;
  const boxH = 60;
  const cy = (H - boxH) / 2;
  const xA = 60;
  const xB = W - 60 - 130;
  return (
    <>
      <NodeBox x={xA} y={cy} w={boxW} h={boxH} label={agent} variant="solid" />
      <Cylinder x={xB} y={cy - 4} w={130} h={68} label={store} />
      <Arrow
        from={[xA + boxW, cy + boxH / 2 - 8]}
        to={[xB, cy + boxH / 2 - 8]}
        label="write"
      />
      <Arrow
        from={[xB, cy + boxH / 2 + 12]}
        to={[xA + boxW, cy + boxH / 2 + 12]}
        label="read"
        dashed
      />
    </>
  );
}

function TreeShape({ nodes }: { nodes: string[] }) {
  const [root, ...rest] = nodes.length ? nodes : ["Root", "Path A", "Path B", "Path C"];
  const branches = rest.length ? rest : ["Path A", "Path B", "Path C"];
  const rootW = 110;
  const rootH = 46;
  const rootX = (W - rootW) / 2;
  const rootY = 18;
  const childW = 110;
  const childH = 40;
  const childY = 100;
  const count = branches.length;
  const totalW = count * childW + (count - 1) * 24;
  const startX = (W - totalW) / 2;
  return (
    <>
      <NodeBox x={rootX} y={rootY} w={rootW} h={rootH} label={root} variant="solid" />
      {branches.map((label, i) => {
        const x = startX + i * (childW + 24);
        return (
          <g key={i}>
            <NodeBox x={x} y={childY} w={childW} h={childH} label={label} variant="outline" />
            <Arrow from={[rootX + rootW / 2, rootY + rootH]} to={[x + childW / 2, childY]} curved />
            <NodeBox x={x + 12} y={childY + 60} w={childW - 24} h={36} label={`${label}.1`} variant="dashed" />
            <Arrow
              from={[x + childW / 2, childY + childH]}
              to={[x + childW / 2, childY + 60]}
            />
          </g>
        );
      })}
    </>
  );
}

const DOMAIN_COLORS: Record<Domain, { fill: string; stroke: string; bg: string; fg: string }> = {
  Denken: { fill: "#a855f7", stroke: "#a855f7", bg: "#f7efff", fg: "white" },
  Ablauf: { fill: "#14b8a6", stroke: "#14b8a6", bg: "#e6fbf6", fg: "white" },
  Zusammenarbeit: { fill: "#f59e0b", stroke: "#f59e0b", bg: "#fff5e1", fg: "#1a1a1a" },
  Systembetrieb: { fill: "#6366f1", stroke: "#6366f1", bg: "#ecedff", fg: "white" },
};

export function PatternDiagram({ diagram, domain }: Props) {
  const colors = DOMAIN_COLORS[domain];
  const style = {
    "--diag-fill": colors.fill,
    "--diag-stroke": colors.stroke,
    "--diag-bg": colors.bg,
    "--diag-fg-on": colors.fg,
    "--diag-edge": "rgba(11, 14, 20, 0.45)",
  } as React.CSSProperties;

  return (
    <figure className="pattern-diagram" style={style} aria-label={diagram.caption ?? "Pattern-Diagramm"}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" preserveAspectRatio="xMidYMid meet">
        <Defs />
        {diagram.type === "loop" && <LoopShape nodes={diagram.nodes} />}
        {diagram.type === "linear" && <LinearShape nodes={diagram.nodes} />}
        {diagram.type === "branch" && <BranchShape nodes={diagram.nodes} />}
        {diagram.type === "fanout" && <FanoutShape nodes={diagram.nodes} />}
        {diagram.type === "supervisor" && <SupervisorShape nodes={diagram.nodes} />}
        {diagram.type === "handoff" && <HandoffShape nodes={diagram.nodes} />}
        {diagram.type === "gen-critic" && <GenCriticShape nodes={diagram.nodes} />}
        {diagram.type === "mesh" && <MeshShape nodes={diagram.nodes} />}
        {diagram.type === "gate" && <GateShape nodes={diagram.nodes} />}
        {diagram.type === "agent-store" && <AgentStoreShape nodes={diagram.nodes} />}
        {diagram.type === "tree" && <TreeShape nodes={diagram.nodes} />}
      </svg>
      {diagram.caption && <figcaption>{diagram.caption}</figcaption>}
    </figure>
  );
}
