export default function PresetSelector({ presets, activePresetId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {presets.map((preset) => {
        const active = preset.id === activePresetId;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            style={{
              padding: "5px 14px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              transition: "all 0.15s",
              border: active ? "1px solid #1a1a2e" : "1px solid #e2e8f0",
              background: active ? "#1a1a2e" : "#ffffff",
              color: active ? "#ffffff" : "#64748b",
              letterSpacing: "0.01em",
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}