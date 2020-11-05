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
        } else {
            http_response_code(400);
        }
    }

    private function handlePOST($author_name,$restaurant_id,$comment,$stars,$veganism) {
        $rid_valid = $this->checkRID($restaurant_id);
        $stars_valid = checkRating($stars,5);
        $veganism_valid = checkRating($veganism,4);
        $comment_valid = false;
        if(strlen($comment) <= 100) {
            $comment_valid = true;
        } 
        //WAS HERE!!! 
    }



    private function handleGET($restaurant_id) {
        $rid_valid = $this->checkRID($restaurant_id);
        if($rid_valid) {
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

?>