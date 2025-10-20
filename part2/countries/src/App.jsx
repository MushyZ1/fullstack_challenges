import { useState, useEffect } from "react";
import countriesService from "./services/countries";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countriesService
      .getAll()
      .then((initialCountries) => setAllCountries(initialCountries));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <DisplayFiltered filter={filter} allCountries={allCountries} />
    </>
  );
}

const DisplayFiltered = ({ filter, allCountries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filtered = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  // Render a single country’s full details
  const renderCountryDetails = (country) => {
    const languageNames = Object.values(country.languages || {});
    return (
      <>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital?.[0]}</p>
        <p>Area: {country.area}</p>
        <h3>Languages:</h3>
        <ul>
          {languageNames.map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      </>
    );
  };

  if (filtered.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (selectedCountry) {
    return (
      <div>
        {renderCountryDetails(selectedCountry)}
        <button onClick={() => setSelectedCountry(null)}>Back</button>
      </div>
    );
  }

  if (filtered.length > 1) {
    return (
      <div>
        {filtered.map((country) => (
          <p key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </p>
        ))}
      </div>
    );
  }

  if (filtered.length === 1) {
    return renderCountryDetails(filtered[0]);
  }

  return <p>No countries found</p>;
};

export default App;
