/*DeleteContact.php */

<?php

    $inData = getRequestInfo();
    $firstName = "";
    $lastName = "";
    $conn = new mysqli("localhost", "admin", "smallProjectUser", "Small_Project");

    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        $stmt->bind_param("i", $inData["ID"]);
        if($stmt->execute()){
            returnWithInfo($firstName, $lastName, $inData["ID"]);
        }else{
            returnWithError($stmt->error);
        }
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
