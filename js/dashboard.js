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

// EDIT CONTACT (open modal and populate fields)
function editContact(contactId) {
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close-button");

    // Find contact data from the table row
    const row = [...document.querySelectorAll("#contactTable tr")]
        .find(r => r.querySelector("button")?.onclick.toString().includes(`editContact(${contactId})`));

    if (!row) return;

    const cells = row.getElementsByTagName("td");
    const first = cells[0].innerText;
    const last = cells[1].innerText;
    const phone = cells[2].innerText;
    const email = cells[3].innerText;

    // Pre-fill modal inputs
    document.getElementById("editFirstName").value = first;
    document.getElementById("editLastName").value = last;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editEmail").value = email;
    document.getElementById("editContactId").value = contactId;

    // Open modal
    modal.showModal();

    // Close handler
    closeModal.onclick = () => modal.close();
}

// SUBMIT EDIT MODAL (save changes)
function submitEditModal() {
    const modal = document.getElementById("modal");

    let contactId = document.getElementById("editContactId").value;
    let first = document.getElementById("editFirstName").value;
    let last = document.getElementById("editLastName").value;
    let phone = document.getElementById("editPhone").value;
    let email = document.getElementById("editEmail").value;

    let tmp = { id: contactId, firstName: first, lastName: last, phone: phone, email: email };
    let jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/EditContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            loadContacts();
            modal.close();
        }
    };
    xhr.send(jsonPayload);
}

// DELETE CONTACT FUNCTION //
function deleteContact(contactId) {
  contactToDelete = contactId; // store ID
  const deleteModal = document.getElementById("deleteModal");
  deleteModal.showModal();
}

// attach modal event listeners once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const deleteModal = document.getElementById("deleteModal");
  const cancelBtn = deleteModal.querySelector(".close-button");
  const confirmBtn = document.getElementById("confirmDelete");

  cancelBtn.addEventListener("click", () => {
    deleteModal.close();
    contactToDelete = null;
  });
  
  confirmBtn.addEventListener("click", () => {
    if (!contactToDelete) return;

    let tmp = { ID: contactToDelete };
    let jsonPayload = JSON.stringify(tmp);
    const url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        loadContacts();
        deleteModal.close();
        contactToDelete = null;
      }
    };
    xhr.send(jsonPayload);
  });
});


// SEARCH CONTACT FUNCTION //

function searchContact() {
    let term = document.getElementById("searchInput").value;
    loadContacts(term);
}
