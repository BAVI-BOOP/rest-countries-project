let dropdown = document.getElementById("world");
dropdown.length = 0;

const image = document.getElementById("countries");

let defaultOption = document.createElement("option");
defaultOption.text = "Choose State/Province";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

const url = "https://restcountries.com/v2/all";

fetch(url)
  .then(function (response) {
    if (response.status !== 200) {
      console.warn(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      let option;

      for (let i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.text = data[i].name;
        option.value = data[i].name;
        dropdown.add(option);
      }
    });
  })
  .catch(function (err) {
    console.error("Fetch Error -", err);
  });

const fetchCountryByName = (name) => {
  const url = `https://restcountries.com/v3.1/name/${name}`;
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        renderError(`Something went wrong: ${res.status}`);
        throw new Error();
      }
      return res.json();
    })
    .then((data) => renderCountries(data))
    .catch((err) => console.log(err));
};

const renderError = () => {
  const countryDiv = document.querySelector(".countries");
  countryDiv.innerHTML += `
      <h2>Countries can not fetched</h2>
      <img src="./img/404.png" alt="" />
    `;
};

const renderCountries = (data) => {
  console.log(data);
  const countryDiv = document.querySelector(".countries");
  const {
    capital,
    currencies,
    flags: { svg },
    languages,
    name: { common },
    region,
  } = data[0];

  console.log(Object.values(languages));
  console.log(Object.values(currencies)[0].name);
  console.log(Object.values(currencies)[0].symbol);

  countryDiv.innerHTML = "";

  countryDiv.innerHTML += `
      <div class="card mx-auto m-3 shadow-lg" style="width: 18rem;">
        <img src="${svg}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${common}</h5>
          <p class="card-text">${region}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <i class="fas fa-lg fa-landmark"></i> ${capital}
          </li>
          <li class="list-group-item">
            <i class="fas fa-lg fa-comments"></i> ${Object.values(languages)}
          </li>
          <li class="list-group-item">
            <i class="fas fa-lg fa-money-bill-wave"></i> ${
              Object.values(currencies)[0].name
            },
            ${Object.values(currencies)[0].symbol},
          </li>
        </ul>
      </div>
    `;
};
dropdown.addEventListener("change", (event) => {
  fetchCountryByName(event.target.value);
});
