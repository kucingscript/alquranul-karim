const content = document.getElementById("content");
const modalContainer = document.getElementById("modal-container");

const loadData = async () => {
  try {
    const data = await fetchData();
    updateUI(data);
  } catch (error) {
    content.innerHTML = showError(error.message);
  }
};

loadData();

async function fetchData(param = "") {
  try {
    const response = await fetch(
      `https://quran-api.santrikoding.com/api/surah/${param}`
    );

    if (!response.ok) {
      throw new Error("Failed fetch data");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

function showError(message) {
  return `
        <div class="col-md-6 mx-auto">
            <div class="alert alert-danger my-auto" role="alert">
                <h1 class="fw-normal mb-2">Error</h1>
                <p class="fw-light my-auto">${message}</p>
            </div>
        </div>
    `;
}

function updateUI(params) {
  let result = "";

  params.forEach((param) => (result += showCards(param)));
  content.innerHTML = "";
  content.insertAdjacentHTML("beforeend", result);
}

function showCards(param) {
  return `
    <div class="col-md-4">
      <div class="card my-2">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-normal">${param.nama_latin}</h5>
            <h5 class="fw-normal">${param.nama}</h5>
          </div>
          <span class="my-3 fw-light">${param.arti}</span>
          <p class="fw-light mb-3">${filter(param.deskripsi)}</p>
          <button class="btn btn-outline-primary rounded-1 btn-detail" data-id="${
            param.nomor
          }" data-bs-toggle="modal" data-bs-target="#modalBox">baca surat ini</button>
        </div>
      </div>
    </div>
    `;
}

function filter(param) {
  const limit = 50;
  return param.substring(0, limit) + "...";
}

window.addEventListener("click", async (event) => {
  if (event.target.classList.contains("btn-detail")) {
    try {
      const id = event.target.dataset.id;
      const data = await fetchData(id);
      updateModalUI(data);
    } catch (error) {
      modalContainer.innerHTML = showError(error.message);
    }
  }
});

function updateModalUI(param) {
  modalContainer.innerHTML = "";
  const result = showDetail(param);
  modalContainer.insertAdjacentHTML("beforeend", result);
}

function showDetail(param) {
  return `
    <div class="bg-light p-4 rounded">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="fw-normal">${param.nama_latin}</h5>
        <h5 class="fw-normal">${param.nama}</h5>
      </div>
      <span class="fw-light my-3">${param.arti}</span>
      <p class="fw-light">${param.deskripsi}</p>
    </div>
    <ul class="list-group mt-3">
      ${showAyat(param.ayat)}
    </ul>
    `;
}

function showAyat(params) {
  let result = "";
  params.forEach((param) => (result += listAyat(param)));
  return result;
}

function listAyat(param) {
  return `
    <li class="list-group-item p-3">
      <div class="d-flex align-items-center mb-3">
        surat ke ${param.surah}, ayat ke ${param.nomor}
      </div>
      <p class="fw-light">${param.idn}</p>
      <p class="fw-normal text-end my-3">${param.ar}</p>
      <p class="fw-light text-end my-auto">${param.tr}</p>
    </li>
    `;
}

const input = document.querySelector(".search-input");
const submitButton = document.querySelector(".btn-submit");

input.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    await searchAndDisplayResults();
  }
});

submitButton.addEventListener("click", async (event) => {
  await searchAndDisplayResults();
});

async function searchAndDisplayResults() {
  try {
    content.innerHTML = "";
    const data = await fetchData();
    const value = input.value.trim().toLowerCase();
    searchData(value, data);
    input.value = "";
  } catch (error) {
    content.innerHTML = showError(error.message);
  }
}

function searchData(value, params) {
  params.forEach((param) => {
    const { nama_latin, arti, tempat_turun } = param;
    findData(param, value, nama_latin, arti, tempat_turun);
  });
}

function findData(data, value, ...params) {
  let str = "";
  params.forEach((param) => (str += param.toLowerCase()));
  if (str.indexOf(value) != -1) return (content.innerHTML += showCards(data));
}
