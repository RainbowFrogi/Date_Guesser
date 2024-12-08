
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
const display = document.getElementById("yearDisplay"); ///// Large number showing selected year
const tooltip = document.getElementById("tooltip"); ///// Tooltip below slider "thumb" showing year

const middlePoint = 1970 ///// middlepoint of year slider for easier searching

let displayValue = 0

slider.min = 0
slider.max = (middlePoint-1800)*2;

function place_thumb() {
  //tooltip.style.left = ((slider.value-slider.min)/(slider.max-slider.min)*100) + "%";

  tooltip.style.left = (slider.offsetWidth-30)*((slider.value-slider.min)/(slider.max-slider.min)) + "px"
}

slider.oninput = function () {

  if (this.value<(slider.max/2)) {
    displayValue = 1800+parseInt(this.value)
  }
  else {
    displayValue = Math.round(middlePoint+((this.value-(this.max/2))/(this.max/2)*(2024-middlePoint)));
  }

  display.textContent = displayValue;

  place_thumb()

  tooltip.innerText = displayValue;
};

  window.onload = function () {
    place_thumb()
    display.textContent = 2024
    tooltip.innerText = 2024
}

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
};


///// Get The Random Picture From Backend

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