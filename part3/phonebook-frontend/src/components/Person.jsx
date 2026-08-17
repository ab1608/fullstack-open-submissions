const Person = ({ person, onRemoval }) => (
  <div>
    {person.name} {person.number}
    <button type="button" onClick={() => onRemoval(person.id)}>
      Delete
    </button>
  </div>
);

export default Person;
