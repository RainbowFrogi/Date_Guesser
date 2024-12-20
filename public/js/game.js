
let locationID = null;

let rounds = 1;

let points = 0;

let roundResults = null;


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

////// --------- Handle Map Guess ------------

let clickedCountry = null; /// <----- THE COUNTRY THAT PLAYER HAS SELECTED !!!

let currentClickedLayer = null; /// Part Of The Function Not To Be Confused With the Top One. Helps With The Selection Of Only One Country.

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


//// Send The Guess To The Backend for Checking

async function submitTheGuess() {
  try {
    console.log(slider.value)
    const sendGuessData = {
      country: clickedCountry, /// The Country The Player Selected
      year: parseInt(slider.value), //// SlideBar Year
      id: locationID //// Location ID
    };
    console.log(sendGuessData)

    const response = await fetch("/api/game/guess/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendGuessData), 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    //// Backend response

    const responseData = await response.json();

    console.log(responseData)

    roundResults = responseData;   //// Log the Data To The Global Variable For Code Cleanliness

  } catch (error) {
    console.error("Error submitting guess:", error);
  }

}

const displayDiv = document.querySelector("#displayResult");  //// The Div Where The Round Results Will Be Shown


/// Function That Resets The Round

function resetRound(){

  if (rounds === 6){
    endGame()

  } else {

    getTheRandomLocation();
    resetStyle({ target: currentClickedLayer });
    currentClickedLayer = null;
    clickedCountry = null;         //// Reset Everything 
    submitButton.disabled = true;
    submitButton.textContent = "Submit Guess";  //// Change Button Back to Submit Guess
    submitButtonRoundChange = false;
    addPoints()
    while (displayDiv.firstChild) {
      displayDiv.removeChild(displayDiv.firstChild);                     //// Clear The Results Div;
    };
  }
};


function displayResult(){
    const informPlayerCountry = document.createElement("p");           ///// Inform About Their Country Results
    informPlayerCountry.textContent = `${roundResults.message_country}`;
    displayDiv.appendChild(informPlayerCountry);

    const informPlayerYear = document.createElement("p");
    informPlayerYear.textContent = `${roundResults.message_date}`;     ///// Inform About Their Year Guess
    displayDiv.appendChild(informPlayerYear);

    const description = document.createElement("p");
    description.textContent = photoDescription;           ///// Inform About The Location
    displayDiv.appendChild(description);
};


///// Get The Random Picture From Backend

let photoDescription = ""; // Global variable for storing photo description

async function getTheRandomLocation() {
  fetch("/api/game/location/random/")
    .then((response) => {
      if (response.ok) {                   
        return response.json();
      }
      throw new Error("Something went wrong");
    })
    .then((responseJson) => {
      console.log("ResponseJSON", responseJson);
      locationID = responseJson.location_id;
      document.getElementById("photo").src = responseJson.path;   //// Display The Image Using Path From Backend
      photoDescription = responseJson.description;  //// Reset The Zoom
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

container.addEventListener("wheel", function(event) {
    // Zoom in or out based on the scroll direction
    let direction = event.deltaY > 0 ? -1 : 1;
    zoomImage(direction);
});

function zoomImage(direction)
{
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




//// UpdatePoints
function addPoints(){
  points += roundResults.points;
  document.querySelector("#currentScore").textContent = `${points}`
};

//// UpdatePoints
function addRounds(){
  rounds += 1;
  document.querySelector("#currentRound").textContent = `${rounds}`
}


/// After 5 Rounds Redirect The User To Results Page

function endGame(){
  window.location.href = `/game/result/${points}`;
}




/// Submit Button

const submitButton = document.querySelector(".takeGuess");

submitButton.disabled = true;

let submitButtonRoundChange = false;

//// ---- Change Button Behaviour After Guess And Initiate the Guess

submitButton.addEventListener("click", async function(){

  if (!submitButtonRoundChange){
    await submitTheGuess();   //// Wait For submitTheGuess To Finish Fetching Everything Before Proceeding To The Next Line
    displayResult();
    submitButtonRoundChange = true;
    //// Change The Button To "See Results" At 5th Round
    if (rounds === 5){
      submitButton.textContent = "See Results";
    } else {
      submitButton.textContent = "Next Round";
    };
  } else {
    addRounds()
    resetRound()
    roundResults = null;  //// Clear Results For Next Game
  }
})