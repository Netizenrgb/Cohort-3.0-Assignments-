// Todo Input
let addtodobtn = document.querySelector("#addtodo");
let tododisplay = document.querySelector("#tododisplay");

function addtodo() {
  let todoinput = document.querySelector("#todoinput").value;

  if (todoinput.trim() === "") {
    alert("Please enter a task.");
    return;
  }

  let storage = JSON.parse(localStorage.getItem("tododata")) || [];

  let todoobj = {
    id: Date.now(),
    task: todoinput,
    important: false,
    complete: false,
  };

  storage.push(todoobj);

  localStorage.setItem("tododata", JSON.stringify(storage));

  document.querySelector("#todoinput").value = "";

  displaytodo();
}

addtodobtn.addEventListener("click", addtodo);

// Display Todos
function displaytodo() {
  let storage = JSON.parse(localStorage.getItem("tododata")) || [];

  tododisplay.innerHTML = "";

  storage.forEach((todo) => {
    tododisplay.innerHTML += `
      <div class="todoitem ${todo.important ? "important" : ""} ${
        todo.complete ? "completed" : ""
      }">

        <p class="todotext">
            ${todo.important ? "⭐" : ""}
            ${todo.task}
        </p>

        <div class="todobuttons">

            <button class="imp" data-id="${todo.id}">
                ${todo.important ? "Unmark" : "Important"}
            </button>

            <button class="comp" data-id="${todo.id}">
                ${todo.complete ? "Undo" : "Complete"}
            </button>

            <button class="del" data-id="${todo.id}">
                Delete
            </button>

        </div>

      </div>
    `;
  });
}

displaytodo();

// ==========================
tododisplay.addEventListener("click", function (e) {
  let id = Number(e.target.dataset.id);

  let storage = JSON.parse(localStorage.getItem("tododata")) || [];

  if (e.target.classList.contains("imp")) {
    let todo = storage.find((item) => item.id === id);

    if (todo) {
      todo.important = !todo.important;
    }
  }

  if (e.target.classList.contains("comp")) {
    let todo = storage.find((item) => item.id === id);

    if (todo) {
      todo.complete = !todo.complete;
    }
  }

  if (e.target.classList.contains("del")) {
    storage = storage.filter((item) => item.id !== id);
  }

  localStorage.setItem("tododata", JSON.stringify(storage));

  displaytodo();
});

// ------------------------------------------------
// planner

let saveplannerbtn = document.querySelector("#saveplanner");
let clearplannerbtn = document.querySelector("#clearplanner");
let displayplanner = document.querySelector("#displayplanner");

function addplanner() {
  let plannertime = document.querySelector("#timepicker").value;
  let plannerinput = document.querySelector("#plannerinput").value;

  if (plannertime === "" || plannerinput.trim() === "") {
    alert("Please fill all the fields.");
    return;
  }

  let plannerstorage = JSON.parse(localStorage.getItem("plannerdata")) || [];

  let plannerobj = {
    id: Date.now(),
    time: plannertime,
    plannerdata: plannerinput,
  };

  plannerstorage.push(plannerobj);

  localStorage.setItem("plannerdata", JSON.stringify(plannerstorage));

  document.querySelector("#timepicker").value = "";
  document.querySelector("#plannerinput").value = "";

  displayplannerdiv();
}

function displayplannerdiv() {
  let plannerstorage = JSON.parse(localStorage.getItem("plannerdata")) || [];

  displayplanner.innerHTML = "";

  plannerstorage.forEach((item) => {
    displayplanner.innerHTML += `
    
    <div class="planneritem">

        <div>
            <p class="plannertext">${item.plannerdata}</p>
            <p class="plannertime">${item.time}</p>
        </div>

        <div class="plannerbtn">
            <button class="deleteplanner" data-id="${item.id}">
                Delete
            </button>
        </div>

    </div>

    `;
  });
}

displayplanner.addEventListener("click", function (e) {
  if (e.target.classList.contains("deleteplanner")) {
    let id = Number(e.target.dataset.id);

    let plannerstorage = JSON.parse(localStorage.getItem("plannerdata")) || [];

    plannerstorage = plannerstorage.filter((item) => item.id !== id);

    localStorage.setItem("plannerdata", JSON.stringify(plannerstorage));

    displayplannerdiv();
  }
});

clearplannerbtn.addEventListener("click", function () {
  if (confirm("Delete all planners?")) {
    localStorage.removeItem("plannerdata");

    displayplannerdiv();
  }
});

saveplannerbtn.addEventListener("click", addplanner);

displayplannerdiv();

// ---------------------------------------------------------
// daily goals

let adddailygoalbtn = document.querySelector("#adddailygoal");
let cleardailygoalbtn = document.querySelector("#cleardailygoals");
let displaydailygoal = document.querySelector("#dailygoallist");
let goalprogress = document.querySelector("#goalprogress");

function adddailygoal() {
  let dailygoalinput = document.querySelector("#dailygoaltext").value;

  if (dailygoalinput.trim() === "") {
    alert("Please enter a goal.");
    return;
  }

  let goalstorage = JSON.parse(localStorage.getItem("dailygoaldata")) || [];

  let goalobj = {
    id: Date.now(),
    goal: dailygoalinput,
    complete: false,
  };

  goalstorage.push(goalobj);

  localStorage.setItem("dailygoaldata", JSON.stringify(goalstorage));

  document.querySelector("#dailygoaltext").value = "";

  displaydailygoaldiv();
}

function displaydailygoaldiv() {
  let goalstorage = JSON.parse(localStorage.getItem("dailygoaldata")) || [];

  displaydailygoal.innerHTML = "";

  let completedgoals = goalstorage.filter((item) => item.complete).length;

  goalprogress.innerText =
    completedgoals + " of " + goalstorage.length + " Completed";

  goalstorage.forEach((item) => {
    displaydailygoal.innerHTML += `

    <div class="goalitem ${item.complete ? "completed" : ""}">

        <p class="goaltext">
            ${item.goal}
        </p>

        <div class="goalbuttons">

            <button class="completegoal" data-id="${item.id}">
                ${item.complete ? "Undo" : "Complete"}
            </button>

            <button class="deletegoal" data-id="${item.id}">
                Delete
            </button>

        </div>

    </div>

    `;
  });
}

displaydailygoal.addEventListener("click", function (e) {
  let goalstorage = JSON.parse(localStorage.getItem("dailygoaldata")) || [];

  if (e.target.classList.contains("completegoal")) {
    let id = Number(e.target.dataset.id);

    let goal = goalstorage.find((item) => item.id === id);

    if (goal) {
      goal.complete = !goal.complete;
    }

    localStorage.setItem("dailygoaldata", JSON.stringify(goalstorage));

    displaydailygoaldiv();
  }

  if (e.target.classList.contains("deletegoal")) {
    let id = Number(e.target.dataset.id);

    goalstorage = goalstorage.filter((item) => item.id !== id);

    localStorage.setItem("dailygoaldata", JSON.stringify(goalstorage));

    displaydailygoaldiv();
  }
});

cleardailygoalbtn.addEventListener("click", function () {
  if (confirm("Delete all goals?")) {
    localStorage.removeItem("dailygoaldata");

    displaydailygoaldiv();
  }
});

adddailygoalbtn.addEventListener("click", adddailygoal);

displaydailygoaldiv();

// ---------------------------------------------------------------------
// Pomodoro Timer
let starttimerbtn = document.querySelector("#starttimer");
let pausetimerbtn = document.querySelector("#pausetimer");
let resettimerbtn = document.querySelector("#resettimer");
let timerdisplay = document.querySelector("#timerdisplay");

let time = 1500;
let timer = null;

function updatedisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  timerdisplay.innerText =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function starttimer() {
  if (timer !== null) {
    return;
  }

  timer = setInterval(function () {
    time--;

    updatedisplay();

    if (time <= 0) {
      clearInterval(timer);
      timer = null;

      alert("Pomodoro Session Completed!");
    }
  }, 1000);
}

function pausetimer() {
  clearInterval(timer);
  timer = null;
}

function resettimer() {
  clearInterval(timer);
  timer = null;

  time = 1500;

  updatedisplay();
}

starttimerbtn.addEventListener("click", starttimer);
pausetimerbtn.addEventListener("click", pausetimer);
resettimerbtn.addEventListener("click", resettimer);
updatedisplay();

// -----------------------------------------------------
// quote

let quote = document.querySelector("#quote");
let author = document.querySelector("#author");
let newquotebtn = document.querySelector("#newquote");

let fallbackquote = {
  quote: "Small steps, repeated daily, outrun big plans made once.",
  author: "DeskGlow",
};

async function getquote() {
  quote.innerText = "Loading Quote...";
  author.innerText = "";

  newquotebtn.disabled = true;
  try {
    let response = await fetch("https://dummyjson.com/quotes/random");

    if (!response.ok) {
      throw new Error("Failed to fetch quote.");
    }

    let data = await response.json();

    quote.innerText = `"${data.quote}"`;
    author.innerText = "- " + data.author;
  } catch (error) {
    quote.innerText = `"${fallbackquote.quote}"`;
    author.innerText = "- " + fallbackquote.author;

    console.log(error);
  }
  newquotebtn.disabled = false;
}
newquotebtn.addEventListener("click", getquote);
getquote();
// ------------------------------------
// weather

let weathericon = document.querySelector("#weathericon");
let weathertemp = document.querySelector("#weathertemp");
let weatherplace = document.querySelector("#weatherplace");

let defaultlocation = {
  lat: 19.076,
  lon: 72.8777,
  city: "Mumbai",
};

function weatheremoji(code) {
  if (code === 0) {
    return "☀️";
  }

  if (code === 1 || code === 2) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if (code === 45 || code === 48) {
    return "🌫️";
  }

  if (code >= 51 && code <= 67) {
    return "🌧️";
  }

  if (code >= 71 && code <= 86) {
    return "🌨️";
  }

  if (code >= 95) {
    return "⛈️";
  }

  return "🌡️";
}

async function getcity(lat, lon) {
  try {
    let response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );

    let data = await response.json();

    return data.city || data.locality || "Current Location";
  } catch {
    return "Current Location";
  }
}

async function getweather(lat, lon, city) {
  try {
    let response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
    );

    if (!response.ok) {
      throw new Error("Unable to fetch weather.");
    }

    let data = await response.json();

    let current = data.current_weather;

    weathericon.innerText = weatheremoji(current.weathercode);

    weathertemp.innerText = Math.round(current.temperature) + "°C";

    weatherplace.innerText = city;
  } catch (error) {
    weathericon.innerText = "⚠️";
    weathertemp.innerText = "--°C";
    weatherplace.innerText = "Offline";

    console.log(error);
  }
}

function loadweather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let city = await getcity(lat, lon);

        getweather(lat, lon, city);
      },

      function () {
        getweather(
          defaultlocation.lat,
          defaultlocation.lon,
          defaultlocation.city,
        );
      },
    );
  } else {
    getweather(defaultlocation.lat, defaultlocation.lon, defaultlocation.city);
  }
}

loadweather();
// --------------------------------------------------
// date and time

let timedisplay = document.querySelector("#time");
let datedisplay = document.querySelector("#date");
let herogreeting = document.querySelector("#herogreeting");

let timeinterval = null;

function updatedatetime() {
  let currentdate = new Date();

  let hours = currentdate.getHours();
  let minutes = String(currentdate.getMinutes()).padStart(2, "0");

  let period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  timedisplay.innerText = hours + ":" + minutes + " " + period;

  let dateoptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  datedisplay.innerText = currentdate.toLocaleDateString(
    undefined,
    dateoptions,
  );

  let currenthour = currentdate.getHours();

  if (currenthour >= 5 && currenthour < 12) {
    herogreeting.innerText = "Morning";
  } else if (currenthour >= 12 && currenthour < 17) {
    herogreeting.innerText = "Afternoon";
  } else if (currenthour >= 17 && currenthour < 21) {
    herogreeting.innerText = "Evening";
  } else {
    herogreeting.innerText = "Night";
  }
}

updatedatetime();

if (timeinterval === null) {
  timeinterval = setInterval(updatedatetime, 1000);
}
// ---------------------------------------------------------------
// theme

let themebtn = document.querySelector("#themebtn");
let sunicon = document.querySelector("#sunicon");
let moonicon = document.querySelector("#moonicon");

function updatethemeicon() {
  let currenttheme = document.documentElement.getAttribute("data-theme");

  if (currenttheme === "light") {
    sunicon.style.display = "block";
    moonicon.style.display = "none";
  } else {
    sunicon.style.display = "none";
    moonicon.style.display = "block";
  }
}

function changetheme() {
  let currenttheme = document.documentElement.getAttribute("data-theme");

  if (currenttheme === "light") {
    document.documentElement.setAttribute("data-theme", "dark");

    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");

    localStorage.setItem("theme", "light");
  }

  updatethemeicon();
}

themebtn.addEventListener("click", changetheme);

let savedtheme = localStorage.getItem("theme");

if (savedtheme) {
  document.documentElement.setAttribute("data-theme", savedtheme);
} else {
  document.documentElement.setAttribute("data-theme", "light");
}

updatethemeicon();
// --------------------------------------
// Dynamic Background

let tintcolor = {
  morning: "167, 199, 231",
  afternoon: "247, 199, 158",
  evening: "233, 168, 202",
  night: "168, 142, 235",
};

function backgroundtime(hour) {
  if (hour >= 5 && hour < 11) {
    return "morning";
  }

  if (hour >= 11 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "evening";
  }

  return "night";
}

function updatebackground() {
  let currenthour = new Date().getHours();

  let currenttime = backgroundtime(currenthour);

  document.documentElement.style.setProperty("--tint", tintcolor[currenttime]);
}

updatebackground();

setInterval(updatebackground, 300000);

// --------------------------------------
// Background Images

let bgphotos = ["images/comet.jpg", "images/village.jpg", "images/clouds.jpg"];

function setrandombackground() {
  let choice = bgphotos[Math.floor(Math.random() * bgphotos.length)];

  document.documentElement.style.setProperty("--bg-image", `url("${choice}")`);
}

setrandombackground();
