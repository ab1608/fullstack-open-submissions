import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);

  // The second argument determines what must change for the component to re-render
  // If empty, [], the effect is only run on the first render
  useEffect(() => {
    console.log('effect');
    axios.get('http://localhost:3001/notes').then((response) => {
      console.log('promise fulfilled');
      setNotes(response.data);
    });
  }, []);

  console.log('render', notes.length, 'notes');

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }; // Server will generate ID

    axios.post('http://localhost:3001/notes', noteObject).then((r) => {
      setNotes(notes.concat(r.data));
      setNewNote('');
    });
  };

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important }; // Make a shallow copy of the found and negate importance
    /*
    The callback function sets the component's notes state to a new array that contains all the items from the previous notes array, 
    except for the old note which is replaced by the updated version of it returned by the server
    */
    axios.put(url, changedNote).then((r) => {
      setNotes(notes.map((note) => (note.id === id ? r.data : note)));
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={toggleImportanceOf(note.id)} />
        ))}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
