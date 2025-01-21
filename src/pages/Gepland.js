import React, { useState, useEffect } from 'react';
import initialData from '../data/initialData';
import { loadMeetings, saveMeetings } from '../utils/storage';
import './Gepland.css'; // Import the CSS file

function Gepland() {
  const [meetings, setMeetings] = useState(() => {
    const saved = loadMeetings();
    if (saved) {
      // Ensure each meeting has attendees array
      return saved.map(meeting => ({
        ...meeting,
        attendees: meeting.attendees || initialData.Gepland.find(m => m.id === meeting.id)?.attendees || []
      }));
    }
    return initialData.Gepland;
  });
  
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [agendaItem, setAgendaItem] = useState('');
  const [activeTab, setActiveTab] = useState('agenda');
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
  });
  const [showAttendeeSelector, setShowAttendeeSelector] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    saveMeetings(meetings);
  }, [meetings]);

  useEffect(() => {
    if (selectedMeeting) {
      const updatedMeeting = meetings.find(meeting => meeting.id === selectedMeeting.id);
      setSelectedMeeting(updatedMeeting);
    }
  }, [meetings]);

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleAddAgendaItem = () => {
    if (selectedMeeting && agendaItem.trim()) {
      const newAgenda = { ...selectedMeeting.agenda, [Object.keys(selectedMeeting.agenda).length + 1]: agendaItem };
      const updatedMeeting = { ...selectedMeeting, agenda: newAgenda };
      setSelectedMeeting(updatedMeeting);
      setMeetings(meetings.map(meeting => meeting.id === updatedMeeting.id ? updatedMeeting : meeting));
      setAgendaItem('');
    }
  };

  const handleRearrangeAgendaItem = (index, direction) => {
    if (selectedMeeting) {
      const agendaEntries = Object.entries(selectedMeeting.agenda);
      if (index < 0 || index >= agendaEntries.length) return;

      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= agendaEntries.length) return;

      const [movedItem] = agendaEntries.splice(index, 1);
      agendaEntries.splice(newIndex, 0, movedItem);

      const newAgenda = {};
      agendaEntries.forEach(([key, value], idx) => {
        newAgenda[idx + 1] = value;
      });

      const updatedMeeting = { ...selectedMeeting, agenda: newAgenda };
      setSelectedMeeting(updatedMeeting);
      setMeetings(meetings.map(meeting => meeting.id === updatedMeeting.id ? updatedMeeting : meeting));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddAgendaItem();
    }
  };

  const handleNewMeeting = () => {
    if (newMeeting.title && newMeeting.date) {
      const meeting = {
        id: Math.max(...meetings.map(m => m.id)) + 1,
        title: newMeeting.title,
        date: newMeeting.date,
        agenda: {},
        attendees: []
      };
      
      setMeetings([...meetings, meeting]);
      setNewMeeting({ title: '', date: '' });
      setShowNewMeetingForm(false);
      setSelectedMeeting(meeting);
      setActiveTab('agenda');
    }
  };

  const handleAddAttendee = (medewerkerId) => {
    if (selectedMeeting) {
      const attendees = [...(selectedMeeting.attendees || [])];
      if (!attendees.includes(medewerkerId)) {
        const updatedMeeting = {
          ...selectedMeeting,
          attendees: [...attendees, medewerkerId]
        };
        setSelectedMeeting(updatedMeeting);
        setMeetings(meetings.map(meeting => 
          meeting.id === updatedMeeting.id ? updatedMeeting : meeting
        ));
      }
    }
  };

  const handleRemoveAttendee = (medewerkerId) => {
    if (selectedMeeting) {
      const updatedMeeting = {
        ...selectedMeeting,
        attendees: selectedMeeting.attendees.filter(id => id !== medewerkerId)
      };
      setSelectedMeeting(updatedMeeting);
      setMeetings(meetings.map(meeting => 
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      ));
    }
  };

  const handleEditAgendaItem = (key, item) => {
    setEditingItem(key);
    setEditedText(item);
  };

  const handleSaveEdit = (key) => {
    if (selectedMeeting && editedText.trim()) {
      const newAgenda = { ...selectedMeeting.agenda, [key]: editedText };
      const updatedMeeting = { ...selectedMeeting, agenda: newAgenda };
      setSelectedMeeting(updatedMeeting);
      setMeetings(meetings.map(meeting => 
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      ));
      setEditingItem(null);
      setEditedText('');
    }
  };

  const handleDeleteAgendaItem = (keyToDelete) => {
    if (selectedMeeting) {
      const newAgenda = Object.entries(selectedMeeting.agenda)
        .filter(([key]) => key !== keyToDelete)
        .reduce((acc, [key, value], index) => {
          acc[index + 1] = value;
          return acc;
        }, {});

      const updatedMeeting = { ...selectedMeeting, agenda: newAgenda };
      setSelectedMeeting(updatedMeeting);
      setMeetings(meetings.map(meeting => 
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      ));
    }
  };

  return (
    <div>
      <h1>Gepland</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <div className="meetings-header">
            <h2>Meetings</h2>
            <button onClick={() => setShowNewMeetingForm(true)}>Nieuwe Meeting</button>
          </div>
          {showNewMeetingForm && (
            <div className="new-meeting-form">
              <input
                type="text"
                placeholder="Titel"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              />
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
              <div>
                <button onClick={handleNewMeeting}>Toevoegen</button>
                <button onClick={() => setShowNewMeetingForm(false)}>Annuleren</button>
              </div>
            </div>
          )}
          <ul className="no-dots">
            {meetings.map((meeting) => (
              <li key={meeting.id} onClick={() => handleMeetingClick(meeting)}>
                {formatDate(meeting.date)} - {meeting.title}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          {selectedMeeting && (
            <>
              <h2>{selectedMeeting.title}</h2>
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'agenda' ? 'active' : ''}`}
                  onClick={() => setActiveTab('agenda')}
                >
                  Agenda
                </button>
                <button 
                  className={`tab ${activeTab === 'uitgenodigd' ? 'active' : ''}`}
                  onClick={() => setActiveTab('uitgenodigd')}
                >
                  Uitgenodigd
                </button>
              </div>
              {activeTab === 'agenda' ? (
                <>
                  <ul className="no-dots">
                    {Object.entries(selectedMeeting.agenda).map(([key, item], index) => (
                      <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ flex: 1 }}>
                          {index + 1}.{' '}
                          {editingItem === key ? (
                            <input
                              type="text"
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              onBlur={() => handleSaveEdit(key)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(key)}
                              autoFocus
                            />
                          ) : (
                            <span onDoubleClick={() => handleEditAgendaItem(key, item)}>
                              {item}
                            </span>
                          )}
                        </span>
                        <button onClick={() => handleRearrangeAgendaItem(index, -1)} disabled={index === 0}>&uarr;</button>
                        <button onClick={() => handleRearrangeAgendaItem(index, 1)} disabled={index === Object.entries(selectedMeeting.agenda).length - 1}>&darr;</button>
                        <button onClick={() => handleDeleteAgendaItem(key)} className="delete-button">&times;</button>
                      </li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    value={agendaItem}
                    onChange={(e) => setAgendaItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add new agenda item"
                  />
                  <button onClick={handleAddAgendaItem}>Add</button>
                </>
              ) : (
                <div className="attendees">
                  <h3>Uitgenodigde medewerkers</h3>
                  <ul className="no-dots">
                    {(selectedMeeting.attendees || []).map(attendeeId => {
                      const medewerker = initialData.Medewerkers.find(m => m.id === attendeeId);
                      return medewerker ? (
                        <li key={medewerker.id}>
                          {medewerker.name} - {medewerker.functie}
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <button 
                    className="add-attendee-button"
                    onClick={() => setShowAttendeeSelector(!showAttendeeSelector)}
                  >
                    {showAttendeeSelector ? "Verberg medewerkers" : "Voeg medewerker toe"}
                  </button>
                  {showAttendeeSelector && (
                    <div className="attendee-selector">
                      <h3>Beschikbare medewerkers</h3>
                      <ul className="no-dots">
                        {initialData.Medewerkers.map(medewerker => (
                          <li key={medewerker.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={(selectedMeeting.attendees || []).includes(medewerker.id)}
                                onChange={() => {
                                  if ((selectedMeeting.attendees || []).includes(medewerker.id)) {
                                    handleRemoveAttendee(medewerker.id);
                                  } else {
                                    handleAddAttendee(medewerker.id);
                                  }
                                }}
                              />
                              {medewerker.name} - {medewerker.functie}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gepland;
