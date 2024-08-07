import React from 'react';
import { useDrag } from 'react-dnd';
import { format } from 'date-fns';

const DraggableEvent = ({ event, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { id: event.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const eventStyle = {
    backgroundColor: event.color,
    opacity: isDragging ? 0.5 : 1,
    gridColumn: `span ${Math.ceil((event.end - event.start) / (1000 * 60 * 60 * 24)) + 1}`,
  };

  return (
    <div ref={drag} className="relative flex items-center p-2 text-white rounded" style={eventStyle}>
      {event.title}
      <button
        onClick={onDelete}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
      >
        &times;
      </button>
    </div>
  );
};

export default DraggableEvent;
