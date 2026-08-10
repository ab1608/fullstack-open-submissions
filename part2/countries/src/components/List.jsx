const List = ({ items }) => {
  return (
    <ul>
      {items.map((i) => {
        const uuid = self.crypto.randomUUID();
        return <li key={uuid}>{i}</li>;
      })}
    </ul>
  );
};

export default List;
