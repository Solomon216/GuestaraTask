import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  addMonths,
  subMonths,
  isWithinInterval,
} from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarCell from './CalendarCell';
import { v4 as uuidv4 } from 'uuid';
import { stringToColor } from '../utils/Color';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([
    { id: uuidv4(), name: 'Resource 1' }
  ]);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [activeResource, setActiveResource] = useState(null);

  //Start and end dates setup

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = monthStart;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  //Evnets and resources add and delete

  const addEvent = (start, end, resource) => {
    const title = prompt('Enter event title:');
    if (title) {
      const color = stringToColor(title);
      const newEvent = { id: uuidv4(), start, end, title, color, resource };
      setEvents([...events, newEvent]);
    }
  };

  const moveEvent = (eventId, newStart, newEnd, newResource) => {
    setEvents(
      events.map(event =>
        event.id === eventId ? { ...event, start: newStart, end: newEnd, resource: newResource } : event
      )
    );
  };

  const deleteEvent = eventId => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const addResource = () => {
    const name = prompt('Enter resource name:');
    if (name) {
      setResources([...resources, { id: uuidv4(), name }]);
    }
  };

  const deleteResource = resourceId => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(resource => resource.id !== resourceId));
      setEvents(events.filter(event => event.resource !== resourceId));
    }
  };

  //Hnadling dragging operations

  const handleMouseDown = (date, resourceId) => {
    setDragging(true);
    setDragStart(date);
    setDragEnd(date);
    setActiveResource(resourceId);
  };

  const handleMouseEnter = (date) => {
    if (dragging && activeResource) {
      setDragEnd(date);
    }
  };

  const handleMouseUp = () => {
    if (dragStart && dragEnd && activeResource) {
      addEvent(dragStart, dragEnd, activeResource);
    }
    setDragging(false);
    setDragStart(null);
    setDragEnd(null);
    setActiveResource(null);
  };

  //Higlighitng slected cells

  const getHighlighted = (date, resource) => {
    if (dragStart && dragEnd && activeResource === resource) {
      return isWithinInterval(date, { start: dragStart, end: dragEnd });
    }
    return false;
  };

  return (
    <div className="flex flex-col w-screen border border-gray-300 rounded-lg overflow-hidden">
      <CalendarHeader
        currentMonth={currentMonth}
        onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
        onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
        addResource={addResource}
      />
      <div className="flex overflow-x-auto">
        <div className="min-w-max">
          <div className="flex">
            <div className="sticky left-0 bg-gray-200 z-10">
              <div className="flex items-center justify-center bg-gray-200 font-bold p-2 border-b">
                Resources
              </div>
              {resources.map(resource => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between h-32 bg-gray-200 font-bold p-2 border-b"
                >
                  <span>{resource.name}</span>
                  <button
                    onClick={() => deleteResource(resource.id)}
                    className="ml-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex">
                {days.map(day => (
                  <div
                    key={day}
                    className="flex items-center justify-center bg-gray-200 font-bold p-2 w-40 border-b"
                  >
                    {format(day, 'EEE, MMM d')}
                  </div>
                ))}
              </div>
              {resources.map(resource => (
                <div key={resource.id} className="flex">
                  {days.map(day => (
                    <CalendarCell
                      key={day}
                      day={day}
                      resource={resource.id}
                      events={events}
                      onDateClick={date => addEvent(date, resource.id)}
                      moveEvent={moveEvent}
                      deleteEvent={deleteEvent}
                      onMouseDown={date => handleMouseDown(date, resource.id)}
                      onMouseEnter={date => handleMouseEnter(date)}
                      onMouseUp={handleMouseUp}
                      isHighlighted={getHighlighted(day, resource.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
