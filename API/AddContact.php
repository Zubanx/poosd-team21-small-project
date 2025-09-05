<?php
    $inData = getRequestInfo();
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "javier", "iHde7TXpmD", "Small_Project");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else{
        $stmt = $conn->prepare("INSERT INTO Contacts (firstName, lastName, phoneNumber, email, address, dateCreated, userID) VALUES (? ,? ,? ,? ,?,CURRENT_DATE(), ?)");
        $stmt->bind_param("ssissi", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["email"], $inData["address"], $inData["userID"]);
        if($stmt->execute()){
            $last_id =$conn->insert_id;
            returnWithInfo($inData["firstName"], ["lastName"], $last_id);
        }else{
            returnWithError($stmt->error);
        }
    }
    $stmt->close();
    $conn->close();


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
