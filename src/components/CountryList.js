import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CountryList = () => {
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState([]);
  const pageFromUrl = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(Number(pageFromUrl) || 1);
  const [countriesPerPage] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentPage(Number(pageFromUrl) || 1);
  }, [pageFromUrl]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        setError("Failed to fetch countries");
      });
  }, []);

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(indexOfFirstCountry, indexOfLastCountry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Country List</h2>
      <ul className="list-group mb-4">
        {currentCountries.map((country) => (
          <li key={country.cca3} className="list-group-item">
            <Link
              to={`/country/${country.name.common}`}
              state={{ fromPage: currentPage }}
            >
              {country.name.common}
            </Link>
          </li>
        ))}
      </ul>
      <Pagination 
        countriesPerPage={countriesPerPage} 
        totalCountries={countries.length} 
        paginate={paginate} 
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ countriesPerPage, totalCountries, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCountries / countriesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CountryList;