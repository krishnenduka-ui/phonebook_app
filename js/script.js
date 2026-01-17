const API_URL = 'https://696b60ea624d7ddccaa100ba.mockapi.io/phonebook';

let editId = "";

let contactList = document.getElementById("contactList");

let search = document.getElementById('search');
let form = document.getElementById('phonebookform');
let nameinput = document.getElementById('name');
let phoneinput = document.getElementById('phone');



// Fetch all contacts
async function getContacts() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    alert("Failed to fetch contacts");
    return;
  }

  const phonebook = await res.json();
  displaycontacts(phonebook);
}





// Display contacts
function displaycontacts(list) {
  contactList.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    const contact = list[i];
    contactList.innerHTML += `
        <div class="contact">
            <p>${contact.name}</p>
            <p>${contact.number}</p>
            <button onclick ="editContact(${contact.id})">Edit</button>
            <button onclick = "deleteContact(${contact.id})">Delete</button>
        </div>`;
  }
}





// Add or update contact
form.addEventListener('submit', async (e) => {
  e.preventDefault();


  if (nameinput.value.trim() === "" || phoneinput.value.trim() === "") {
    alert("Please enter both name and phone number");
    return;
  }

  const contactdata = {
    name: nameinput.value,
    number: phoneinput.value
  };

  if (editId !== "") {
    // Update contact
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactdata)
    });
    editId = "";
    form.querySelector('button').innerText = 'Add Contact';
  } else {
    // Add new contact
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactdata)
    });
  }

  form.reset();
  getContacts();
});




// Edit a contact
async function editContact(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const contact = await response.json();

  nameinput.value = contact.name;
  phoneinput.value = contact.number;

  editId = id;
  form.querySelector('button').innerText = 'Update Contact';
}



// Delete a contact
async function deleteContact(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  getContacts();
}





// Search contacts by name or number
search.addEventListener('input', async function () {
  const res = await fetch(API_URL);
  const contacts = await res.json();

  let result = [];

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (
      contact.name.toLowerCase().includes(search.value.toLowerCase()) ||
      contact.number.includes(search.value)
    ) {
      result.push(contact);
    }
  }

  displaycontacts(result);
});


getContacts();
