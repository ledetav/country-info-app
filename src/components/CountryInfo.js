import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CountryInfo = () => {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/name/${name}`)
      .then(response => {
        setCountry(response.data[0]);
      })
      .catch(error => {
        setError("Failed to fetch country details");
      });
  }, [name]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!country) {
    return <div>Loading...</div>;
  }

  // Извлечение необходимых данных из ответа API
  const { region, languages, translations } = country;
  const languagesList = languages ? Object.values(languages).join(', ') : 'N/A';
  const translatedName = translations?.rus?.common || 'N/A';

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>
        ← Back to list
      </button>
      <h2>{country.name.common}</h2>
      <p><strong>Capital:</strong> {country.capital}</p>
      <p><strong>Region:</strong> {region}</p>
      <p><strong>Languages:</strong> {languagesList}</p>
      <p><strong>Name in Russian:</strong> {translatedName}</p>
      <img src={country.flags.svg} alt={`${country.name.common} flag`} width="150" />
    </div>
  );
};

export default CountryInfo;