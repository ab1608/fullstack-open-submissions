import { useState, useEffect } from 'react';
import Persons from './components/Persons.jsx';
import Filter from './components/Filter.jsx';
import Form from './components/Form.jsx';
import axios from 'axios';
import personService from './services/person.js';
import Notification from './components/Notification.jsx';

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  /*
  Resources are fetched from the server with HTTP GET requests. 
  For instance, an HTTP GET request to the URL notes/3 will return the note that has the id number 3. 
  An HTTP GET request to the notes URL would return a list of all notes.
  */
  useEffect(() => {
    personService.getAll().then((r) => setPersons(r.data));
  }, []);

  const personsToShow =
    newFilter.length > 0
      ? persons.filter((p) => p.name.toUpperCase().includes(newFilter.toUpperCase()))
      : persons;

  const handleNewName = (event) => {
    const newName = event.target.value;
    setNewName(newName);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const updateNotification = (message, successCode) => {
    setMessage(message);
    setSuccess(successCode);
    setTimeout(() => {
      setMessage(null);
      setSuccess(null);
    }, 5_000);
  };

  const addContact = (event) => {
    event.preventDefault();
    const existingNames = persons.filter((p) => p.name.toUpperCase() === newName.toUpperCase());
    if (existingNames.length > 0) {
      updateContact(newName);
    } else {
      const newContact = {
        name: newName,
        number: newNumber,
      };
      personService.create(newContact).then((r) => {
        setPersons(persons.concat(r.data));
        const msg = `${newContact.name} was created`;
        updateNotification(msg, 1);
        setNewName('');
        setNewNumber('');
      });
    }
  };

  const updateContact = (contactName) => {
    event.preventDefault();
    const contactForUpdate = persons.find(
      (p) => p.name.toUpperCase() === contactName.toUpperCase(),
    );

    if (
      window.confirm(
        `${contactForUpdate.name} is already in the phonebook. Do you want to update their number?`,
      )
    ) {
      // Spread operator to unpack properties an object
      const updatedInfo = { ...contactForUpdate, number: newNumber };
      personService
        .update(contactForUpdate.id, updatedInfo)
        .then((r) => {
          setPersons(persons.map((p) => (p.id === contactForUpdate.id ? r.data : p)));
          const msg = `${contactForUpdate.name} was updated`;
          updateNotification(msg, 1);
          setNewName('');
          setNewNumber('');
        })
        .catch((err) => {
          const msg = `${contactForUpdate.name} may have already been removed`;
          updateNotification(msg, 0);
        });
    }
  };

  const removeContact = (contactID) => {
    event.preventDefault();
    const contactForDeletion = persons.find((p) => p.id === contactID);

    if (window.confirm(`Do you want to delete ${contactForDeletion.name}?`)) {
      personService.remove(contactForDeletion.id).then((r) => {
        const updatedContacts = persons.filter((p) => p.id !== contactForDeletion.id);
        setPersons(updatedContacts);
      });
    }
  };

  if (persons) {
    return (
      <div>
        <h2>Phonebook</h2>
        <Filter onFilter={handleFilter} />
        <h3>Add a new number</h3>
        <Notification message={message} successStatus={success} />
        <Form
          handleNewName={handleNewName}
          handleNewNumber={handleNewNumber}
          addContact={addContact}
        />
        <h3>Numbers</h3>
        <Persons persons={personsToShow} onRemoval={removeContact} />
      </div>
    );
  }
};

export default App;
