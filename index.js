var scrollerComments = [];
var map;

function initMap() {
    var mapProp = {
        center: new google.maps.LatLng(50.835160, -0.137110), zoom: 15,
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);


}

function displayResults(element) {
    let list = document.getElementById("results-ordered-list");
    let listElement = document.createElement("li");
    listElement.appendChild(element);
    list.appendChild(listElement);

}

async function submitReview() {
    let stars = document.getElementsByClassName("review-star");
    let veganism = document.getElementsByClassName("review-veganism");
    stars = checkRating(stars);
    veganism = checkRating(veganism);
    let name = document.getElementById("author-input").value;
    if (stars && veganism && name) {

        let comment = document.getElementById("comment-input").value;
        if (comment === "Comment goes here...") {
            comment = "";
        }
        let restaurantID = document.getElementById("write-review").getElementsByTagName("h2")[0].id;
        if (this.alreadyReviewed(restaurantID)) {
            alert("Sorry, you have already reviewed this restaurant within the last week. Please wait until next week to try again");
        } else {
            let bodyData = "restaurantID=" + restaurantID + "&stars=" + stars + "&veganism=" + veganism + "&name=" + name + "&comment=" + comment;
            await fetch("https://sp1178.brighton.domains/AdvWebApp/Veganism191120/api.php", {
                method: 'POST',
                body: bodyData,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
                .then(function (data) {
                    this.setCookie(restaurantID);
                    console.log("Request succeeded with response", data);
                    document.getElementById("author-input").value = "";
                    document.getElementById("comment-input").value = "";
                    let radioStar = document.getElementsByName("radStar");
                    let radioVeganism = document.getElementsByName("radVeganism");
                    for (var i = 0; i < 5; i++) {
                        radioStar[i].checked = false;
                        radioVeganism[i].checked = false;
                    }
                    document.getElementsByClassName("column-right")[0].style.visibility = 'hidden';
                    alert("Thanks for the review!");
                })
                .catch(function (error) {
                    alert("Your request failed: " + error);
                });
        }


    }
}

function setCookie(restaurantID) {
    let date = new Date();
    date.setTime(date.getTime() + 604800000);
    let expires = ";expires" + date.toUTCString();
    let cookieName = "veganism" + Date.now() + "=";
    document.cookie = cookieName + restaurantID + expires + ";path=/";

}

function alreadyReviewed(restaurantID) {
    let allCookies = document.cookie.split(";");
    for (var i = 0; i < allCookies.length; i++) {
        let substringStart = allCookies[i].indexOf('=');
        if (allCookies[i].substr(substringStart + 1) === restaurantID) {
            return true;
        }
    }
    return false;
}


function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById("search-geolocation-error").hidden = true;
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
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

async function generateNearbyRestaurants(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        document.getElementById("results-ordered-list").innerHTML = "";
        scrollerComments = [];
        let labels = "ABCDEFGHIJKLMNOPQRST";
        for (let i = 0; i < results.length; i++) {
            let result = new Result(results[i]);
            await result.setResults();
            let marker = new google.maps.Marker({ position: results[i].geometry.location, label: labels[i] });
            marker.setMap(map);
            let comments = result.generateComments();
            if (comments) {
                for (let j = 0; j < comments.length; j++) {
                    scrollerComments.push(comments[j]);
                }
            }

            let newElement = await result.setResults();
            displayResults(newElement);
        }
        await this.scrollThroughComments();
    }
}

function searchLocation() {
    let query = document.getElementById("search-bar").value;
    const request = {
        query: query,
        fields: ["geometry"]
    };
    let service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results[0]) {
                map.setCenter(results[0].geometry.location);
                findAllClosestRestaurants(results[0].geometry.location, service);
            } else {
                console.log("No results to show");
            }
        } else {
            console.log("No connection to Maps API");
        }
    })
}

function scrollThroughComments() {
    if (scrollerComments.length > 0) {
        let randomIndex = Math.floor(Math.random() * scrollerComments.length);
        let commentToAssess = scrollerComments[randomIndex];
        commentToAssess.setHTML(); //y u no work
        setTimeout(() => { this.scrollThroughComments(); }, 10000);
    } else {
        document.getElementById("scroller-restaurant-name").innerHTML = "No Reviewed Local Restaurants, Sorry!";
        document.getElementById("scroller-rating-user").innerHTML = "";
        document.getElementById("scroller-rating-veganism").innerHTML = "";
        document.getElementById("scroller-comment-text").innerHTML = "Feel free to leave a review for your favourite local vegan restaurant";
        document.getElementById("scroller-author-text").innerHTML = "";
        document.getElementById("scroller-report-btn").style.visibility = "hidden";
        document.getElementById("scroller-photo-img").style.display = "none";

    }
}

/*
        document.getElementById("scroller-restaurant-name").innerHTML = this.restaurantName;
        document.getElementById("scroller-rating-user").innerHTML = this.rating;
        document.getElementById("scroller-rating-veganism").innerHTML = this.veganism;
        document.getElementById("scroller-comment-text").innerHTML = this.comment;
        document.getElementById("scroller-author-text").innerHTML = this.name;
        let comment = this;
        document.getElementById("scroller-report-btn").onclick = async function() {await comment.reportComment();};
        if (this.photo) {
            document.getElementById("scroller-photo-img").src = this.photo[0].getUrl();
            document.getElementById("scroller-photo-img").width = 200;
            document.getElementById("scroller-photo-img").height = 150;
        }
        */