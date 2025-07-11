import React, { useState, useRef, useEffect } from "react";

export default function ElementBox({
  element,
  selectedId,
  onSelect,
  onTextChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const {
    backgroundColor,
    fontFamily,
    fontSize,
    textAlign,
    bold,
    italic,
    underline,
    title,
  } = element.props || {};

  const isCurrentSelected = selectedId === element.id;

  const style = {
    padding: "16px",
    border: isCurrentSelected ? "2px solid blue" : "1px solid #ccc",
    backgroundColor: backgroundColor || "#ffffff",
    fontFamily: fontFamily || "inherit",
    fontSize: fontSize ? `${fontSize}px` : "16px",
    textAlign: textAlign || "right",
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    borderRadius: "12px",
    boxShadow: "0 0 6px rgba(0, 0, 0, 0.03)",
    cursor: "pointer",
    userSelect: "none",
    marginBottom: "10px",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.(element.id);
  };

  const handleDoubleClick = (e) => {
    if (["text", "button"].includes(element.type)) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = () => setIsEditing(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div style={style} onClick={handleClick} onDoubleClick={handleDoubleClick}>
      {element.type === "div" && title && (
        <h4 style={{ marginTop: 0 }}>{title}</h4>
      )}

      {element.type === "text" && (
        <>
          {isEditing ? (
            <input
              ref={inputRef}
              value={element.props.text || ""}
              onChange={(e) => onTextChange?.(element.id, e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                fontSize: fontSize ? `${fontSize}px` : "16px",
                fontFamily: fontFamily || "inherit",
              }}
            />
          ) : (
            <p>{element.props.text || "Editable Text"}</p>
          )}
        </>
      )}

      {element.type === "image" && (
        <img
          src="https://via.placeholder.com/150"
          alt="Placeholder"
          style={{ width: 150 }}
        />
      )}

      {element.type === "button" && (
        <>
          {isEditing ? (
            <input
              ref={inputRef}
              value={element.props.text || "Click Me"}
              onChange={(e) => onTextChange?.(element.id, e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                padding: "8px 16px",
                fontFamily: fontFamily || "inherit",
              }}
            />
          ) : (
            <button style={{ fontFamily: fontFamily || "inherit" }}>
              {element.props.text || "Click Me"}
            </button>
          )}
        </>
      )}

      {element.type === "div" && element.children?.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {element.children.map((child) => (
            <ElementBox
              key={child.id}
              element={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onTextChange={onTextChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
