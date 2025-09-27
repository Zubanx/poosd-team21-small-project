/*GetContact.php */


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
        $searchResults =
            '{"id":'        . (int)$row["ID"] .
            ',"firstName":' . json_encode($row["firstName"]) .
            ',"lastName":'  . json_encode($row["lastName"])  .
            ',"phone":'     . json_encode($row["phone"])     .
            ',"email":'     . json_encode($row["email"])     .
            ',"timestamp":' . json_encode($row["timestamp"]) .
            ',"userID":'    . (int)$row["userID"] .
            ',"error":""}';
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