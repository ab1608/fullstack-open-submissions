import Person from './Person';

const Persons = ({ persons, onRemoval }) =>
  persons.map((p) => <Person key={p.id} person={p} onRemoval={onRemoval} />);

export default Persons;
