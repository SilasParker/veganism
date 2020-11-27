class Result {


    constructor(place) {
        this.name = place.name;
        this.photo = place.photos;
        this.placeID = place.place_id;
        if (place.rating !== undefined) {
            this.mapsRating = place.rating;
        } else {
            this.mapsRating = "No Reviews (yet)";
        }

        this.address = place.vicinity;
        this.results;

    }

    async setResults() {
        let something = await this.getResultRatings();
        if (something) {
            this.results = something;
            return this.toHTML();
        }
    }

    generateComments() {
        let allComments = [];
        let reviews = this.results.ratings;
        console.log(reviews);
        if (reviews) {
            if (reviews.length > 10) {
                console.log("more than 10 apparently");
                let randomIndexes = [];
                while (randomIndexes.length < 10) {
                    let random = Match.floor(Math.random() * reviews.length);
                    if (arr.indexOf(random) === -1) {
                        randomIndexes.push(random);
                        if (reviews[random]["reported"] === 0) {
                            allComments.push(new Comment(this.name, reviews[random]["star-rating"], reviews[random]["veganism-rating"], reviews[random]["comment"], reviews[random]["author"], reviews[random]["comment-id"], this.photo));
                        }
                    }
                }
            } else {
                console.log("uh");
                for (let i = 0; i < reviews.length; i++) {
                    console.log("reported?");
                    console.log(reviews[i]["reported"]);
                    console.log("Pushed");
                    allComments.push(new Comment(this.name, reviews[i]["star-rating"], reviews[i]["veganism-rating"], reviews[i]["comment"], reviews[i]["author"], reviews[i]["comment-id"], this.photo));
                }
            }
            console.log("all comments");
            console.log(allComments);
            return allComments;
        }
        return null;
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
        const response = await fetch("https://sp1178.brighton.domains/AdvWebApp/Veganism191120/api.php?restaurantID=" + this.placeID);

        const json = await response.json();

        return json;
    }

    calculateRating(ratingType) {
        if (this.results.ratings) {
            let total = 0;
            for (let i = 0; i < this.results.ratings.length; i++) {
                total += parseInt(this.results.ratings[i][ratingType]);
            }
            return total / this.results.ratings.length;
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
        veganismRating.innerHTML = "Veganism: " + this.calculateRating("veganism-rating") + "*";
        let userRating = document.createElement("p");
        userRating.innerHTML = "User Rating: " + this.calculateRating("star-rating") + "*";
        let mapRating = document.createElement("p");
        mapRating.innerHTML = "GMaps Rating: " + this.mapsRating + "*";
        let restaurantAddress = document.createElement("p");
        restaurantAddress.innerHTML = this.address;
        let restaurantPhoto = document.createElement("img");
        if (this.photo) {
            restaurantPhoto.src = this.photo[0].getUrl();
            restaurantPhoto.width = "200";
            restaurantPhoto.height = "150";
        } else {
        }
        let reviewButton = document.createElement("button");
        reviewButton.type = "button";
        reviewButton.innerHTML = "Review";
        let self = this;
        reviewButton.onclick = function () { self.updateForm(); }
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
        document.getElementsByClassName("column-right")[0].style.visibility = 'visible'
        let formDiv = document.getElementById("write-review");
        formDiv.getElementsByTagName("h2")[0].innerHTML = "Write Review for " + this.name;
        formDiv.getElementsByTagName("h2")[0].id = this.placeID;
        document.getElementById("author-input").value = "";
        document.getElementById("comment-input").value = "";
        let radioStar = document.getElementsByName("radStar");
        let radioVeganism = document.getElementsByName("radVeganism");
        for (var i = 0; i < 5; i++) {
            radioStar[i].checked = false;
            radioVeganism[i].checked = false;
        }
    }


}