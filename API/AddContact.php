




<?php
    $inData = getRequestInfo();
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "admin", "smallProjectUser", "Small_Project");

    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("INSERT INTO Contacts (firstName, lastName, phone, email, userID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"],  $inData["phone"], $inData["email"], $inData["userID"]);
        if($stmt->execute()){
            $last_id = $conn->insert_id;
            returnWithInfo($inData["firstName"], $inData["lastName"], $last_id);
        } else {
            returnWithError($stmt->error);
        }
        $conn->close();
    }
    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj)
    {
        header('Content-type:application/json');
        echo $obj;
    }
    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    function returnWithInfo( $firstName, $lastName, $id )
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>
