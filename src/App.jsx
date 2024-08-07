import React from 'react';
import Calendar from './components/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Calendar />
      </div>
    </DndProvider>
  );
};

export default App;
