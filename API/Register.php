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
        $stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login=? ");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0)
        {
            returnWithError("Username already exists");
        }
        else if(!$result)
        {
            returnWithError($stmt->error);
        }else
        {
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["login"], $inData["password"], $inData["firstName"], $inData["lastName"]);
            $stmt->execute();
            $result = $stmt->get_result();
            if($row = $result->fetch_assoc()){
                $last_id = $conn->insert_id;
                returnWithInfo($row['firstName'], $row['lastName'], $last_id);
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
