const urlBase = 'http://159.65.246.16/API';
const extension = 'php';

function doRegister() {

    let firstName = document.getElementById("regFirstName").value.trim();
    let lastName = document.getElementById("regLastName").value.trim();
    let login = document.getElementById("regLogin").value.trim();
    let password = document.getElementById("regPassword").value.trim();

    const resultDiv = document.getElementById("registerResult");
    resultDiv.innerText = "";
    
        // Input validation
    if (!firstName || !lastName || !login || !password) {
        resultDiv.innerText = "All fields are required!";
        return;
    }

    // let hash = md5(password);

    let tmp = {
        firstName: document.getElementById("registerFirstName").value.trim(),
        lastName: document.getElementById("registerLastName").value.trim(),
        login: document.getElementById("registerLogin").value.trim(),
        password: document.getElementById("registerPassword").value.trim()
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = 'Register.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);

            if (jsonObject.error !== "") {
                document.getElementById("registerResult").innerText = jsonObject.error;
                return;
            }

            // store session info
            localStorage.setItem("userId", jsonObject.id);
            localStorage.setItem("firstName", jsonObject.firstName);
            localStorage.setItem("lastName", jsonObject.lastName);

            // redirect to dashboard
            window.location.href = "dashboard.html";
        } else{
            document.getElementById("registerResult").innerText = "Registration request failed (status " + this.status + ")";
            console.error(xhr.responseText);
        }
    };

    xhr.onerror = function() {
    document.getElementById("registerResult").innerText = "Network error. Check API URL or CORS.";
    console.error("Network error");
};

    xhr.send(jsonPayload);
}
