import { useState, useEffect } from "react";
import personService from "./services/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTelephoneNo, setNewTelephoneNo] = useState("");
  const [filter, setFilter] = useState("");
  const [notifMessage, setNotifMessage] = useState({
    message: "",
    isError: false,
  });

  const hook = () => {
    personService
      .getAll()
      .then((data) => setPersons(data))
      .catch((error) => {
        setNotifMessage({
          message: `Failed to fetch persons from server`,
          isError: true,
        });
        setTimeout(() => {
          setNotifMessage({ message: null, isError: false });
        }, 5000);
      });
  };
  useEffect(hook, []);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      telephoneNo: newTelephoneNo,
    };

    const existingPerson = persons.find((p) => p.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already in the phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingPerson.id, newPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id === existingPerson.id ? updatedPerson : p
              )
            );
            setNotifMessage({
              message: `Number of ${existingPerson.name} has been changed!`,
              isError: false,
            });
            setTimeout(() => {
              setNotifMessage({ message: null, isError: false });
            }, 5000);
          })
          .catch((error) => {
            setNotifMessage({
              message: `Information of ${existingPerson.name} has already been removed from the server!`,
              isError: true,
            });
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
            setTimeout(() => {
              setNotifMessage({ message: null, isError: false });
            }, 5000);
          });
      }
    } else {
      personService
        .create(newPerson)
        .then((data) => {
          setPersons(persons.concat(data));
          setNewName("");
          setNewTelephoneNo("");
          setNotifMessage({
            message: `${data.name} has been added!`,
            isError: false,
          });
          setTimeout(() => {
            setNotifMessage({ message: null, isError: false });
          }, 5000);
        })
        .catch((error) => {
          setNotifMessage({
            message: error.response.data.error,
            isError: true,
          });
          setTimeout(() => {
            setNotifMessage({ message: null, isError: false });
          }, 5000);
        });
    }
  };

  const remove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch(() => {
          setNotifMessage({
            message: `Information of ${name} has already been removed from the server!`,
            isError: true,
          });
          setPersons(persons.filter((p) => p.id !== id));
          setTimeout(() => {
            setNotifMessage({ message: null, isError: false });
          }, 5000);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleTelephoneNoChange = (event) => {
    setNewTelephoneNo(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newTelephoneNo={newTelephoneNo}
        onTelephoneNoChange={handleTelephoneNoChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} onDelete={remove} />
      <Notification
        message={notifMessage.message}
        isError={notifMessage.isError}
      />
    </div>
  );
};

const Filter = ({ value, onChange }) => {
  return (
    <p>
      filter shown with <input value={value} onChange={onChange} />
    </p>
  );
};

const PersonForm = ({
  onSubmit,
  newName,
  onNameChange,
  newTelephoneNo,
  onTelephoneNoChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        telephone:{" "}
        <input value={newTelephoneNo} onChange={onTelephoneNoChange} />
      </div>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ filteredPersons, onDelete }) => {
  return (
    <>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.telephoneNo}{" "}
          <button onClick={() => onDelete(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </>
  );
};

const Notification = ({ message, isError }) => {
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  let selectedStyle = null;

  if (isError) {
    selectedStyle = errorStyle;
  } else {
    selectedStyle = notificationStyle;
  }

  if (!message) {
    return null;
  }

  return <div style={selectedStyle}>{message}</div>;
};

export default App;
