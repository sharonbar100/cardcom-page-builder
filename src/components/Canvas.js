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
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over?.id);
      setElements((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleTextChange = (id, newText) => {
    const updateTextRecursive = (list) =>
      list.map((el) =>
        el.id === id
          ? { ...el, props: { ...el.props, text: newText } }
          : el.children
          ? { ...el, children: updateTextRecursive(el.children) }
          : el
      );
    setElements((prev) => updateTextRecursive(prev));
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
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
