import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const diwassData = {
  DEU: {
    country: "Germany",
    commercialSoftware: true,
    localSystem: false,
    model: "direct",
    details:
      "Operators access DIWASS via GUI or direct software integration. Competent authorities use distributed national systems.",
  },
  ITA: {
    country: "Italy",
    commercialSoftware: true,
    localSystem: true,
    model: "hybrid",
    details:
      "Hybrid model: 4 regions require local-system integration, all others use direct DIWASS.",
  },
  BEL: {
    country: "Belgium",
    commercialSoftware: true,
    localSystem: true,
    model: "hybrid",
    details:
      "Flanders (OVAM) uses local-system logic; Brussels and Wallonia use GUI/direct DIWASS.",
  },
  FRA: {
    country: "France",
    commercialSoftware: false,
    localSystem: true,
    model: "local",
    details: "Fully local-system based architecture.",
  },
  AUT: {
    country: "Austria",
    commercialSoftware: false,
    localSystem: true,
    model: "local",
    details: "Fully local-system based architecture.",
  },
  SWE: {
    country: "Sweden",
    commercialSoftware: false,
    localSystem: true,
    model: "local",
    details: "Fully local-system based architecture.",
  },
  ESP: {
    country: "Spain",
    commercialSoftware: true,
    localSystem: false,
    model: "direct",
    details: "Direct DIWASS usage.",
  },
  NLD: {
    country: "Netherlands",
    commercialSoftware: true,
    localSystem: false,
    model: "direct",
    details: "Direct DIWASS usage.",
  },
};

const includedIso3 = new Set(Object.keys(diwassData));

function getColor(item) {
  if (item.model === "direct") return "#16a34a";
  if (item.model === "local") return "#dc2626";
  return "#f59e0b";
}

function badgeStyle() {
  return {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginRight: "8px",
    marginBottom: "8px",
  };
}

function cardStyle() {
  return {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    padding: "24px",
    border: "1px solid #e2e8f0",
  };
}

export default function App() {
  const [selectedIso, setSelectedIso] = useState("DEU");
  const [hoveredIso, setHoveredIso] = useState(null);

  const selected = diwassData[selectedIso];
  const hovered = hoveredIso ? diwassData[hoveredIso] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            DIWASS Access Architecture in Europe
          </h1>
          <p style={{ color: "#475569", marginTop: "8px" }}>
            Technical Deep Dive and Policy Comparison
          </p>
        </div>

        <div style={{ ...cardStyle(), position: "relative", marginBottom: "24px" }}>
          <h2 style={{ marginTop: 0 }}>Europe Overview</h2>
          <p style={{ color: "#475569", marginTop: "0", marginBottom: "16px" }}>
            Green = Direct DIWASS, Red = Local System only, Yellow = Hybrid
          </p>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [14, 54], scale: 520 }}
            style={{ width: "100%", height: "60vh" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => includedIso3.has(geo.properties.iso_a3 || geo.id))
                  .map((geo) => {
                    const iso = geo.properties.iso_a3 || geo.id;
                    const item = diwassData[iso];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredIso(iso)}
                        onMouseLeave={() => setHoveredIso(null)}
                        onClick={() => setSelectedIso(iso)}
                        style={{
                          default: {
                            fill: getColor(item),
                            outline: "none",
                            stroke: "#ffffff",
                            strokeWidth: 0.8,
                            cursor: "pointer",
                          },
                          hover: {
                            fill: "#60a5fa",
                            outline: "none",
                            stroke: "#ffffff",
                            strokeWidth: 1,
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "#3b82f6",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
              }
            </Geographies>
          </ComposableMap>

          {hovered && (
            <div
              style={{
                position: "absolute",
                left: "24px",
                top: "80px",
                maxWidth: "320px",
                background: "rgba(255,255,255,0.96)",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                padding: "16px",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>{hovered.country}</div>
              <div style={{ fontSize: "14px", color: "#475569" }}>{hovered.details}</div>
            </div>
          )}
        </div>

        <div style={cardStyle()}>
          <h2 style={{ marginTop: 0 }}>{selected.country}</h2>
          <div style={{ marginBottom: "12px" }}>
            <span style={badgeStyle()}>
              Commercial Software: {selected.commercialSoftware ? "Yes" : "No"}
            </span>
            <span style={badgeStyle()}>
              Local System: {selected.localSystem ? "Yes" : "No"}
            </span>
            <span style={badgeStyle()}>Model: {selected.model}</span>
          </div>
          <p style={{ lineHeight: 1.6, color: "#334155" }}>{selected.details}</p>
        </div>
      </div>
    </div>
  );
}
