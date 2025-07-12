import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableChild({
  child,
  selectedId,
  onSelect,
  onTextChange,
  onReorder,
  parentId,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: child.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ElementBox
        element={child}
        selectedId={selectedId}
        onSelect={onSelect}
        onTextChange={onTextChange}
        onReorder={onReorder}
        parentId={parentId}
      />
    </div>
  );
}

export default function ElementBox({
  element,
  selectedId,
  onSelect,
  onTextChange,
  onReorder,
  parentId = null,
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
    noBorder,
  } = element.props || {};

  const isSelected = selectedId === element.id;

  const style = {
    padding: "10px",
    border: noBorder ? "none" : isSelected ? "2px solid blue" : "1px solid #ccc",
    borderRadius: "12px",
    backgroundColor: backgroundColor || "#ffffff",
    fontFamily: fontFamily || "inherit",
    fontSize: fontSize ? `${fontSize}px` : "16px",
    textAlign: textAlign || "left",
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: isSelected ? "0 0 0 2px #409eff33" : "0 1px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "8px",
    backgroundClip: "padding-box",
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleChildReorder = (activeId, overId) => {
    onReorder?.(activeId, overId, element.id);
  };

  return (
    <div style={style} onClick={handleClick} onDoubleClick={handleDoubleClick}>
      {element.type === "div" && (
        <>
          <strong style={{ display: "block", marginBottom: "6px" }}>
            {element.props?.title || "כותרת בלוק"}
          </strong>
          <div style={{ padding: "10px", background: "#f9f9f9", borderRadius: "10px" }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (active?.id && over?.id && active.id !== over.id) {
                  handleChildReorder(active.id, over.id);
                }
              }}
            >
              <SortableContext
                items={(element.children || []).map((child) => child.id)}
                strategy={verticalListSortingStrategy}
              >
                {(element.children || []).map((child) => (
                  <SortableChild
                    key={child.id}
                    child={child}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    onTextChange={onTextChange}
                    onReorder={onReorder}
                    parentId={element.id}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </>
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
          style={{ width: 150, borderRadius: "8px" }}
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
            <button
              style={{
                fontFamily: fontFamily || "inherit",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              {element.props.text || "Click Me"}
            </button>
          )}
        </>
      )}

      {element.type === "field" && (
        <input
          type="text"
          placeholder={element.props.placeholder || "Field"}
          style={{
            width: "100%",
            fontSize: fontSize ? `${fontSize}px` : "16px",
            fontFamily: fontFamily || "inherit",
            border: noBorder ? "none" : "1px solid #ccc",
            padding: "6px",
            borderRadius: "6px",
          }}
          readOnly
        />
      )}
    </div>
  );
}
