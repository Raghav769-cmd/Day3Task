import Header from './Components/Header';
import TaskInput from './Components/TaskInput';
import WeekSummary from './Components/WeekSummary';
import TaskList from './Components/TaskList';
import LoadDataButton from './Components/LoadDataButton';
import { useState } from 'react';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <TaskInput />
        <TaskList />
        <LoadDataButton />
      </main>
    </div>
  );
}
  
export default App;
