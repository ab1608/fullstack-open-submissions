import { useState, useEffect } from 'react';
import countryService from './services/country';
import Countries from './components/Countries';

const App = () => {
  const [query, setQuery] = useState(null);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    if (!countryData) {
      countryService
        .getAll()
        .then((r) => {
          /* Introduce:
        - "fullDetail" property to control how much information show be displayed
        - "id" to avoid React errors        
        */
          setCountryData(r.data.map((c) => ({ ...c, fullDetail: false, id: c.cca3 })));
        })
        .catch((e) => console.log(`error encountered: ${e}`));
    }
  });

  const countryDisplay = !query
    ? countryData
    : countryData.filter((c) => c.name.common.toUpperCase().includes(query.toUpperCase()));

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  const toggleDetail = (id) => {
    event.preventDefault();

    const selectedCountry = countryData.find((c) => c.id === id);
    const country = { ...selectedCountry, fullDetail: !selectedCountry.fullDetail };

    const updatedCountries = countryData.map((c) => (c.id === id ? country : c));
    setCountryData(updatedCountries);
  };

  if (countryData) {
    return (
      <div>
        <form>
          find countries <input onChange={handleQuery}></input>
        </form>
        <Countries countries={countryDisplay} handleFullDetail={toggleDetail} />
      </div>
    );
  } else return null;
};

export default App;
