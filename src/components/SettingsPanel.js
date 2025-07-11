//components/SettingsPanel.js
import React from "react";

const fonts = ["inherit", "Arial", "Verdana", "Tahoma", "Courier New", "Georgia", "Roboto"];
const fontSizes = [12, 14, 16, 18, 24, 32];

export default function SettingsPanel({ selectedElement, onChange }) {
  if (!selectedElement) return <div className="settings-panel">בחר אלמנט לעריכה</div>;

  const handleChange = (field, value) => {
    onChange({
      ...selectedElement,
      props: {
        ...selectedElement.props,
        [field]: value,
      },
    });
  };

  const toggleStyle = (field) => {
    const current = selectedElement.props?.[field];
    handleChange(field, !current);
  };

  return (
    <div className="settings-panel">
      <h3>הגדרות אלמנט</h3>

      {(selectedElement.type === "text" || selectedElement.type === "button") && (
        <>
          <label>טקסט</label>
          <input
            type="text"
            value={selectedElement.props?.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
          />
        </>
      )}

      {selectedElement.type === "div" && (
        <>
          <label>כותרת בלוק</label>
          <input
            type="text"
            value={selectedElement.props?.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </>
      )}


      <label>צבע רקע</label>
      <input
        type="color"
        value={selectedElement.props?.backgroundColor || "#ffffff"}
        onChange={(e) => handleChange("backgroundColor", e.target.value)}
      />

      <label>גופן</label>
      <select
        value={selectedElement.props?.fontFamily || "inherit"}
        onChange={(e) => handleChange("fontFamily", e.target.value)}
      >
        {fonts.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <label>גודל גופן</label>
      <select
        value={selectedElement.props?.fontSize || 16}
        onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
      >
        {fontSizes.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>

      <label>יישור טקסט</label>
      <select
        value={selectedElement.props?.textAlign || "left"}
        onChange={(e) => handleChange("textAlign", e.target.value)}
      >
        <option value="left">שמאל</option>
        <option value="center">מרכז</option>
        <option value="right">ימין</option>
      </select>

      <label>עיצוב טקסט</label>
      <div>
        <button onClick={() => toggleStyle("bold")}>
          {selectedElement.props?.bold ? "Bold ✔" : "Bold"}
        </button>
        <button onClick={() => toggleStyle("italic")}>
          {selectedElement.props?.italic ? "Italic ✔" : "Italic"}
        </button>
        <button onClick={() => toggleStyle("underline")}>
          {selectedElement.props?.underline ? "Underline ✔" : "Underline"}
        </button>
      </div>
    </div>
  );
}
