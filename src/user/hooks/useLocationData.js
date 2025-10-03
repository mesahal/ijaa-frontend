import { useState, useEffect, useCallback } from 'react';
import { getCountries, getCitiesByCountry } from '../../services/api/locationApi';

/**
 * Custom hook for managing location data (countries and cities)
 */
export const useLocationData = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const countriesData = await getCountries();
      setCountries(countriesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cities for a specific country
  const fetchCities = useCallback(async (countryId) => {
    if (!countryId) {
      setCities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const citiesData = await getCitiesByCountry(countryId);
      setCities(citiesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get country name by ID
  const getCountryName = useCallback((countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : '';
  }, [countries]);

  // Get city name by ID
  const getCityName = useCallback((cityId) => {
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : '';
  }, [cities]);

  // Load countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return {
    countries,
    cities,
    loading,
    error,
    fetchCities,
    getCountryName,
    getCityName,
    refetchCountries: fetchCountries
  };
};
