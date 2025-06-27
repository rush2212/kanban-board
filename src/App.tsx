import React from 'react';
import KanbanBoard from './components/Kanban';

function App() {
  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#f4f5f7',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📋 Kanban Board</h2>
      <KanbanBoard />
    </div>
  );
}

export default App;
