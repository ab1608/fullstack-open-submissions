const Filter = ({ onFilter }) => {
  return (
    <p>
      search a contact <input onChange={onFilter} />
    </p>
  );
};

export default Filter;
