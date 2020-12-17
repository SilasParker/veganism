
    var scrollerComments = [];
    var map;
    document.getElementById("search-geolocation").onclick = function() {getGeolocation();};
    document.getElementById("review-submit").onclick = function() {submitReview();};
    document.getElementById("search-submit").onclick = function() {searchLocation();};
    
    
    function initMap() {
        let mapProp;
        if (window.screen.width < 769) {
            mapProp = {
                center: new google.maps.LatLng(50.835160, -0.137110), zoom: 1,
                disableDefaultUI: true,
                zoomControl: true
            };
        } else {
            mapProp = {
                center: new google.maps.LatLng(50.835160, -0.137110), zoom: 15,
            };
        }
    
        map = new google.maps.Map(document.getElementById("map"), mapProp);
        document.getElementById("search-bar").addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("search-submit").click();
            }
        });
    }
    
    function displayResults(element) {
        let list = document.getElementById("results-unordered-list");
        let listElement = document.createElement("li");
        listElement.appendChild(element);
        list.appendChild(listElement);
    
    }
    
    
    
    async function submitReview() {
        let stars = document.getElementsByClassName("review-star-input");
        let veganism = document.getElementsByClassName("review-vegan-input");
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
                this.displayReviewMessage("Sorry, you have already reviewed this restaurant within the last week. Please wait until next week to try again");
    
    
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
                        document.getElementsByClassName("cell-5")[0].style.visibility = 'hidden';
                        this.displayReviewMessage("Thanks for the review!");
                    })
                    .catch(function (error) {
                        this.displayReviewMessage("Your request failed: " + error);
    
                    });
            }
        } else {
            this.displayReviewMessage("Please fill required areas (marked by red asterix)");
            document.getElementById("write-review").style.visibility = "visible";
        }
    }
    
    function displayReviewMessage(messageText) {
        let message = document.getElementById("review-message");
        message.style.display = "block";
        message.innerHTML = messageText;
        document.getElementById("write-review").style.visibility = "hidden";
        message.style.visibility = "visible";
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
                map.setZoom(15);
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
        document.getElementById("search-geolocation-error").style.visibility = "visible";
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
                return 6 - (i + 1);
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
            document.getElementById("results-unordered-list").innerHTML = "";
            scrollerComments = [];
            let labels = "ABCDEFGHIJKLMNOPQRST";
            for (let i = 0; i < results.length; i++) {
                let result = new Result(results[i]);
                await result.setResults();
                let marker = new google.maps.Marker({ position: results[i].geometry.location, icon: 'images/markers/marker' + labels[i] + '.png' });
    
    
                let comments = result.generateComments(labels[i]);
                if (comments) {
                    for (let j = 0; j < comments.length; j++) {
                        scrollerComments.push(comments[j]);
                    }
                }
    
                let newElement = await result.setResults(labels[i]);
                displayResults(newElement);
    
                marker.setMap(map);
                marker.addListener("click", () => {
                    this.markerClicked(newElement, marker, result);
                })
            }
            document.getElementById("results-list").style.visibility = "visible";
            document.getElementById("search-geolocation-error").style.visibility = "hidden";
            await this.scrollThroughComments();
        }
    }
    
    function markerClicked(resultElement, marker, result) {
        resultElement.scrollIntoView();
        map.setZoom(16);
        map.setCenter(marker.getPosition());
        result.updateForm();
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
                    map.setZoom(15);
                    document.getElementById("search-geolocation-error").style.visibility = "hidden";
                    findAllClosestRestaurants(results[0].geometry.location, service);
                } else {
                    document.getElementById("search-geolocation-error").innerHTML = "No Results Nearby";
                    document.getElementById("search-geolocation-error").style.visibility = "visible";
                }
            } else {
                document.getElementById("search-geolocation-error").innerHTML = "No Connection to Google Maps API";
                document.getElementById("search-geolocation-error").style.visibility = "visible";
            }
        })
    }
    
    function scrollThroughComments() {
        if (scrollerComments.length > 0) {
            let randomIndex = Math.floor(Math.random() * scrollerComments.length);
            let commentToAssess = scrollerComments[randomIndex];
            document.getElementsByClassName("cell-8")[0].style.display = "none";
            commentToAssess.setHTML();
            setTimeout(() => { this.scrollThroughComments(); }, 10000);
        } else {
            document.getElementById("scroller-restaurant-name").innerHTML = "No Reviewed Local Restaurants, Sorry!";
            document.getElementById("scroller-rating-user").innerHTML = "";
            document.getElementById("scroller-rating-veganism").innerHTML = "";
            document.getElementById("scroller-comment-text").innerHTML = "Feel free to leave a review for your favourite local vegan restaurant";
            document.getElementById("scroller-author-text").innerHTML = "";
            document.getElementById("scroller-report-btn").style.visibility = "hidden";
    
    
        }
    }
    
    

