const urlBase = 'http://159.65.246.16/API';
const extension = 'php';
    
let userId = 0;
let firstName = "";
let lastName = "";

// -------------------- LOGIN / REGISTER -------------------- //

function doLogin() {

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    document.getElementById("loginResult").innerHTML = "";

	if (!login || !password) {
    	document.getElementById("loginResult").innerText = "Please enter username and password";
 		return;
	}
    
    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            if (jsonObject.error !== "") {
                document.getElementById("loginResult").innerHTML = jsonObject.error;
                return;
            }

            userId = jsonObject.id;
            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;

            localStorage.setItem("userId", userId);
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);

            window.location.href = "dashboard.html";
        } 
        else{
			document.getElementById("loginResult").innerText = "Login request failed (status " + this.status + ")";
            console.error(xhr.responseText);
		}
    };
	
	xhr.onerror = function() {
		document.getElementById("loginResult").innerText = "Network error. Check API URL or CORS.";
		console.error("Network error");
	};

    xhr.send(jsonPayload);
}

function doRegister() {
    let regFirstName = document.getElementById("registerFirstName").value;
    let regLastName = document.getElementById("registerLastName").value;
    let regLogin = document.getElementById("registerLogin").value;
    let regPassword = document.getElementById("registerPassword").value;

    let tmp = { firstName: regFirstName, lastName: regLastName, login: regLogin, password: regPassword };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            if (jsonObject.error !== "") {
                document.getElementById("registerResult").innerHTML = jsonObject.error;
                return;
            }

            userId = jsonObject.id;
            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;

            localStorage.setItem("userId", userId);
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);

            window.location.href = "dashboard.html";
        }
    xhr.send(jsonPayload);
}

// -------------------- SESSION MANAGEMENT -------------------- //

function readSession() {
    userId = parseInt(localStorage.getItem("userId")) || 0;
    firstName = localStorage.getItem("firstName") || "";
    lastName = localStorage.getItem("lastName") || "";

    if (userId < 1) {
        window.location.href = "index.html"; // not logged in
    } else {
        document.getElementById("userName").innerText = "Logged in as: " + firstName + " " + lastName;
    }
}

function doLogout() {
    localStorage.clear();
    window.location.href = "index.html";
}
