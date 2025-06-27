import React from 'react';
import KanbanBoard from './components/Kanban';

function App() {
  return (
    <div
      style={{
        padding: '0.1rem',
        backgroundColor: '#f4f5f7',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <KanbanBoard />
    </div>
  );
}

export default App;
