import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ElementBox from "./ElementBox";

function SortableItem({
  id,
  element,
  selectedId,
  onSelectElement,
  onTextChange,
  onReorder,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "10px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ElementBox
        element={element}
        selectedId={selectedId}
        onSelect={onSelectElement}
        onTextChange={onTextChange}
        onReorder={onReorder}
      />
    </div>
  );
}

export default function Canvas({
  elements,
  setElements,
  selectedId,
  onSelectElement,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const findElementById = (items, id) => {
    for (const el of items) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElementById(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeElementById = (items, id) =>
    items
      .map((el) => {
        if (el.id === id) return null;
        if (el.children) {
          const newChildren = removeElementById(el.children, id);
          return { ...el, children: newChildren };
        }
        return el;
      })
      .filter(Boolean);

  const insertElementInto = (items, targetId, element) =>
    items.map((el) => {
      if (el.id === targetId && el.type === "div") {
        return {
          ...el,
          children: [...(el.children || []), element],
        };
      }
      if (el.children) {
        return {
          ...el,
          children: insertElementInto(el.children, targetId, element),
        };
      }
      return el;
    });

  const handleTextChange = (id, newText) => {
    const updateText = (items) =>
      items.map((el) =>
        el.id === id
          ? { ...el, props: { ...el.props, text: newText } }
          : {
              ...el,
              children: el.children ? updateText(el.children) : undefined,
            }
      );
    setElements((prev) => updateText(prev));
  };

  const handleReorder = (activeId, overId, parentId = null) => {
    const reorderInArray = (items) =>
      arrayMove(
        items,
        items.findIndex((el) => el.id === activeId),
        items.findIndex((el) => el.id === overId)
      );

    const updateInTree = (items) =>
      items.map((el) =>
        el.id === parentId
          ? { ...el, children: reorderInArray(el.children || []) }
          : {
              ...el,
              children: el.children ? updateInTree(el.children) : undefined,
            }
      );

    if (parentId) {
      setElements((prev) => updateInTree(prev));
    } else {
      setElements((prev) => reorderInArray(prev));
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return;

    const activeEl = findElementById(elements, active.id);
    if (!activeEl) return;

    let newTree = removeElementById(elements, active.id);

    const overEl = findElementById(newTree, over.id);
    const isOverBlock = overEl?.type === "div";

    if (isOverBlock) {
      newTree = insertElementInto(newTree, over.id, activeEl);
    } else {
      // fallback: move to same level
      newTree = arrayMove(
        newTree,
        newTree.findIndex((el) => el.id === active.id),
        newTree.findIndex((el) => el.id === over.id)
      );
    }

    setElements(newTree);
  };

  return (
    <div className="canvas" onClick={(e) => e.stopPropagation()}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={elements.map((el) => el.id)}
          strategy={verticalListSortingStrategy}
        >
          {elements.map((el) => (
            <SortableItem
              key={el.id}
              id={el.id}
              element={el}
              selectedId={selectedId}
              onSelectElement={onSelectElement}
              onTextChange={handleTextChange}
              onReorder={handleReorder}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
