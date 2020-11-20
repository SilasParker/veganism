class Result {


    constructor(place) {
        this.name = place.name;
        this.photo = place.photos;
        this.placeID = place.place_id;
        this.mapsRating = place.rating;
        this.address = place.vicinity;
        this.results;
    }

    async setResults() {
        let something = await this.getResultRatings();
        if(something) {
            this.results = something;
            return this.toHTML();
        }
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

    async getResultRatings() {
        const response = await fetch("https://sp1178.brighton.domains/AdvWebApp/Veganism191120/api.php?restaurantID="+this.placeID);
        
        const json = await response.json();
        
        return json;
    }

    calculateRating(ratingType) {
        if(this.results.ratings) {
            let total = 0;
            for(let i = 0;i < this.results.ratings.length;i++) {
                total += parseInt(this.results.ratings[i][ratingType]);
            }
            return total/this.results.ratings.length;
        } else {
            return "No Reviews (yet)";
        }
    }

    toHTML() {
        let divWrapper = document.createElement("div");
        divWrapper.className = "result";
        let restaurantName = document.createElement("h3");
        restaurantName.innerHTML = this.name;
        let ratingsDiv = document.createElement("div");
        let veganismRating = document.createElement("p");
        veganismRating.innerHTML = "Veganism: "+this.calculateRating("veganism-rating")+"*";
        let userRating = document.createElement("p");
        userRating.innerHTML = "User Rating: "+this.calculateRating("star-rating")+"*";
        let mapRating = document.createElement("p");
        mapRating.innerHTML = "GMaps Rating: "+this.mapsRating+"*";
        let restaurantAddress = document.createElement("p");
        restaurantAddress.innerHTML = this.address;
        let restaurantPhoto = document.createElement("img");
        if(this.photo) {
            restaurantPhoto.src = this.photo[0].getUrl();
            restaurantPhoto.width = "200";
            restaurantPhoto.height = "150";
        } else {
        }
        let reviewButton = document.createElement("button");
        reviewButton.type = "button";
        reviewButton.innerHTML = "Review";
        let self = this;
        reviewButton.onclick = function() {self.updateForm();}
        divWrapper.appendChild(restaurantName);
        divWrapper.appendChild(restaurantPhoto);
        ratingsDiv.appendChild(veganismRating);
        ratingsDiv.appendChild(userRating);
        ratingsDiv.appendChild(mapRating);
        divWrapper.appendChild(ratingsDiv);
        divWrapper.appendChild(restaurantAddress);
        divWrapper.appendChild(reviewButton);
        return divWrapper;
    }

    updateForm() {
        let formDiv = document.getElementById("write-review");
        formDiv.getElementsByTagName("h2")[0].innerHTML = "Write Review for "+this.name;
        formDiv.getElementsByTagName("h2")[0].id = this.placeID;
    }
}
/*
Next TODO: Make the Review buttons functional so that it brings it up on the right and then so that the review sends a review to the correct restaurant
*/