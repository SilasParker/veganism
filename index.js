
function initMap() {
    console.log("yo");
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

function allClosestRestaurants() {
    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=50.83516,-0.13711&radius=1500&type=restaurant&rankby=distance&key=AIzaSyCj3FWGTybAg-EjXysQgCkWOxii8_ERxBA"
}

/*
defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCj3FWGTybAg-EjXysQgCkWOxii8_ERxBA&callback=myMap"
*/