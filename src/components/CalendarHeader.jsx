import React from 'react';
import { format } from 'date-fns';

const CalendarHeader = ({ currentMonth, onNextMonth, onPrevMonth, addResource }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
      <button onClick={onPrevMonth} className="bg-blue-500 text-white px-2 py-1 rounded">
        Prev
      </button>
      <div className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</div>
      <button onClick={onNextMonth} className="bg-blue-500 text-white px-2 py-1 rounded">
        Next
      </button>
      <button onClick={addResource} className="bg-green-500 text-white px-2 py-1 rounded ml-4">
        Add Resource
      </button>
    </div>
  );
};

export default CalendarHeader;
