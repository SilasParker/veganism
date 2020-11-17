
var map;

function initMap() {
    var mapProp = {
        center: new google.maps.LatLng(50.835160, -0.137110), zoom: 15,
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);
    let home = { lat: 50.835160, lng: -0.137110 };
    var marker = new google.maps.Marker({ position: home, animation: google.maps.Animation.BOUNCE });
    marker.setMap(map);
    var infoWindow = new google.maps.InfoWindow({
        content: "Whaddup"
    });
    infoWindow.open(map, marker);

}

async function submitReview() {
    let stars = document.getElementsByClassName("review-star");
    let veganism = document.getElementsByClassName("review-veganism");
    stars = checkRating(stars);
    veganism = checkRating(veganism);
    if (stars && veganism) {
        console.log("Stars+veganism are fine");
        let name = document.getElementById("author-input").value;
        if (name && name !== "Name goes here...") {
            console.log("name is fine");
            let comment = document.getElementById("comment-input").value;
            if (comment === "Comment goes here...") {
                comment = "";
            }
            let restaurantID = "test";
            let bodyData = "restaurantID=" + restaurantID + "&stars=" + stars + "&veganism=" + veganism + "&name=" + name + "&comment=" + comment;
            await fetch("/api.php", {
                method: 'POST',
                body: bodyData,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
                .then(function (data) {
                    console.log("Request succeeded with response", data);
                })
                .catch(function (error) {
                    console.log("Your request failed: " + error);
                });
        }
    }
}

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById("search-geolocation-error").hidden = true;
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude, longitude);
            let service = new google.maps.places.PlacesService(map);
            let latLng = {
                lat: latitude,
                lng: longitude
            };
            findAllClosestRestaurants(latLng, service);
            map.setCenter(latLng);
        }, () => {
            locationError(true)
        });
    } else {
        locationError(false);
    }
}

function locationError(browserGeoLocation) {
    if (browserGeoLocation) {
        document.getElementById("search-geolocation-error").innerHTML = "Geolocation Error: Access was denied, change settings";
    } else {
        document.getElementById("search-geolocation-error").innerHTML = "Geolocation Error: Unsupported by browser, try Chrome";
    }
    document.getElementById("search-geolocation-error").hidden = false;
}


function handleGeolocationPermission() {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        console.log(result.state);
        if (result.state == 'granted') {
            return true;
        } else if (result.state == 'prompt') {
            return setTimeout(() => { return handleGeolocationPermission(); }, 1000);
        } else if (result.state == 'denied') {
            return false;
        }
    })
}

function checkRating(radioArray) {
    for (let i = 0; i < radioArray.length; i++) {
        if (radioArray[i].checked) {
            return i + 1;
        }
    }
    return null;
}

function findAllClosestRestaurants(location, service) {
    const request = {
        location: location,
        type: ['restaurant'],
        rankBy: google.maps.places.RankBy.DISTANCE,
        openNow: true
    };
    service.nearbySearch(request, generateNearbyRestaurants);
}

function generateNearbyRestaurants(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            console.log(results[i]);
            let marker = new google.maps.Marker({ position: results[i].geometry.location });
            marker.setMap(map);

        }
    }
}

function searchLocation() {
    let query = document.getElementById("search-bar").value;
    const request = {
        query: query,
        fields: ["geometry"]
    };
    console.log(map);
    let service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results[0]) {
                map.setCenter(results[0].geometry.location);
                console.log("Search Results: Lat:", results[0].geometry.location.lat, "Long:", results[0].geometry.location.lng);
                findAllClosestRestaurants(results[0].geometry.location, service);
            } else {
                console.log("No results to show");
            }
        } else {
            console.log("No connection to Maps API");
        }
    })
}

/*
defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCj3FWGTybAg-EjXysQgCkWOxii8_ERxBA&callback=myMap"
*/

//TODO: Figure out a good structure for the results and how they could be scrolled through