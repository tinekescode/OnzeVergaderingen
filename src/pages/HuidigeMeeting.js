import React, { useState, useEffect, useRef } from 'react';
import initialData from '../data/initialData';
import { 
  loadNotes, 
  saveNotes, 
  loadSelectedAgendaItem, 
  saveSelectedAgendaItem, 
  loadMedewerkers, 
  saveMedewerkers, 
  loadExtractedTasks, 
  saveExtractedTasks,
  loadTaskAssignmentStatus,
  saveTaskAssignmentStatus
} from '../utils/storage';
import './HuidigeMeeting.css';

function HuidigeMeeting() {
  const currentMeeting = initialData.Gepland[0];
  const [notes, setNotes] = useState(() => loadNotes());
  const [selectedItem, setSelectedItem] = useState(() => loadSelectedAgendaItem());
  const [showTasks, setShowTasks] = useState(true); // Always show if tasks exist
  const [extractedTasks, setExtractedTasks] = useState(() => loadExtractedTasks());
  const [medewerkers, setMedewerkers] = useState(() => {
    const saved = loadMedewerkers();
    return saved || initialData.Medewerkers;
  });
  const [tasksAssigned, setTasksAssigned] = useState(() => loadTaskAssignmentStatus());
  const [assignmentStatus, setAssignmentStatus] = useState(() => loadTaskAssignmentStatus());
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedAgendaIndex, setSelectedAgendaIndex] = useState(0);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveSelectedAgendaItem(selectedItem);
  }, [selectedItem]);

  useEffect(() => {
    saveExtractedTasks(extractedTasks);
  }, [extractedTasks]);

  useEffect(() => {
    saveTaskAssignmentStatus(assignmentStatus);
  }, [assignmentStatus]);

  const handleNoteChange = (agendaItemKey, value) => {
    setNotes(prev => ({
      ...prev,
      [agendaItemKey]: value
    }));
  };

  const handleItemClick = (key) => {
    setSelectedItem(selectedItem === key ? null : key);
  };

  const cleanupTaskText = (taskText, medewerkerName) => {
    return taskText
      .replace(/^(actie|taak):\s*/i, '')  // Remove 'Actie:' or 'Taak:' from start
      .replace(new RegExp(`${medewerkerName}\\s*-\\s*`, 'i'), '')  // Remove name and dash
      .replace(new RegExp(`${medewerkerName}`, 'i'), '')  // Remove just the name if no dash
      .trim();
  };

  const handleExtractTasks = () => {
    const tasksByMedewerker = {};
    
    currentMeeting.attendees.forEach(attendeeId => {
      const medewerker = initialData.Medewerkers.find(m => m.id === attendeeId);
      if (medewerker) {
        tasksByMedewerker[medewerker.id] = [];
      }
    });

    Object.values(notes).forEach(note => {
      if (note.trim()) {
        // Split by both sentences and line breaks
        const segments = note
          .split(/(?:[.!?]+[\s\n]+|[\n]+)/)
          .map(segment => segment.trim())
          .filter(segment => segment.length > 0);

        segments.forEach(segment => {
          if (segment.toLowerCase().match(/^(actie|taak):/)) {
            currentMeeting.attendees.forEach(attendeeId => {
              const medewerker = initialData.Medewerkers.find(m => m.id === attendeeId);
              if (medewerker && segment.toLowerCase().includes(medewerker.name.toLowerCase())) {
                const cleanedTask = cleanupTaskText(segment, medewerker.name);
                if (cleanedTask) {
                  tasksByMedewerker[medewerker.id].push(cleanedTask);
                }
              }
            });
          }
        });
      }
    });

    setExtractedTasks(tasksByMedewerker);
    setShowTasks(true);
  };

  const handleAssignTasks = () => {
    const updatedMedewerkers = medewerkers.map(medewerker => {
      const medewerkerTasks = extractedTasks[medewerker.id] || [];
      if (medewerkerTasks.length > 0) {
        const currentTasksCount = Object.keys(medewerker.taken).length;
        const newTasks = medewerkerTasks.reduce((acc, task, index) => {
          acc[(currentTasksCount + index + 1).toString()] = task;
          return acc;
        }, {});

        return {
          ...medewerker,
          taken: {
            ...medewerker.taken,
            ...newTasks
          }
        };
      }
      return medewerker;
    });

    setMedewerkers(updatedMedewerkers);
    saveMedewerkers(updatedMedewerkers);
    setTasksAssigned(true);
    setAssignmentStatus({
      ...assignmentStatus,
      [currentMeeting.id]: true
    });
    setTasksAssigned({
      ...tasksAssigned,
      [currentMeeting.id]: true
    });
    saveTaskAssignmentStatus({
      ...tasksAssigned,
      [currentMeeting.id]: true
    });
  };

  const handleNoteKeyDown = (e, currentIndex) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      const totalItems = Object.keys(currentMeeting.agenda).length;
      
      if (nextIndex < totalItems) {
        handleAgendaItemClick(nextIndex);
      }
    }
  };

  const handleAgendaItemSelect = (index) => {
    setSelectedItemIndex(index);
    // Focus the corresponding textarea
    const textarea = document.querySelector(`textarea[data-index="${index}"]`);
    if (textarea) {
      textarea.focus();
    }
  };

  useEffect(() => {
    // Auto-select and focus the first agenda item on initial load
    if (currentMeeting && Object.keys(currentMeeting.agenda).length > 0) {
      handleAgendaItemSelect(0);
    }
  }, [currentMeeting]);

  const handleAgendaItemClick = (index) => {
    setSelectedAgendaIndex(index);
    // Focus the textarea after selecting the item
    setTimeout(() => {
      const textarea = document.querySelector('.notes-field');
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e, currentIndex) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      const totalItems = Object.keys(currentMeeting.agenda).length;
      
      if (nextIndex < totalItems) {
        handleAgendaItemClick(nextIndex);
      }
    }
  };

  return (
    <div>
      <h1>Huidige Meeting</h1>
      <h2>{currentMeeting.title}</h2>
      <div className="instructions">
        <p>
          Tijdens de vergadering kunt u taken toewijzen aan medewerkers door in de notities te beginnen met "Actie:" of "Taak:" 
          gevolgd door de naam van de medewerker. Deze taken worden later automatisch verzameld.
        </p>
        <p className="example">
          Bijvoorbeeld: "Actie: Jan Jansen - Rapport opstellen voor volgende vergadering"
        </p>
      </div>
      <div className="attendees-overview">
        <h3>Aanwezigen</h3>
        <ul className="attendees-list">
          {currentMeeting.attendees.map(attendeeId => {
            const medewerker = initialData.Medewerkers.find(m => m.id === attendeeId);
            return medewerker ? (
              <li key={medewerker.id}>
                {medewerker.name} - {medewerker.functie}
              </li>
            ) : null;
          })}
        </ul>
      </div>
      <div className="agenda-list">
        {Object.entries(currentMeeting.agenda).map(([key, item], index) => (
          <div key={key} className="agenda-item">
            <div 
              className={`agenda-header ${selectedAgendaIndex === index ? 'active' : ''}`}
              onClick={() => handleAgendaItemClick(index)}
            >
              {index + 1}. {item}
            </div>
            {selectedAgendaIndex === index && (
              <textarea
                className="notes-field"
                value={notes[key] || ''}
                onChange={(e) => handleNoteChange(key, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="Notities..."
              />
            )}
          </div>
        ))}
        {!tasksAssigned[currentMeeting.id] && (
          <div className="extract-tasks">
            <button 
              className="extract-tasks-button"
              onClick={handleExtractTasks}
            >
              Taken extraheren
            </button>
          </div>
        )}
        {showTasks && Object.keys(extractedTasks).length > 0 && (
          <div className="extracted-tasks">
            <h3>Geëxtraheerde taken per medewerker</h3>
            {Object.entries(extractedTasks).map(([medewerkerId, tasks]) => {
              const medewerker = initialData.Medewerkers.find(m => m.id === parseInt(medewerkerId));
              if (medewerker && tasks.length > 0) {
                return (
                  <div key={medewerkerId} className="medewerker-tasks">
                    <h4>{medewerker.name}</h4>
                    <ul className="no-dots">
                      {tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })}
            <div className="task-actions">
              {!assignmentStatus[currentMeeting.id] ? (
                <>
                  <p className="review-message">
                    Controleer de taken hierboven en klik op de knop om ze toe te voegen aan de takenlijsten van de medewerkers.
                  </p>
                  <button 
                    className="assign-tasks-button"
                    onClick={handleAssignTasks}
                  >
                    Taken toewijzen aan medewerkers
                  </button>
                </>
              ) : (
                <p className="success-message">
                  ✓ Taken zijn reeds toegewezen aan de medewerkers
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HuidigeMeeting;
