<?php

class VeganismAPI {
    private $conn;

    public function __construct() {
        
        $this->conn = new mysqli("localhost","sp1178_silas","Silas170199","sp1178_veganism");
        if($this->conn->connect_error) {
            http_response_code(500);
            die("Connect Error".$this->conn->connect_error."<br>");
        } else {
            $this->checkRequest();                                      
        }
    }

    public function __destruct() {
        $this->conn->close();
    }

    private function checkRequest() {
        if($_SERVER['REQUEST_METHOD'] === "POST") {
            if(isset($_POST['restaurantID']) && isset($_POST['stars']) && isset($_POST['veganism']) && isset($_POST['name'])) {
                $this->handlePOST($_POST['name'],$_POST['restaurantID'],$_POST['comment'],$_POST['stars'],$_POST['veganism']);
            } else {
                http_response_code(400);
            }
        } else if($_SERVER['REQUEST_METHOD'] === "GET") {
            if(isset($_GET['restaurantID'])) {
                $this->handleGET($_GET['restaurantID']);
            } else {
                http_response_code(400);
            }
        } else if($_SERVER['REQUEST_METHOD'] === "PUT") {
            $body = file_get_contents('php://input');
            if($body) {
                $this->handlePUT(substr($body,10));
            }
        } else {
            http_response_code(400);
        }
    }



    private function handlePUT($comment_id) {
        if(ctype_digit($comment_id)) {
            $comment_id = (int) $comment_id;
            $one = 1;
            $prep = $this->conn->prepare("UPDATE `reviews` SET `reported`=? WHERE `comment-id`=?");
            $prep->bind_param("ii",$one,$comment_id);
            $prep->execute();
            if($prep->error) {
                http_response_code(400);
                echo $prep->error;
            } else {
                http_response_code(200);
            }
            $prep->close();
            $_POST = array();
        } else {
            http_response_code(400);
        }
    }

    private function handlePOST($author_name,$restaurant_id,$comment,$stars,$veganism) {
        $rid_valid = $this->checkRID($restaurant_id);
        $stars_valid = $this->checkRating($stars,5);
        $veganism_valid = $this->checkRating($veganism,5);
        $author_name = urldecode($author_name);
        $comment = urldecode($comment);
        $comment_valid = false;
        $author_name_valid = false;
        if(strlen($comment) <= 100) {
            $comment_valid = true;
        } 
        if(strlen($author_name) > 0 && strlen($author_name) <= 38) {
            $author_name_valid = true;
        }
        $prep = $this->conn->prepare("INSERT INTO `reviews` (`author`,`restaurant-id`,`comment`,`star-rating`,`veganism-rating`) VALUES (?,?,?,?,?)");
        echo $prep->error;
        $prep->bind_param("sssii",$author,$rid,$new_comment,$star_rating,$veganism_rating);
        if($author_name_valid && $comment_valid && $rid_valid && $stars_valid && $veganism_valid) {
            $author = $author_name;
            $rid = $restaurant_id;
            $new_comment = $comment;
            $star_rating = $stars;
            $veganism_rating = $veganism;
            $reported = false;
            $prep->execute();
            $prep->close();
            http_response_code(201);
            $_POST = array();
            $id = $this->conn->insert_id;
            echo json_encode(array("id"=>$id),JSON_PRETTY_PRINT);
        } else {
            http_response_code(400);
        }
        
    }



    private function handleGET($restaurant_id) {
        $rid_valid = $this->checkRID($restaurant_id);
        if($rid_valid) {
            $sql = "SELECT `author`,`comment`,`star-rating`,`veganism-rating`,`comment-id` FROM reviews WHERE `restaurant-id`='".$restaurant_id."' AND reported=0";
            $result = $this->conn->query($sql);
            if(mysqli_num_rows($result) == 0) {
                http_response_code(204);
            } else {
                $comments = array();
                while($row = mysqli_fetch_assoc($result)) {
                    $comments[] = $row;
                }
            }
            http_response_code(200);
            echo json_encode(array("restaurant-id"=>$restaurant_id,"ratings"=>$comments),JSON_PRETTY_PRINT);
        } else {
            http_response_code(400);
        }
    }

    private function checkRID($rid) {
        $rid_array = str_split($rid);
        foreach($rid_array as $char) {
            if(!ctype_alnum($char)) {
                if(($char !== '-') && ($char !== '_')) {
                    return false;
                }
            }
        }
        return true;
    }

    private function checkRating($rating,$max) {
        if(0 < $rating && $rating <= $max) {
            return true;
        } else {
            return false;
        }
    }


}

$test = new VeganismAPI();
?>