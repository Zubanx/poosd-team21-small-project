<?php

    $inData = getRequestInfo();
    $firstName = "";
    $lastName = "";
    $searchCount = 0;
    $searchResults ="";

    $conn = new mysqli("localhost", "javier", "iHde7TXpmD", "Small_Project");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE userID = ? ");
        $stmt->bind_param("i", $inData["userID"]);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0 ){
            while($row = $result->fetch_assoc()){
				if( $searchCount > 0 ){
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '{"ID":"' . $row["ID"] . '",' .  '"First Name":"' . $row["firstName"] . '",' .  '"Last Name":"' . $row["lastName"] . '",' .  '"Number":"' . $row["phoneNumber"] . '",' .  '"Email":"' . $row["email"] . '",' .  '"Address":"' . $row["address"] . '",' .  '"Date":"' . $row["dateCreated"] . '"}';
			}
		}else{
            returnWithError("No Records Found");
        }
        $conn->close();
    }
    returnWithInfo($searchResults);
    
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
    function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
