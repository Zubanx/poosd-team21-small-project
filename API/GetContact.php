<?php

$inData = getRequestInfo();
$firstName = "";
$lastName = "";
$searchResults = "";

$conn = new mysqli("localhost", "admin", "smallProjectUser", "Small_Project");
if($conn->connect_error){
    returnWithError($conn->connect_error);
}else
{
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
    $stmt->bind_param("i", $inData["id"]);
    $stmt->execute();
    $result = $stmt->get_result();
    if($row = $result->fetch_assoc())
    {
        $searchResults = '{"id":' . $row["id"] . ',"firstName":"' . $row["firstName"] . '","lastName":"' . $row["lastName"] . ',"phone":"' . $row["phone"] . ',"email":"' . $row["email"] . ',"timestamp":"' . $row["timestamp"] . ',"userID":"' . $row["userID"] . '","error":""}'
        returnWithInfo($searchResults);
    } else {
        returnWithError("No Records Found");
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
function returnWithInfo( $searchResults )
{
    $retValue = $searchResults;
    sendResultInfoAsJson($retValue);
}
?>
