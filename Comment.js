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

    test() {
        console.log("JEFF");
    }

    setHTML() {
        document.getElementById("scroller-restaurant-name").innerHTML = this.restaurantName;
        document.getElementById("scroller-rating-user").innerHTML = this.rating;
        document.getElementById("scroller-rating-veganism").innerHTML = this.veganism;
        document.getElementById("scroller-comment-text").innerHTML = this.comment;
        document.getElementById("scroller-author-text").innerHTML = this.name;
        document.getElementById("scroller-report-btn").onclick = this.reportComment();
        if (this.photo) {
            document.getElementById("scroller-photo-img").src = this.photo[0].getUrl();
        }

    }

    
}

//How it works: index calls a function of result that generates a bunch of comments per result and adds them to a global array in index that then scrolls through them every so often