const urlBase = 'https://cop-433121.com/API';
const extension = 'php';

function doRegister() {
    const firstName = document.getElementById("registerFirstName").value.trim();
    const lastName = document.getElementById("registerLastName").value.trim();
    const login = document.getElementById("registerLogin").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const resultDiv = document.getElementById("registerResult");

    resultDiv.innerText = "";
    
    // Input validation
    if (!firstName || !lastName || !login || !password) {
        resultDiv.innerText = "All fields are required!";
        return;
    }

    const payload = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    };

    const jsonPayload = JSON.stringify(payload);
    const url = `${urlBase}/Register.${extension}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true); // async
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error !== "") {
                    resultDiv.innerText = jsonObject.error;
                    return;
                }

                // store session info
                localStorage.setItem("userId", jsonObject.id);
                localStorage.setItem("firstName", jsonObject.firstName);
                localStorage.setItem("lastName", jsonObject.lastName);
                
                // redirect to dashboard
                window.location.href = "dashboard.html";
            } catch (e) {
                resultDiv.innerText = "Invalid response from server.";
                console.error(e, xhr.responseText);
            }
        } else {
            resultDiv.innerText = `Registration request failed (status ${xhr.status})`;
            console.error(xhr.responseText);
        }
    };

    xhr.onerror = function() {
        resultDiv.innerText = "Network error. Check API URL or CORS.";
        console.error("Network error");
    };

    xhr.send(jsonPayload);
}
