
function initMap() {
    var mapProp = {
        center: new google.maps.LatLng(50.835160, -0.137110), zoom: 15,
    };
    var map = new google.maps.Map(document.getElementById("map"), mapProp);
    let home = { lat: 50.835160, lng: -0.137110 };
    var marker = new google.maps.Marker({ position: home, animation: google.maps.Animation.BOUNCE });
    marker.setMap(map);
    var infoWindow = new google.maps.InfoWindow({
        content:"Whaddup"
    });
    infoWindow.open(map,marker);

}

async function submitReview() {
    let stars = document.getElementsByClassName("review-star");
    let veganism = document.getElementsByClassName("review-veganism");
    stars = checkRating(stars);
    veganism = checkRating(veganism);
    if(stars && veganism) {
        console.log("Stars+veganism are fine");
        let name = document.getElementById("author-input").value;
        if(name && name !== "Name goes here...") {
            console.log("name is fine");
            let comment = document.getElementById("comment-input").value;
            if(comment === "Comment goes here...") {
                comment = "";
            }
            let restaurantID = "testlmao";
            let data = {
                restaurantID: restaurantID,
                stars: stars,
                veganism: veganism,
                name: name,
                comment: comment
            }
            const confirm = await fetch("api.php", {
                method: 'POST',
                body: JSON.stringify(data)
            });
            console.log(confirm.json());
        }
    }
}

function checkRating(radioArray) {
    for(let i = 0;i<radioArray.length;i++) {
        if(radioArray[i].checked) {
            return i+1;
        }
    }
    return null;
}

function allClosestRestaurants() {
    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=50.83516,-0.13711&radius=1500&type=restaurant&rankby=distance&key=AIzaSyCj3FWGTybAg-EjXysQgCkWOxii8_ERxBA"
}

/*
defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCj3FWGTybAg-EjXysQgCkWOxii8_ERxBA&callback=myMap"
*/