<?php

    $inData = getRequestInfo();
    $firstName = "";
    $lastName = "";


    $conn = new mysqli("localhost", "javier", "iHde7TXpmD", "Small_Project");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        //Test if user exist
        $stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE login=? ");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0)
        {
            returnWithError("Username already exists");
        }
        else if($result === false)
        {
            returnWithError($stmt->error);
        }else
        {
            $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, login, password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
	    if($stmt->execute()){
                $last_id = $conn->insert_id;
                returnWithInfo($inData['firstName'], $inData['lastName'], $last_id);
            }else
            {
                returnWithError($conn->error);
            }
        }
        $stmt->close();
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
