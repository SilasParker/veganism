class Result {


    constructor(place) {
        this.name = place.name;
        this.photo = place.photos[0];
        this.placeID = place.place_id;
        this.mapsRating = place.rating;
        this.address = place.vicinity;
    }

    getName() {
        return this.name;
    }

    getPhoto() {
        return this.photo;
    }

    getPlaceID() {
        return this.placeID;
    }

    getMapsRating() {
        return this.mapsRating;
    }

    getAddress() {
        return this.address;
    }

    async getVeganismRating() {
        let response = await fetch("/api.php?restaurantID=test"); //CHANGE
        if(response.ok) {
            let responseJSON = await response.json();
        }
    }

    toHTML() {
        let divWrapper = document.createElement("div");
        divWrapper.className = "result";
        let restaurantName = document.createElement("h3");
        restaurantName.value = this.name;
        let ratingsDiv = document.createElement("div");
        let veganismRating = document.createElement("p");
        veganismRating.value = 
    }

}

<div class="result">
    <h3>Jenny's</h3>
    <p>Restaurant Rating: 4*</p>
    <p>Veganism: 2*</p>
    <p>Address: Muzzy</p>
</div>