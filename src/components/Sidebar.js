//components/Sidebar.js
import React from "react";

export default function Sidebar({ onAddElement }) {
  return (
    <div className="sidebar">
      <h3>Add Elements</h3>
      <button onClick={() => onAddElement("text")}>Text</button>
      <button onClick={() => onAddElement("image")}>Image</button>
      <button onClick={() => onAddElement("button")}>Button</button>
    </div>
  );
}
