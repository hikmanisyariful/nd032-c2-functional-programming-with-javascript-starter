let store = Immutable.Map({
  user: { name: "Student" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  display: false
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const NavigationRover = state => {
  const rovers = state.get("rovers");
  return rovers.map(rover => {
    return `
                <div class="rover">
                    <button class="btn-nav" type="button" id="${rover}" onclick="handleClick(${rover})">
                        ${rover}                   
                    </button>
                </div>
            `;
  });
};

const handleClick = button => {
  const selectedRover = button.id;
  getDataRover(selectedRover);
};

const App = state => {
  return `
        <header>
            <div>
                <h1>Galery of Mars Rovers</h1>
                <h4>Please, choose which rover’s information you want to see</h4>
            <div>
            <nav class="rover-nav">
                ${NavigationRover(state)}
            </nav>
        </header>
        <main>
            <div class="main-info">
                ${InformationRover(state)}
            </div>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// 1. Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

const InformationRover = state => {
  const cameraEachRover = state.get("cameraEachRover");
  const roverName = state.get("isRover");

  if (!cameraEachRover || cameraEachRover.length === 0) {
    return ``;
  }

  return `
    <div class="sub-info">
        <h2>${roverName}</h2>
        ${JSON.stringify(cameraEachRover)}
    </div>
  `;
};

// const EachCamera = camera => {
//   return `
//         <h3>${camera.camera.full_name}</h3>
//         <
//     `;
// };

/*
const Greeting = name => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};
*/

// 2. Example of a pure function that renders infomation requested from the backend

/*
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};
*/

// ------------------------------------------------------  API CALLS

// 3. Example API call
const getDataRover = roverName => {
  fetch(`http://localhost:3000/rover/${roverName}`)
    .then(res => res.json())
    .then(({ data }) => {
      const lastIdCamera = (acc, curr) => {
        if (curr.camera.name === acc.camera.name) {
          if (curr.id > acc.id) {
            return curr;
          }
        }
        return acc;
      };

      const getLatesPhotosEachCamera = (acc, curr, i, arr) => {
        acc[curr.camera.name] =
          acc[curr.camera.name] === undefined
            ? curr
            : lastIdCamera(acc[curr.camera.name], curr);

        if (i + 1 === arr.length) {
          return Object.values(acc);
        }
        return acc;
      };

      const cameraEachRover = data.photos.reduce(getLatesPhotosEachCamera, {});
      console.log("Ini Data", cameraEachRover);
      const isRover = roverName;
      updateStore(store, { cameraEachRover, isRover });
    });
};

/*
const getImageOfTheDay = () => {
  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));
};
*/
