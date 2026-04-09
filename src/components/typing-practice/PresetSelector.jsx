export default function PresetSelector({ presets, activePresetId, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {presets.map((preset) => {
        const active = preset.id === activePresetId;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
            style={{
              background: active ? "#2563eb" : "#f1f5f9",
              color: active ? "#ffffff" : "#64748b",
              border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
              cursor: "pointer",
            }}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}