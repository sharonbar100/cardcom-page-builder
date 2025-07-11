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
        backgroundColor: "#ffffff",
        fontFamily: "inherit",
      },
      children: type === "div" ? [] : undefined,
    };

    const selectedElement = findById(elements, selectedId);

    // ⛔ Prevent adding div inside div
    if (type === "div") {
      setElements([...elements, newElement]);
    } else if (selectedElement?.type === "div") {
      setElements((prev) => addToParent(prev, selectedId, newElement));
    } else {
      setElements([...elements, newElement]);
    }

    setSelectedId(newElement.id);
  };

  const addToParent = (list, parentId, newEl) =>
    list.map((el) => {
      if (el.id === parentId && el.type === "div") {
        return {
          ...el,
          children: [...(el.children || []), newEl],
        };
      } else if (el.children) {
        return { ...el, children: addToParent(el.children, parentId, newEl) };
      }
      return el;
    });

  const updateElement = (updated) => {
    const updateRecursive = (list) =>
      list.map((el) =>
        el.id === updated.id
          ? updated
          : el.children
          ? { ...el, children: updateRecursive(el.children) }
          : el
      );
    setElements((prev) => updateRecursive(prev));
  };

  return (
    <div className="app">
      <div className="toolbar">
        <button onClick={() => addElement("div")}>הוסף בלוק</button>
        <button onClick={() => addElement("text")}>הוסף טקסט</button>
        <button onClick={() => addElement("image")}>הוסף תמונה</button>
        <button onClick={() => addElement("button")}>הוסף כפתור</button>
      </div>

      <div className="editor">
        <Canvas
          elements={elements}
          setElements={setElements}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
        />
        <SettingsPanel
          selectedElement={findById(elements, selectedId)}
          onChange={updateElement}
        />
      </div>
    </div>
  );
}

function findById(list, id) {
  for (const el of list) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

export default App;
