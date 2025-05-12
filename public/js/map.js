/**
 * map.js
 * 
 * Creates an interactive Leaflet map for a specific vacation spot information page using geocoding through Nominatim API.
 */

//  returns an object containing the longitude and latitude for a given city and country using Nominatim API
const getCoordinates = async (city, country) => {
    const location = `${city}, ${country}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return {lat, lon};
      } else {
        throw "Location not found";
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
};

//  creates Leaflet map after DOM has been loaded
document.addEventListener('DOMContentLoaded', async () => {
    const mapElement = document.getElementById('map');
    const city = mapElement.dataset.city;
    const country = mapElement.dataset.country;
    const coords = await getCoordinates(city, country);
    const map = L.map('map').setView([coords.lat, coords.lon], 13);       //  setting location to vacation spot
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // interactive popup marker 
    L.marker([coords.lat, coords.lon]).addTo(map)
      .bindPopup('Your vacation spot!')
      .openPopup();
});