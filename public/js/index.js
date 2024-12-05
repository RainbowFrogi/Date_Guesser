////// -------- Map ------------- 

const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5
}).addTo(map);

////// -------- Countries --------

const geoJsonUrl = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

//// The Default Style Of The Countries
const defaultStyle = {
    color: 'black',
    weight: 1,
    fillOpacity: 0.01
};

//// Handle Hover And Click
const highlightStyle = {
    color: '#60DE65',
    weight: 2,
    fillOpacity: 0.7
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

/// Clicked Country
let clickedCountry = null; 
let currentClickedLayer = null;

let geojsonLayer = L.geoJson(null, {
    style: defaultStyle,
    onEachFeature: function (feature, layer) {
        //// Handle Hover Visuals
        layer.on({
            mouseover: function (e) {
                const layer = e.target;
                if (layer !== currentClickedLayer) {
                    layer.setStyle(highlightStyle);
                }
            },
            //// Handle Hover Visuals
            mouseout: function (e) {
                const layer = e.target;
                if (layer !== currentClickedLayer) {
                    resetStyle(e);
                }
            },
            /// Handle The Map Selection
            click: function (e) {
                const layer = e.target;
                const countryName = feature.properties.name;

                if (currentClickedLayer && currentClickedLayer !== layer) {
                    resetStyle({ target: currentClickedLayer });
                }

                //// Make Sure Only 1 Country Can Be Selected And Saved
                if (currentClickedLayer !== layer) {

                    currentClickedLayer = layer;
                    clickedCountry = countryName;
                    layer.setStyle({
                        color: 'black',
                        weight: 2,
                        fillColor: highlightStyle.color,
                        fillOpacity: 0.8
                    });
                } else {

                    //// Make Sure To UnHighlight The Countries, If Player Chooses To Change Guess
                    resetStyle(e);
                    currentClickedLayer = null;
                    clickedCountry = null;
                }

                console.log("Selected country:", clickedCountry);
            }
        });
    }
});

fetch(geoJsonUrl)
    .then(response => response.json())
    .then(data => geojsonLayer.addData(data).addTo(map));


fetch(geoJsonUrl)
    .then(response => response.json())
    .then(data => geojsonLayer.addData(data).addTo(map));

////// --------- SLIDEBAR ------------

const slider = document.getElementById('yearSlider');
const display = document.getElementById('yearDisplay');

slider.oninput = function() {
  display.textContent = this.value;
}

//// After User Has Set The Date And Selected The Country Proceed To Calculate The Answer
const submitGuess = document.querySelector(".takeGuess").addEventListener("click", () => {
    
})