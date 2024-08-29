import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CountryInfo = () => {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/name/${name}`)
      .then(response => {
        const filteredCountry = response.data.find(
          (country) => country.name.common.toLowerCase() === name.toLowerCase()
        );
        if (filteredCountry) {
          setCountry(filteredCountry);
        } else {
          setError("Country not found");
        }
      })
      .catch(() => {
        setError("Failed to fetch country details");
      });
  }, [name]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!country) {
    return <div>Loading...</div>;
  }

  const { region, languages, translations } = country;
  const languagesList = languages ? Object.values(languages).join(', ') : 'N/A';
  const translatedOfficialName = translations?.rus?.official || 'N/A';
  const translatedName = translations?.rus?.common || 'N/A';

  const handleBackClick = () => {
    const fromPage = location.state?.fromPage || 1;
    navigate(`/?page=${fromPage}`);
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3" onClick={handleBackClick}>
        ← Back to list
      </button>
      <h2>{country.name.official} ({country.name.common})</h2>
      <p><strong>Capital:</strong> {country.capital}</p>
      <p><strong>Region:</strong> {region}</p>
      <p><strong>Languages:</strong> {languagesList}</p>
      <p><strong>Population:</strong> {country.population}</p>
      <p><strong>Name in Russian:</strong> {translatedOfficialName} ({translatedName})</p>
      <img 
        src={country.flags.svg} 
        alt={`${country.name.common} flag`} 
        width="150" 
        style={{ border: '2px solid #000', padding: '2px', backgroundColor: '#fff' }} 
      />
    </div>
  );
};

export default CountryInfo;
