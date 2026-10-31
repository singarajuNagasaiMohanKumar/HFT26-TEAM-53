
import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function ArchitectureNode({ data, selected }) {
  const colors = {
    python: "#60a5fa",
    javascript: "#fbbf24",
    typescript: "#818cf8",
    tsx: "#c084fc",
    java: "#fb923c",
  };

  const color = colors[data.language] || "#34d399";

  return (
    <div
      style={{
        width: 220,
        padding: 15,
        borderRadius: 12,
        border: `1px solid ${selected ? "#ffffff" : color}`,
        background: "#111827",
        color: "#f8fafc",
        boxShadow: selected ? `0 0 18px ${color}60` : "0 5px 15px #0005",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: color }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: color,
          }}
        />
        <span style={{ fontSize: 10, color, fontWeight: 700 }}>
          {data.language?.toUpperCase() || "SOURCE"} FILE
        </span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>
        {data.title}
      </div>

      <div
        style={{
          fontSize: 10,
          color: "#94a3b8",
          marginTop: 5,
          overflowWrap: "anywhere",
        }}
      >
        {data.path}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: color }}
      />
    </div>
  );
}

const nodeTypes = {
  architecture: ArchitectureNode,
};

export default function ArchitectureGraph({
  nodes: inputNodes = [],
  edges: inputEdges = [],
}) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Arrange nodes in a grid so they don't overlap.
  const nodes = useMemo(() => {
    const columns = Math.max(
      1,
      Math.ceil(Math.sqrt(inputNodes.length))
    );

    return inputNodes.map((node, index) => ({
      ...node,
      type: "architecture",
      position: {
        x: (index % columns) * 300,
        y: Math.floor(index / columns) * 190,
      },
    }));
  }, [inputNodes]);

  const edges = useMemo(
    () =>
      inputEdges.map((edge) => ({
        ...edge,
        style: {
          stroke: "#64748b",
          strokeWidth: 2,
        },
        animated: false,
      })),
    [inputEdges]
  );

  return (
    <div
      style={{
        height: "100%",
        minHeight: 650,
        background: "#080d18",
        border: "1px solid #1e293b",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 5,
          top: 18,
          left: 20,
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          Repository Architecture
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5 }}>
          {nodes.length} files · {edges.length} connections
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, paddingTop: 75 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#334155"
          />

          <Controls />

          <MiniMap
            nodeColor={(node) =>
              ({
                python: "#60a5fa",
                javascript: "#fbbf24",
                typescript: "#818cf8",
                tsx: "#c084fc",
                java: "#fb923c",
              })[node.data?.language] || "#34d399"
            }
            style={{ background: "#111827" }}
          />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            right: 15,
            top: 75,
            width: 260,
            padding: 16,
            background: "#111827",
            border: "1px solid #334155",
            borderRadius: 12,
            boxShadow: "0 8px 25px #0008",
          }}
        >
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              float: "right",
              background: "transparent",
              border: 0,
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>

          <div style={{ color: "#60a5fa", fontSize: 10, fontWeight: 700 }}>
            FILE DETAILS
          </div>

          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>
            {selectedNode.data.title}
          </div>

          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 8 }}>
            {selectedNode.data.path}
          </div>

          <div style={{ color: "#cbd5e1", fontSize: 12, marginTop: 12 }}>
            Language: {selectedNode.data.language}
          </div>

          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 12 }}>
            Imports:
            <ul style={{ paddingLeft: 18 }}>
              {(selectedNode.data.imports || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
