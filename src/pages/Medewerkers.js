import React, { useState, useEffect } from 'react';
import initialData from '../data/initialData';
import { loadMedewerkers, saveMedewerkers } from '../utils/storage';
import './Medewerkers.css'; // Import the CSS file

function Medewerkers() {
  const [medewerkers, setMedewerkers] = useState(() => {
    const saved = loadMedewerkers();
    return saved || initialData.Medewerkers;
  });
  
  const [selectedMedewerker, setSelectedMedewerker] = useState(null);
  const [showNewMedewerkerForm, setShowNewMedewerkerForm] = useState(false);
  const [newMedewerker, setNewMedewerker] = useState({
    name: '',
    email: '',
    functie: '',
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    saveMedewerkers(medewerkers);
  }, [medewerkers]);

  const handleMedewerkerClick = (medewerker) => {
    setSelectedMedewerker(medewerker);
  };

  const handleTaskCheck = (taskId) => {
    if (selectedMedewerker) {
      const updatedMedewerker = {
        ...selectedMedewerker,
        checkedTasks: {
          ...selectedMedewerker.checkedTasks,
          [taskId]: !selectedMedewerker.checkedTasks[taskId]
        }
      };
      
      setSelectedMedewerker(updatedMedewerker);
      setMedewerkers(medewerkers.map(m => 
        m.id === selectedMedewerker.id ? updatedMedewerker : m
      ));
    }
  };

  const handleNewMedewerker = () => {
    if (newMedewerker.name && newMedewerker.email && newMedewerker.functie) {
      const medewerker = {
        id: Math.max(...medewerkers.map(m => m.id)) + 1,
        name: newMedewerker.name,
        email: newMedewerker.email,
        functie: newMedewerker.functie,
        taken: {},
        checkedTasks: {}
      };
      
      setMedewerkers([...medewerkers, medewerker]);
      setNewMedewerker({ name: '', email: '', functie: '' });
      setShowNewMedewerkerForm(false);
      setSelectedMedewerker(medewerker);
    }
  };

  const handleAddTask = () => {
    if (selectedMedewerker && newTask.trim()) {
      const taskId = (Object.keys(selectedMedewerker.taken).length + 1).toString();
      const updatedMedewerker = {
        ...selectedMedewerker,
        taken: {
          ...selectedMedewerker.taken,
          [taskId]: newTask
        }
      };
      
      setSelectedMedewerker(updatedMedewerker);
      setMedewerkers(medewerkers.map(m => 
        m.id === selectedMedewerker.id ? updatedMedewerker : m
      ));
      setNewTask('');
    }
  };

  const handleRemoveCompletedTasks = () => {
    if (selectedMedewerker) {
      const updatedTaken = Object.entries(selectedMedewerker.taken)
        .filter(([key]) => !selectedMedewerker.checkedTasks[key])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const updatedMedewerker = {
        ...selectedMedewerker,
        taken: updatedTaken,
        checkedTasks: {}
      };
      
      setSelectedMedewerker(updatedMedewerker);
      setMedewerkers(medewerkers.map(m => 
        m.id === selectedMedewerker.id ? updatedMedewerker : m
      ));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div>
      <h1>Medewerkers</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <div className="medewerkers-header">
            <h2>Medewerkers</h2>
            <button onClick={() => setShowNewMedewerkerForm(true)}>Nieuwe Medewerker</button>
          </div>
          {showNewMedewerkerForm && (
            <div className="new-medewerker-form">
              <input
                type="text"
                placeholder="Naam"
                value={newMedewerker.name}
                onChange={(e) => setNewMedewerker({ ...newMedewerker, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newMedewerker.email}
                onChange={(e) => setNewMedewerker({ ...newMedewerker, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Functie"
                value={newMedewerker.functie}
                onChange={(e) => setNewMedewerker({ ...newMedewerker, functie: e.target.value })}
              />
              <div>
                <button onClick={handleNewMedewerker}>Toevoegen</button>
                <button onClick={() => setShowNewMedewerkerForm(false)}>Annuleren</button>
              </div>
            </div>
          )}
          <ul className="no-dots">
            {medewerkers.map((medewerker) => (
              <li key={medewerker.id} onClick={() => handleMedewerkerClick(medewerker)}>
                {medewerker.name}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {selectedMedewerker && (
            <>
              <h2>Details voor {selectedMedewerker.name}</h2>
              <div className="details-grid">
                <div className="label">Email:</div>
                <div className="value">{selectedMedewerker.email}</div>
                <div className="label">Functie:</div>
                <div className="value">{selectedMedewerker.functie}</div>
              </div>
              <div className="taken-header">
                <h3>Taken</h3>
                <button 
                  className="remove-completed-button"
                  onClick={handleRemoveCompletedTasks}
                >
                  Verwijder afgerond
                </button>
              </div>
              <ul className="no-dots">
                {Object.entries(selectedMedewerker.taken).map(([key, task]) => (
                  <li key={key}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={selectedMedewerker.checkedTasks[key] || false}
                        onChange={() => handleTaskCheck(key)}
                      />
                      <span style={{
                        textDecoration: selectedMedewerker.checkedTasks[key] ? 'line-through' : 'none'
                      }}>
                        {task}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="add-task">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nieuwe taak"
                />
                <button onClick={handleAddTask}>Toevoegen</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Medewerkers;
