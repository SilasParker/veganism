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
        userRatingElement.parentNode.replaceChild(this.generateStars(userRatingElement, this.rating, "User Rating", "images/stars/star"), userRatingElement);
        let veganismElement = document.getElementById("scroller-rating-veganism");
        veganismElement.parentNode.replaceChild(this.generateStars(veganismElement, this.veganism, "Veganism", "images/stars/star"), veganismElement);
        if (this.comment != "") {
            document.getElementById("scroller-comment-text").innerHTML = "\"" + this.comment + "\"";
        } else {
            document.getElementById("scroller-comment-text").innerHTML = "<i>no comment</i>";
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
            starImg.src = path + ".svg";
            span.appendChild(starImg);
        }
        element.innerHTML = system + ": ";
        element.appendChild(document.createElement("br"));
        element.appendChild(span);
        
        return element;
    }

    async reportComment() {
        let bodyData = "commentID=" + this.commentID;
        await fetch("api/api.php", {
            method: 'PUT',
            body: bodyData,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then(function (data) {
                console.log("Request succeeded with response", data);
                document.getElementById("report-message").innerHTML = "Thanks for the report! Someone will look into this review ASAP";
                document.getElementsByClassName("cell-8")[0].style.display = "block";
                document.getElementById("report-message").scrollIntoView();
                
            })
            .catch(function (error) {
                document.getElementById("report-message").innerHTML = "Your request failed"+error;
                document.getElementsByClassName("cell-8")[0].style.display = "block";
            });
    }





}