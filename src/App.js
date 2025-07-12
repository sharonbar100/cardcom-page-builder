import React, { useState } from "react";
import Canvas from "./components/Canvas";
import SettingsPanel from "./components/SettingsPanel";
import "./styles.css";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const addElement = (type) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      props: {
        text: type === "text" ? "טקסט חדש" : type === "button" ? "כפתור" : "",
        placeholder: type === "field" ? "שדה חדש" : "",
        title: type === "div" ? "כותרת בלוק" : "",
        backgroundColor: "#ffffff",
        fontFamily: "inherit",
        fontSize: 16,
        textAlign: "right",
        bold: false,
        italic: false,
        underline: false,
        noBorder: false,
      },
      children: type === "div" ? [] : undefined,
    };

    setElements((prev) => {
      const updated = structuredClone(prev);

      if (selectedId) {
        const insertInto = (items) => {
          for (let item of items) {
            if (item.id === selectedId && item.type === "div") {
              item.children = item.children || [];
              item.children.push(newElement);
              return true;
            }
            if (item.children) {
              const inserted = insertInto(item.children);
              if (inserted) return true;
            }
          }
          return false;
        };

        const wasInserted = insertInto(updated);
        if (wasInserted) {
          setSelectedId(newElement.id);
          return updated;
        }
      }

      // fallback: add to root
      setSelectedId(newElement.id);
      return [...prev, newElement];
    });
  };

  const handleElementUpdate = (updated) => {
    const updateRecursively = (items) =>
      items.map((el) =>
        el.id === updated.id
          ? updated
          : {
              ...el,
              children: el.children ? updateRecursively(el.children) : undefined,
            }
      );

    setElements((prev) => updateRecursively(prev));
  };

  return (
    <div className="app">
      <div className="toolbar">
        <button onClick={() => addElement("text")}>הוסף טקסט</button>
        <button onClick={() => addElement("image")}>הוסף תמונה</button>
        <button onClick={() => addElement("button")}>הוסף כפתור</button>
        <button onClick={() => addElement("field")}>הוסף שדה</button>
        <button onClick={() => addElement("div")}>הוסף בלוק</button>
      </div>

      <div className="editor">
        <Canvas
          elements={elements}
          setElements={setElements}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
        />
        <SettingsPanel
          selectedElement={findElementById(elements, selectedId)}
          onChange={handleElementUpdate}
        />
      </div>
    </div>
  );
}

function findElementById(elements, id) {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

export default App;
