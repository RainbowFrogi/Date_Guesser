let locationID = null;

////// -------- Map -------------

const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 5,
}).addTo(map);

////// -------- Countries --------

const geoJsonUrl =
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

//// The Default Style Of The Countries
const defaultStyle = {
    color: "black",
    weight: 1,
    fillOpacity: 0.01,
};

//// Handle Hover And Click
const highlightStyle = {
    color: "#60DE65",
    weight: 2,
    fillOpacity: 0.7,
};

const correctStyle = {
    color: "#00ff00",
    weight: 2,
    fillOpacity: 0.6,
};

function resetStyle(e) {
    geojsonLayer.resetStyle(e.target);
}

////// --------- Make Button Clickable Only After Player Has Selected A Country

const submitButton = document.querySelector(".takeGuess");

submitButton.disabled = true;

////// --------- Handle Map Guess ------------

/// Clicked Country
let clickedCountry = null; /// <----- THE COUNTRY THAT PLAYER HAS SELECTED !!!

let currentClickedLayer = null; /// Part Of The Function Not To Be Confused With the Top One /// Helps With The Selection Of Only One Country

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
                submitButton.disabled = false; //// After A Country Is Clicked Make The Submit Button Available

                if (currentClickedLayer && currentClickedLayer !== layer) {
                    resetStyle({ target: currentClickedLayer });
                }

                //// Make Sure Only 1 Country Can Be Selected And Saved
                if (currentClickedLayer !== layer) {
                    currentClickedLayer = layer;
                    clickedCountry = countryName;
                    layer.setStyle({
                        color: "black",
                        weight: 2,
                        fillColor: highlightStyle.color,
                        fillOpacity: 0.8,
                    });
                } else {
                    //// Make Sure To UnHighlight The Countries, If Player Chooses The Same Country
                    resetStyle(e);
                    currentClickedLayer = null;
                    clickedCountry = null;
                    submitButton.disabled = true;
                }

                console.log("Selected country:", clickedCountry);
            },
        });
    },
});

fetch(geoJsonUrl)
    .then((response) => response.json())
    .then((data) => geojsonLayer.addData(data).addTo(map));

fetch(geoJsonUrl)
    .then((response) => response.json())
    .then((data) => geojsonLayer.addData(data).addTo(map));

////// --------- SLIDEBAR ------------

const slider = document.getElementById("yearSlider"); ///// SlideBar Year
const display = document.getElementById("yearDisplay");

slider.oninput = function () {
    display.textContent = this.value;
};

//// After User Has Set The Date And Selected The Country Proceed To Calculate The Answer

submitButton.addEventListener("click", submitTheGuess);

async function submitTheGuess() {
    try {
        const sendGuessData = {
            country: clickedCountry, /// The Country The Player Selected
            year: slider.value, //// SlideBar Year
            id: locationID, //// Location ID
        };

        const response = await fetch("/api/game/guess/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendGuessData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error("Error submitting guess:", error);
    }
}

///// Get The Random Picture

async function getTheRandomLocation() {
    fetch("/api/game/location/random/")
        .then((response) => {
            if (response.ok) {
                console.log("Response", response);
                return response.json();
            }
            throw new Error("Something went wrong");
        })
        .then((responseJson) => {
            console.log("ResponseJSON", responseJson);
            locationID = responseJson.location_id;
            document.getElementById("photo").src = responseJson.path;
        })
        .catch((error) => {
            console.log(error);
        });
}
getTheRandomLocation()

/// Image Zoom

let currentZoom = 1;
let minZoom = 1;
let maxZoom = 3;
let stepSize = 0.1;

let container = document.getElementById("photo-container");

container.addEventListener("wheel", function (event) {
    // Zoom in or out based on the scroll direction
    let direction = event.deltaY > 0 ? -1 : 1;
    zoomImage(direction);
});

function zoomImage(direction) {
    let newZoom = currentZoom + direction * stepSize;

    // Limit the zoom level to the minimum and maximum
    // values
    if (newZoom < minZoom || newZoom > maxZoom) {
        return;
    }

    currentZoom = newZoom;

    // Update the CSS transform of the image to scale it
    let image = document.querySelector("#photo");
    image.style.transform = "scale(" + currentZoom + ")";
}