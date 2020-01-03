const BASE_URL = "http://localhost:3000"
const $markerList = document.querySelector(".marker-list")
const $errorMessage = document.querySelector(".error-message")
const $loginLink = document.querySelector(".login-link")

const token = localStorage.getItem("token")
    ? `bearer ${localStorage.getItem("token")}`
    : null
token ? setLogout() : setLogin()

const options = {
    headers: {
        "Authorization": token
    },
}

fetch(`${BASE_URL}/markers`, options)
    .then(parseResponse)
    .then(createMarkers)
    .then(displayMarkers)
    .catch(displayError)

$markerList.addEventListener("click", toggleFavorite)

function parseResponse(response){
    return response.json()
}

function createMarkers({ markers }){
    return markers.map(createMarker)
}

function displayMarkers($markers){
    return $markers
        .forEach($marker => $markerList.append($marker))
}

function createMarker(marker){
    const $li = document.createElement("li")
    $li.dataset.markerId = marker.id

    if (marker.is_favorite) $li.classList.add("active")

    $li.innerHTML = `
        <div>
            <h3>${marker.label}</h3>
            <img src="/images/${marker.image_url}" alt="${marker.label}" />
        </div>
    `

    return $li
}

function displayError(error){
    $errorMessage.textContent = error.message
}

function toggleFavorite(event){
    if (event.target.tagName !== "UL"){
        const element = findNearestLi(event.target)
        token && element.classList.contains("active")
            ? unfavoriteMarker(element.dataset.markerId)
            : favoriteMarker(element.dataset.markerId)
        element.classList.toggle("active")
    }
}

function favoriteMarker(markerId){
    return fetch(`${BASE_URL}/markers/${markerId}/favorite`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
}

function unfavoriteMarker(markerId){
    return fetch(`${BASE_URL}/markers/${markerId}/unfavorite`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
}

function findNearestLi(element){
    return element.tagName == "LI"
        ? element
        : findNearestLi(element.parentNode)
}

function setLogin(){
    $loginLink.innerHTML = `<a href="/login.html">Login</a>`
}

function setLogout(){
    $loginLink.innerHTML = `<a href="#">Logout</a>`
    $loginLink.addEventListener("click", logout)
}

function logout(){
    localStorage.removeItem("token")
    window.location.reload()
}
