// src/components/shared/ClockPicker.jsx
import { useState, useRef, useEffect } from "react";

const HOUR_START = 7;
const HOUR_END = 20;

function pad(n) {
  return String(n).padStart(2, "0");
}

function parseTime(val) {
  if (!val) return { hour: 7, minute: 0, period: "AM" };
  const [h, m] = val.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { hour, minute: m, period };
}

function toTimeString(hour, minute, period) {
  let h = period === "AM" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
  return `${pad(h)}:${pad(minute)}`;
}

function isValidTime(hour, minute, period) {
  const h24 = period === "AM" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
  return h24 >= HOUR_START && h24 < HOUR_END;
}

export default function ClockPicker({ value, onChange, onClose }) {
  const initial = parseTime(value);
  const [step, setStep] = useState("hour");
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);
  const canvasRef = useRef(null);
  const dragging = useRef(false);

  const validHours = [];
  for (let h24 = HOUR_START; h24 < HOUR_END; h24++) {
    const p = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    validHours.push({ h12, p, h24 });
  }

  const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  useEffect(() => {
    drawClock();
  }, [step, hour, minute, period]);

  function getAngle(cx, cy, x, y) {
    let angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  }

  function drawClock() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    // Face
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    const items = step === "hour"
      ? Array.from({ length: 12 }, (_, i) => {
          const h = i + 1;
          // Check validity for each hour
          const h24AM = h === 12 ? 0 : h;
          const h24PM = h === 12 ? 12 : h + 12;
          const validAM = period === "AM" && h24AM >= HOUR_START && h24AM < HOUR_END;
          const validPM = period === "PM" && h24PM >= HOUR_START && h24PM < HOUR_END;
          return { label: String(h), value: h, valid: validAM || validPM };
        })
      : MINUTES.map(m => ({ label: pad(m), value: m, valid: true }));

    const count = items.length;
    const labelR = R - 24;

    items.forEach((item, i) => {
      const angle = ((i / count) * 360 - 90) * (Math.PI / 180);
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);

      const selected = step === "hour" ? item.value === hour : item.value === minute;

      if (selected) {
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#2563eb";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#2563eb";
        ctx.fill();
      }

      ctx.font = `${selected ? "500" : "400"} 12px system-ui`;
      ctx.fillStyle = !item.valid ? "#cbd5e1" : selected ? "#ffffff" : "#374151";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, x, y);
    });
  }

  function handleCanvasInteraction(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const angle = getAngle(cx, cy, x, y);
    const items = step === "hour" ? 12 : MINUTES.length;
    const index = Math.round((angle / 360) * items) % items;

    if (step === "hour") {
      const newHour = index === 0 ? 12 : index;
      const h24AM = newHour === 12 ? 0 : newHour;
      const h24PM = newHour === 12 ? 12 : newHour + 12;
      const validAM = period === "AM" && h24AM >= HOUR_START && h24AM < HOUR_END;
      const validPM = period === "PM" && h24PM >= HOUR_START && h24PM < HOUR_END;
      if (validAM || validPM) setHour(newHour);
    } else {
      setMinute(MINUTES[index] ?? 0);
    }
  }

  function handleMouseDown(e) {
    dragging.current = true;
    handleCanvasInteraction(e);
  }
  function handleMouseMove(e) {
    if (dragging.current) handleCanvasInteraction(e);
  }
  function handleMouseUp(e) {
    if (!dragging.current) return;
    dragging.current = false;
    handleCanvasInteraction(e);
    if (step === "hour") setStep("minute");
  }

  function handleConfirm() {
    const timeStr = toTimeString(hour, minute, period);
    onChange(timeStr);
    onClose();
  }

  function handlePeriodChange(p) {
    // Validate current hour is still valid after period switch
    const h24 = p === "AM" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
    if (h24 >= HOUR_START && h24 < HOUR_END) {
      setPeriod(p);
    } else {
      // Reset to first valid hour for this period
      if (p === "AM") { setHour(7); setPeriod("AM"); }
      else { setHour(12); setPeriod("PM"); }
    }
  }

  const displayHour = pad(hour);
  const displayMinute = pad(minute);
  const valid = isValidTime(hour, minute, period);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-72">
      {/* Time display */}
      <div className="bg-blue-600 px-6 py-4">
        <p className="text-blue-200 text-xs font-medium mb-1">Select time</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStep("hour")}
            className={`text-4xl font-light tracking-tight transition-opacity ${step === "hour" ? "text-white" : "text-blue-300"}`}
          >
            {displayHour}
          </button>
          <span className="text-4xl font-light text-blue-300">:</span>
          <button
            onClick={() => setStep("minute")}
            className={`text-4xl font-light tracking-tight transition-opacity ${step === "minute" ? "text-white" : "text-blue-300"}`}
          >
            {displayMinute}
          </button>
          <div className="ml-3 flex flex-col gap-1">
            {["AM", "PM"].map(p => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`cursor-pointer text-xs font-medium px-2 py-0.5 rounded transition-all ${period === p ? "text-white" : "text-blue-300 hover:text-blue-100"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-xs mt-1 opacity-75">7:00 AM – 8:00 PM only</p>
      </div>

      {/* Clock face */}
      <div className="flex justify-center p-4">
        <canvas
          ref={canvasRef}
          width={220}
          height={220}
          className="cursor-pointer touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchStart={(e) => { dragging.current = true; handleCanvasInteraction(e); }}
          onTouchMove={handleCanvasInteraction}
          onTouchEnd={(e) => { dragging.current = false; if (step === "hour") setStep("minute"); }}
        />
      </div>

      <p className="text-center text-xs text-gray-400 -mt-2 mb-3">
        {step === "hour" ? "Select hour, then minutes" : "Select minutes"}
      </p>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={onClose}
          className="cursor-pointer flex-1 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!valid}
          className="cursor-pointer flex-1 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          OK
        </button>
      </div>
    </div>
  );
}