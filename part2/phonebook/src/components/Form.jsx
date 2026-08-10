const Form = ({ handleNewName, handleNewNumber, addContact }) => {
  return (
    <form>
      <div>
        {' '}
        name: <input onChange={handleNewName} />{' '}
      </div>
      <div>
        {' '}
        number: <input onChange={handleNewNumber} />{' '}
      </div>
      <div>
        {' '}
        <button type="submit" onClick={addContact}>
          add
        </button>
      </div>
    </form>
  );
};

export default Form;
