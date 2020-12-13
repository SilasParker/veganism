class Comment {
    constructor(restaurantName, rating, veganism, comment, name, commentID, label) {
        this.restaurantName = restaurantName;
        this.rating = rating;
        this.veganism = veganism;
        this.comment = comment;
        this.name = name;
        this.commentID = commentID;
        this.label = label;
    }


    setHTML() {
        document.getElementById("scroller-review").style.visibility = "visible";
        document.getElementById("scroller-restaurant-label").innerHTML = this.label + ".";
        document.getElementById("scroller-restaurant-name").innerHTML = this.restaurantName;
        let userRatingElement = document.getElementById("scroller-rating-user");
        userRatingElement.parentNode.replaceChild(this.generateStars(userRatingElement, this.rating, "User Rating", "Stars/star"), userRatingElement);
        let veganismElement = document.getElementById("scroller-rating-veganism");
        veganismElement.parentNode.replaceChild(this.generateStars(veganismElement, this.veganism, "Veganism", "Stars/star"), veganismElement);
        if (this.comment != "") {
            document.getElementById("scroller-comment-text").innerHTML = "\"" + this.comment + "\"";
        } else {
            document.getElementById("scroller-comment-text").innerHTML = "";
        }
        document.getElementById("scroller-author-text").innerHTML = "--" + this.name;
        let comment = this;
        document.getElementById("scroller-report-btn").style.visibility = "visible";
        document.getElementById("scroller-report-btn").onclick = async function () { await comment.reportComment(); };

    }

    generateStars(element, rating, system, path) {
        let span = document.createElement("span");
        span.className = "result-star-span";
        for (let i = 0; i < rating; i++) {
            let starImg = document.createElement("img");
            starImg.src = path + ".png";
            span.appendChild(starImg);
        }
        element.innerHTML = system + ": ";
        element.appendChild(span);
        return element;
    }

    async reportComment() {
        let bodyData = "commentID=" + this.commentID;
        await fetch("https://sp1178.brighton.domains/AdvWebApp/Veganism191120/api.php", {
            method: 'PUT',
            body: bodyData,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then(function (data) {
                console.log("Request succeeded with response", data);
                alert("Thanks for the report! Someone will look into this review ASAP");
            })
            .catch(function (error) {
                alert("Your request failed: " + error);
            });
    }





}