export const loadMedewerkers = () => {
  const saved = localStorage.getItem('medewerkers');
  return saved ? JSON.parse(saved) : null;
};

export const saveMedewerkers = (medewerkers) => {
  localStorage.setItem('medewerkers', JSON.stringify(medewerkers));
};

export const loadMeetings = () => {
  const saved = localStorage.getItem('meetings');
  return saved ? JSON.parse(saved) : null;
};

export const saveMeetings = (meetings) => {
  localStorage.setItem('meetings', JSON.stringify(meetings));
};

export const loadNotes = () => {
  const saved = localStorage.getItem('meetingNotes');
  return saved ? JSON.parse(saved) : {};
};

export const saveNotes = (notes) => {
  localStorage.setItem('meetingNotes', JSON.stringify(notes));
};

export const loadSelectedAgendaItem = () => {
  const saved = localStorage.getItem('selectedAgendaItem');
  return saved ? JSON.parse(saved) : "1";  // default to first item
};

export const saveSelectedAgendaItem = (selectedItem) => {
  localStorage.setItem('selectedAgendaItem', JSON.stringify(selectedItem));
};

export const loadExtractedTasks = () => {
  const saved = localStorage.getItem('extractedTasks');
  return saved ? JSON.parse(saved) : {};
};

export const saveExtractedTasks = (tasks) => {
  localStorage.setItem('extractedTasks', JSON.stringify(tasks));
};

export const loadTaskAssignmentStatus = () => {
  const saved = localStorage.getItem('taskAssignmentStatus');
  return saved ? JSON.parse(saved) : {};
};

export const saveTaskAssignmentStatus = (status) => {
  localStorage.setItem('taskAssignmentStatus', JSON.stringify(status));
};

export const clearAllStorage = () => {
  localStorage.removeItem('medewerkers');
  localStorage.removeItem('meetings');
  localStorage.removeItem('meetingNotes');
  localStorage.removeItem('selectedAgendaItem');
  localStorage.removeItem('extractedTasks');
  localStorage.removeItem('taskAssignmentStatus');
  window.location.reload(); // Reload the page to reset all states
};
