import apiClient from './apiClient';

/**
 * Location API service for managing countries and cities
 */

/**
 * Fetch all countries
 * @returns {Promise<Array>} Array of country objects with id and name
 */
export const getCountries = async () => {
  try {
    const response = await apiClient.get('/locations/countries');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries');
  }
};

/**
 * Fetch cities for a specific country
 * @param {number} countryId - The ID of the country
 * @returns {Promise<Array>} Array of city objects with id, name, and countryId
 */
export const getCitiesByCountry = async (countryId) => {
  try {
    const response = await apiClient.get(`/locations/countries/${countryId}/cities`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Failed to fetch cities');
  }
};

/**
 * Get country name by ID
 * @param {number} countryId - The ID of the country
 * @returns {Promise<string>} Country name
 */
export const getCountryName = async (countryId) => {
  try {
    const countries = await getCountries();
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : '';
  } catch (error) {
    console.error('Error fetching country name:', error);
    return '';
  }
};

/**
 * Get city name by ID and country ID
 * @param {number} cityId - The ID of the city
 * @param {number} countryId - The ID of the country
 * @returns {Promise<string>} City name
 */
export const getCityName = async (cityId, countryId) => {
  try {
    const cities = await getCitiesByCountry(countryId);
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : '';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return '';
  }
};
