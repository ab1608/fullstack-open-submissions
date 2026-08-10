import Item from './Item';
import Country from './Country';

const Countries = ({ countries, handleFullDetail }) => {
  // Add a false "fullDetail" property so that each country's detail state
  // is managed by the Country component
  // Create a new array with the "isVisible" flag added

  if (countries.length > 10) {
    return <div>Too many matches. Specify another filter</div>;
  } else if (countries.length > 1 && countries.length < 10) {
    return countries.map((c) => (
      <Item
        key={c.id}
        countryID={c.id}
        commonName={c.name.common}
        capitalCity={c.capital}
        areaCode={c.area}
        languages={c.languages}
        lat={c.latlng[0]}
        lon={c.latlng[1]}
        fullDetail={c.fullDetail}
        handleFullDetail={handleFullDetail}
      />
    ));
  }
  // When there is only one country, show more details
  return countries.map((c) => (
    <Country
      key={c.id}
      countryID={c.id}
      commonName={c.name.common}
      capitalCity={c.capital}
      areaCode={c.area}
      languages={c.languages}
      lat={c.latlng[0]}
      lon={c.latlng[1]}
      fullDetail={true}
    />
  ));
};

export default Countries;
