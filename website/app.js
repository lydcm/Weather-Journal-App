/* Global Variables */

// Personal API Key for OpenWeatherMap API
let baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
let apiKey = "76fbf6dd105f969be5a6518ac5aea794";

// Create a new date instance dynamically with JS
let d = new Date();
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
let dat = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
let newDate = dat + "-" + mo + "-" + ye;

// Event listener to add function to existing HTML DOM element
document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
  const newZip = document.getElementById("zip").value;
  const newFeelings = document.getElementById("feelings").value;
  console.log(newDate);
  getTemperature(baseURL, newZip, apiKey).then(function (data) {
    // Add data to POST request
    postData("http://localhost:8000/addWeatherData", {
      temperature: data.main.temp,
      date: newDate,
      user_response: newFeelings,
    })
      // Function which updates UI
      .then(function () {
        updateUI();
      });
  });
}

/* Function called by event listener */

/* Function to GET Web API Data*/
const getTemperature = async (baseURL, zip, key) => {
  const res = await fetch(baseURL + zip + "&APPID=" + key);
  console.log(res);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

/* Function to POST data */
const postData = async (url = "", data = {}) => {
  console.log(data);
  const request = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await request.json();
    console.log(newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};


// Update UI
const updateUI = async () => {
  const req = await fetch("http://localhost:8000/all");
  try {
    const projectData = await req.json();
    document.getElementById("date").innerHTML = projectData.date;
    document.getElementById("temp").innerHTML = projectData.temperature;
    document.getElementById("content").innerHTML = projectData.user_feelings;
  } catch (error) {
    console.log("error", error);
  }
};
