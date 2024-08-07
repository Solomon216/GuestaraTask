import React from 'react';
import { isToday, isSameMonth, isSameDay, format, isWithinInterval } from 'date-fns';
import DraggableEvent from './DraggableEvent';
import { useDrop } from 'react-dnd';

const CalendarCell = ({ day, resource, events, onDateClick, moveEvent, deleteEvent, onMouseDown, onMouseEnter, onMouseUp, isHighlighted }) => {
  const dayEvents = events.filter(event => isWithinInterval(day, { start: event.start, end: event.end }) && event.resource === resource);
  const isDisabled = !isSameMonth(day, new Date());

  const [{ isOver }, drop] = useDrop({
    accept: 'event',
    drop: item => {
      const event = events.find(event => event.id === item.id);
      if (event) {
        const duration = event.end - event.start;
        moveEvent(event.id, day, new Date(day.getTime() + duration), resource);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`relative flex flex-col p-4 border h-32 w-40 cursor-pointer ${
        isToday(day) ? 'bg-yellow-100' : ''
      } ${isDisabled ? 'bg-gray-100' : ''} ${isHighlighted ? 'bg-blue-100' : ''}`}
      style={{ backgroundColor: isOver ? '#e6f7ff' : '' }}
      onMouseDown={() => onMouseDown(day)}
      onMouseEnter={() => onMouseEnter(day)}
      onMouseUp={onMouseUp}
    >
      <span className="absolute top-1 right-1 text-sm font-bold">{format(day, 'd')}</span>
      {dayEvents.map(event => (
        <DraggableEvent key={event.id} event={event} onDelete={() => deleteEvent(event.id)} />
      ))}
    </div>
  );
};

export default CalendarCell;
