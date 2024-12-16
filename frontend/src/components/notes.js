import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Notes.css'; // Import the CSS for styling

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  // Fetch Notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          history.push('/login');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/notes', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotes(res.data || []);
      } catch (error) {
        setError('Failed to fetch notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [history]);

  // Input Change Handler
  const handleChange = (e) => {
    setNewNote({ ...newNote, [e.target.name]: e.target.value });
  };

  // Create New Note
  const createNote = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/notes',
        newNote,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes([...notes, { _id: res.data._id, ...newNote }]);
      resetForm();
    } catch (error) {
      setError('Failed to create note.');
    }
  };

  // Edit Existing Note
  const updateNote = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/notes/${editingNote._id}`,
        newNote,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes(
        notes.map((note) =>
          note._id === editingNote._id ? { ...note, ...newNote } : note
        )
      );
      resetForm();
    } catch (error) {
      setError('Failed to update note.');
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      setError('Failed to delete note.');
    }
  };

  // Reset Form and Popup
  const resetForm = () => {
    setNewNote({ title: '', content: '' });
    setEditingNote(null);
    setShowPopup(false);
  };

  // Open Popup for Editing
  const handleEdit = (note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content });
    setShowPopup(true);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  // Filter Notes
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="notes-container">
      <h2>Your Notes</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowPopup(true)}>Create Note</button>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.map((note) => (
          <div key={note._id} className="note-card" onClick={() => handleEdit(note)}>
            <h3>{note.title}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note._id);
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Popup for Create/Edit Note */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{editingNote ? 'Edit Note' : 'Create Note'}</h3>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newNote.title}
              onChange={handleChange}
            />
            <textarea
              name="content"
              placeholder="Content"
              rows="8"
              value={newNote.content}
              onChange={handleChange}
            />
            <div className="popup-buttons">
              <button onClick={editingNote ? updateNote : createNote}>
                {editingNote ? 'Update' : 'Create'}
              </button>
              <button onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
  onClick={handleLogout}
  className="logout-btn"
  style={{
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    marginTop: '20px',
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
>
  Logout
</button>

    </div>
  );
};

export default Notes;

