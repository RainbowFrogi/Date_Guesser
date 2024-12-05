////// -------- Map ------------- 

  const map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 5
  }).addTo(map);

////// -------- Countries --------

  const geoJsonUrl = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

  const defaultStyle = {
      color: '#3388ff',
      weight: 1,
      fillOpacity: 0.2
  };

  const highlightStyle = {
      color: '#ff0000',
      weight: 2,
      fillOpacity: 0.6
  };

  const correctStyle = {
      color: '#00ff00',
      weight: 2,
      fillOpacity: 0.6
  };

  function resetStyle(e) {
      geojsonLayer.resetStyle(e.target);
  }

////// --------- Handle Map Guess ------------

  let geojsonLayer = L.geoJson(null, {
      style: defaultStyle,
      onEachFeature: function (feature, layer) {
          layer.on({
              mouseover: function (e) {
                  const layer = e.target;
                  layer.setStyle(highlightStyle);
              },
              mouseout: resetStyle,

              ////// Handle The Click Of The Map -----------

              click: function (e) {
                  const countryName = feature.properties.name;
                  const resultDiv = document.getElementById('result');
                  if (countryName === correctCountry) {
                      resultDiv.innerHTML = `<p>Correct! The photo was taken in ${countryName}.</p>`;
                      layer.setStyle(correctStyle);
                  } else {
                      resultDiv.innerHTML = `<p>Wrong! You selected ${countryName}. Try again.</p>`;
                  }
              }
          });
      }
  });
  fetch(geoJsonUrl)
      .then(response => response.json())
      .then(data => geojsonLayer.addData(data).addTo(map));

////// --------- SLIDEBAR ------------

const slider = document.getElementById('yearSlider');
const display = document.getElementById('yearDisplay');

slider.oninput = function() {
    display.textContent = this.value;
  }
