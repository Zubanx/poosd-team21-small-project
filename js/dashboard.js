document.addEventListener('DOMContentLoaded', function() {
    readSession(); //check login
    loadContacts(); //load all contacts for user
});

// LOAD CONTACT FUNCTION //

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
                    row.insertCell(2).innerText = contact["Phone"] ||contact["Number"] || contact["phone"];
                    row.insertCell(3).innerText = contact["Email"];
                    row.insertCell(4).innerHTML = `
                        <button class = "editButton" onclick="editContact(${contact.ID})">Edit</button>
                        <button class = "deleteButton" onclick="deleteContact(${contact.ID})">Delete</button>
                    `;
                });
            }
        }
    };
    xhr.send(jsonPayload);
}

// ADD CONTACT FUNCTION //

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

// EDIT CONTACT FUNCTION //

    function editContact(contactId) {
        
        const modal =  document.querySelector('#modal');
        const openModal = document.querySelector('.open-button');
        const closeModal = document.querySelector('.close-button');
            
        openModal.addEventListener('click', () => {
            modal.showModal();
        });

        closeModal.addEventListener('click', () =>{
            modal.close();

        });

        
        let first = prompt("Enter new first name:");
        let last = prompt("Enter new last name:");
        let phone = prompt("Enter new phone:");
        let email = prompt("Enter new email:");

        let tmp = { id: contactId, firstName: first, lastName: last, phone: phone, email: email };
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

// DELETE CONTACT FUNCTION //

function deleteContact(contactId) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    let tmp = { ID: contactId };
    let jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/DeleteContact.' + extension;

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


// SEARCH CONTACT FUNCTION //

function searchContact() {
    let term = document.getElementById("searchInput").value;
    loadContacts(term);
}
