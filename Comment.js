class Comment {
    constructor(restaurantName, rating, veganism, comment, name, commentID, photo) {
        this.restaurantName = restaurantName;
        this.rating = rating;
        this.veganism = veganism;
        this.comment = comment;
        this.name = name;
        this.commentID = commentID;
        this.photo = photo
    }


    setHTML() {
        document.getElementById("scroller-restaurant-name").innerHTML = this.restaurantName;
        document.getElementById("scroller-rating-user").innerHTML = this.rating;
        document.getElementById("scroller-rating-veganism").innerHTML = this.veganism;
        document.getElementById("scroller-comment-text").innerHTML = this.comment;
        document.getElementById("scroller-author-text").innerHTML = this.name;
        let comment = this;
        document.getElementById("scroller-report-btn").onclick = async function() {await comment.reportComment();};
        if (this.photo) {
            document.getElementById("scroller-photo-img").src = this.photo[0].getUrl();
        }

    }

    async reportComment() {
        //DO PUT NOT POST

        let bodyData = "commentID=" + this.commentID + "&reported=1";
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

//How it works: index calls a function of result that generates a bunch of comments per result and adds them to a global array in index that then scrolls through them every so often