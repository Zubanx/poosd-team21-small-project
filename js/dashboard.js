document.addEventListener('DOMContentLoaded', function() {
    readSession(); // check login
    loadContacts(); // load all contacts for user
});

// -------------------- LOAD CONTACTS -------------------- //

function loadContacts(searchTerm = "") {
    const url = urlBase + '/SearchContact.' + extension;
    let tmp = { userID: userId, search: searchTerm };
    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);

            let table = document.getElementById("contactTable");
            table.innerHTML = `
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            `;

            if (jsonObject.results) {
                jsonObject.results.forEach(contact => {
                    let row = table.insertRow();
                    row.insertCell(0).innerText = contact["First Name"];
                    row.insertCell(1).innerText = contact["Last Name"];
                    row.insertCell(2).innerText = contact["Number"];
                    row.insertCell(3).innerText = contact["Email"];
                    row.insertCell(4).innerHTML = `
                        <button onclick="EditContact(${contact.ID})">Edit</button>
                        <button onclick="DeleteContact(${contact.ID})">Delete</button>
                    `;
                });
            }
        }
    };
    xhr.send(jsonPayload);
}

// -------------------- ADD CONTACT -------------------- //

function addContact() {
    let first = document.getElementById("contactFirstName").value;
    let last = document.getElementById("contactLastName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;

    let tmp = { firstName: first, lastName: last, phone: phone, email: email, userID: userId };
    let jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            loadContacts();
            document.getElementById("contactForm").reset();
        }
    };
    xhr.send(jsonPayload);
}

// -------------------- EDIT CONTACT -------------------- //

function editContact(contactId) { // Allows user to save or cancel edits
    let row = document.getElementById(`contact-${contactId}`);
    let first = row.cells[0].innerText;
    let last = row.cells[1].innerText;
    let phone = row.cells[2].innerText;
    let email = row.cells[3].innerText;

    row.cells[0].innerHTML = `<input type="text" id="editFirst-${contactId}" value="${first}">`;
    row.cells[1].innerHTML = `<input type="text" id="editLast-${contactId}" value="${last}">`;
    row.cells[2].innerHTML = `<input type="text" id="editPhone-${contactId}" value="${phone}">`;
    row.cells[3].innerHTML = `<input type="text" id="editEmail-${contactId}" value="${email}">`;

    row.cells[4].innerHTML = `
        <button id="saveBtn-${contactId}" onclick="saveEdit(${contactId})" disabled>Save</button>
        <button onclick="cancelEdit(${contactId})">Cancel</button>
    `;

    const inputs = row.querySelectorAll("input");
    const saveBtn = document.getElementById(`saveBtn-${contactId}`);
    
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (
                document.getElementById(`editFirst-${contactId}`).value !== first ||
                document.getElementById(`editLast-${contactId}`).value !== last ||
                document.getElementById(`editPhone-${contactId}`).value !== phone ||
                document.getElementById(`editEmail-${contactId}`).value !== email
            ) {
                saveBtn.disabled = false;
            } else {
                saveBtn.disabled = true;
            }
        });
    });
}


function saveEdit(contactId) {
    let first = document.getElementById(`editFirst-${contactId}`).value.trim();
    let last = document.getElementById(`editLast-${contactId}`).value.trim();
    let phone = document.getElementById(`editPhone-${contactId}`).value.trim();
    let email = document.getElementById(`editEmail-${contactId}`).value.trim();

    let tmp = { id: contactId, firstName: first, lastName: last, phone: phone, email: email, userID: userId };
    let jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            loadContacts();
        }
    };
    xhr.send(jsonPayload);
}

function cancelEdit(contactId) {
    loadContacts();
}



// -------------------- DELETE CONTACT -------------------- //

function deleteContact(contactId) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    let tmp = { ID: contactId, userID: userId };
    let jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            loadContacts();
        }
    };
    xhr.send(jsonPayload);
}


// -------------------- SEARCH CONTACT -------------------- //

function searchContact() {
    let term = document.getElementById("searchInput").value;
    loadContacts(term);
}
