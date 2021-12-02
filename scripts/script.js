// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH_3VpNHYwzHEcnSvCRepZaG0zTpH1QHI",
  authDomain: "ticketmaster-ab086.firebaseapp.com",
  databaseURL: "https://ticketmaster-ab086-default-rtdb.firebaseio.com",
  projectId: "ticketmaster-ab086",
  storageBucket: "ticketmaster-ab086.appspot.com",
  messagingSenderId: "617810340463",
  appId: "1:617810340463:web:46b82e47df91c46796bb9a",
  measurementId: "G-D0WZYDWX5G"
};

// Initialize Firebase
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
 } else {
   firebase.app();
 }
firebase.analytics();
firebase.database();

const auth = firebase.auth();
const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshot: true });

/*--------------------  USER INFO  --------------------*/
// Array to hold user info
var currentUserData = [];

//Auth stuff to get Current User Data
auth.onAuthStateChanged((user) => {
  // clear currentUserData Array
  currentUserData = [];

  if(user){
    var uid = user.uid;
    console.log("User ID: " + uid);
    currentUserData.push(uid);
    var accountRef = db.collection("users").doc(user.uid);
    accountRef.get().then((doc) => {
      if(doc.exists){
        var userName = doc.data().fName + " " + doc.data().lName;
        console.log("userName: " + userName);
        currentUserData.push(userName);
        console.log(currentUserData);
      }
    });
  }
  else{
    console.log("No user signed in..");
  }
})

// Get Current User's Name
function GetUserInfo(currentUserData){
  return currentUserData[1];
}

/*--------------------  PROJECT TABLE  --------------------*/
// Fetch Project Titles and Input into Table
var projectref = firebase.database().ref('Projects');

function GetAllProjects(){
  ResetTable();
  projectref.once('value', function(AllRecords){
  AllRecords.forEach(
    function(CurrentRecord){
      var pid = CurrentRecord.val().ProjectID;
      var pname = CurrentRecord.val().ProjectTitle;
      var pstatus = CurrentRecord.val().ProjectStatus;
      var pcreator = CurrentRecord.val().ProjectCreator;
      AddProjectToTable(pid, pname, pstatus, pcreator);
    }
  );
  console.log(projList); // DEBUG
  console.log(GetUserInfo(currentUserData));
  });
}

// Save Project contents here for reference
var projList = [];
var pindex = 0;

function AddProjectToTable(pid, pname, pstatus, pcreator){
  var tbody = document.getElementById('tbody1');
  var trow = document.createElement('tr');
  var td0 = document.createElement('td');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  td0.setAttribute('class', 'projectID');
  td1.setAttribute('class', 'myproject');
  td2.setAttribute('class', 'mystatus');
  td3.setAttribute('class', 'projectCreator');
  pindex++;
  projList.push([pid, pname, pstatus, pcreator]);
  td0.innerHTML= pid;
  td1.innerHTML= pname;
  td2.innerHTML= pstatus;
  td3.innerHTML= pcreator;
  trow.appendChild(td0);
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);

  var ControlDiv = document.createElement("div");
  ControlDiv.innerHTML = '<button type="button" id="editprojectbtn" class="functionbtn">Edit</button>';
  ControlDiv.innerHTML += '<button type="button" id="selectprojectbtn" class="functionbtn" onclick="GetProjectTickets('+pindex+')">Select</button>';
  ControlDiv.innerHTML += '<button type="button" id="deleteprojectbtn" class="functionbtn" onclick="DeleteProject('+pindex+')">Delete</button>';

  trow.appendChild(ControlDiv);
  tbody.appendChild(trow);

}

function ResetTable(){
  projList = [];
  pindex = 0;
  var projTable = document.getElementById('tbody1');
  projTable.innerHTML = "";
}

// Add new project - Edited by MTo
function addProject(){
  var projid = "proj"+Date.now().toString();
  var projtitle = document.getElementById('ptitle').value;
  var projstatus = "Todo";
  var projcreator = GetUserInfo(currentUserData);

  // Temporary to set ProjTitle when creating tickets
  var ProjectPath = "Projects/" + projid + "/";
  var firebaseRef = firebase.database().ref(ProjectPath);

  // Adds to realtime database
  firebaseRef.set({ProjectID:projid, ProjectTitle:projtitle, ProjectStatus:projstatus, ProjectCreator:projcreator});
  GetAllProjects();
}

// Delete Project using My "Delete" button
function DeleteProject(index){
  if(index == null){
    pid = "";
  }
  else{
    index--;
    pid = projList[index][0];
  }
  console.log(pid); // Debug

  var ProjectPath = "Projects/"+ pid;
  var firebaseRef = firebase.database().ref(ProjectPath);

  console.log(firebaseRef.toString());
  firebaseRef.remove().then(
    function(){
      alert("Project was deleted"); // Debug
      GetAllProjects();
    }
  )
}

/*--------------------  PAUL'S OG PROJECT PAGE JS  --------------------*/
// let projects = [
//     {
//         name: "Test Project 1",
//         status: "Finished"
//     },
//     {
//         name: "Test Project 2000",
//         status: "todo"
//     },
//     {
//         name: "Test Project 3000",
//         status: "in-progress"
//     }
// ];
//
// displayTable();

// Try to implement this into EditProject Modal - MTo
// Update status of project
function updateStatus(index){
    let statuses = ["Todo", "In-Progress", "Finished"];
    let statusIndex = statuses.indexOf(projects[index].status);
    ++statusIndex;
    if(statusIndex > 2) statusIndex = 0;
    projects[index].status = statuses[statusIndex];
}
//
// // Delete Project
// function deleteProject(index){
//     projects.splice(index, 1);
//     displayTable();
// }
//
// //To render the project arrays
// function displayTable(){
//     let table = document.querySelector("table");
//
//     while(table.childNodes.length > 2){
//         table.removeChild(table.lastChild);
//     }
//
//     let index = 0;
//
//     projects.forEach(project => {
//         let tableRow = document.createElement("tr");
//         let name = document.createElement("td");
//         let status = document.createElement("td");
//         let deleteProject = document.createElement("td");
//
//         name.innerText = project.name;
//         status.innerText = project.status;
//         status.classList.add(project.status.toLowerCase());
//
//         deleteProject.classList.add("fa");
//         deleteProject.classList.add("fa-trash");
//
//         deleteProject.setAttribute("onclick", "deleteProject("+index+")")
//         status.setAttribute("onclick", "updateStatus("+index+")")
//         ++index;
//
//         tableRow.appendChild(name);
//         tableRow.appendChild(status);
//         tableRow.appendChild(deleteProject);
//
//         table.appendChild(tableRow);
//     });
// }

/*---------------------------------------------  TICKET PAGE FUNCTIONS  ---------------------------------------------*/

/*--------------------  REDIRECT TO TICKET PAGE  --------------------*/
// Save Required Selected Project Info
var selectedProjectID;
var selectedProjectTitle;

// Function id using a local sessionStorage to save required Project info
// b/c values cant be saved over other html pages otherwise
function GetProjectTickets(index){
  // Saves selected Project ID
  index--;
  selectedProjectID = projList[index][0];
  sessionStorage.setItem('selectedProjID', selectedProjectID)
  console.log(sessionStorage.getItem("selectedProjID"));

  selectedProjectTitle = projList[index][1];
  sessionStorage.setItem('selectedProjTitle', selectedProjectTitle)
  console.log(sessionStorage.getItem("selectedProjTitle"));

  // Rediects to Ticket Page from same iframe
  location.replace("ticket.html");
}

function GetProjectTitle(){
  ticketheader = document.getElementById('header-title');
  ticketheader.innerHTML = "You are viewing: " + sessionStorage.getItem("selectedProjTitle");
}

/*--------------------  REDIRECT TO PROJECT PAGE  --------------------*/
function GoBackToProjectPage(){
  // Rediects to Project Page from same iframe
  location.replace("project.html");
}

/*--------------------  TICKET TABLE  --------------------*/
// Fetch Ticket Contents and Input into Table
function GetAllTickets(){
  // Changes h1 to see what project you are currently viewing
  GetProjectTitle();
  // Clears ticket table before loading new tickets
  document.getElementById('tbody2').innerHTML= '';
  // Clears ticket contents before loading new ticket contents
  ticketList = [];
  tindex = 0;
  var projid = sessionStorage.getItem("selectedProjID");
  var ticketpath = "Projects/"+ projid +"/Tickets";
  var ticketref = firebase.database().ref(ticketpath);
  ticketref.once('value', function(AllTRecords){
  AllTRecords.forEach(
    function(CurrentTRecord){
      var tid = CurrentTRecord.val().TicketID;
      var tname = CurrentTRecord.val().TicketTitle;
      var tdesc = CurrentTRecord.val().TicketDescription;
      var tdead = CurrentTRecord.val().TicketDeadline;
      var tcat = CurrentTRecord.val().TicketCategory;
      var tcreator = CurrentTRecord.val().TicketCreator;
      AddTicketToTable(tid, tname, tdesc, tdead, tcat, tcreator);
    }
  );
  console.log(ticketList); // DEBUG
  });
}

// Save ticket contents into here for refernece
var ticketList = [];
var tindex = 0;

function AddTicketToTable(tid, tname, tdesc, tdead, tcat, tcreator){
  var tbody = document.getElementById('tbody2');
  var trow = document.createElement('tr');
  var td0 = document.createElement('td');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  ticketList.push([tid, tname, tdesc, tdead, tcat, tcreator]);
  tindex++;
  td0.innerHTML= tid;
  td1.innerHTML= tname;
  td2.innerHTML= tdesc;
  td3.innerHTML= tdead;
  td4.innerHTML= tcat;
  td5.innerHTML= tcreator;
  trow.appendChild(td0);
  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);

  var ControlDiv = document.createElement("div");
  ControlDiv.innerHTML = '<button type="button" id="editticketbtn" class="modal-trigger" data-target="modal-edit-ticket" onclick="EditTicket('+tindex+')">Edit</button>';
  ControlDiv.innerHTML += '<button type="button" id="selectticketbtn" onclick="FillTickBox('+tindex+')">Select</button>';
  ControlDiv.innerHTML += '<button type="button" id="deleteticketbtn" onclick="DeleteTicket('+tindex+')">Delete</button>';

  trow.appendChild(ControlDiv);
  tbody.appendChild(trow);
}

// Modal for editing tickets
function EditTicket(index){
  console.log('Edit ticket'+index);
  --index;
  // document.getElementById('edit-ptitle').value = projList[index][0]; // Trying to add a project title edit. Needs rework
  document.getElementById('edit-ttitle').value = ticketList[index][1];
  document.getElementById('edit-tdesc').value = ticketList[index][2];
}

// Fills ticketboxes for pulling tickets
// NEEDS EDITING
function FillTickBox(index){
  if(index == null){
    document.getElementById('ttitle').value = "";
    document.getElementById('tdesc').value = "";
    document.getElementById('tdeadline').value = "";
  }
  else{
    --index;
    document.getElementById('ttitle').value = ticketList[index][1];
    document.getElementById('tdesc').value = ticketList[index][2];
    document.getElementById('tdeadline').value = ticketList[index][3];
  }
}

// Realtime Database Ticket System variables
var ProjectPath = "Projects/";
var firebaseRef = firebase.database().ref(ProjectPath);

// Create Ticket using "Add Ticket" button
function addTicket(){
  // Setting input values
  var tickid = "tick"+Date.now().toString();
  var ticktitle = document.getElementById('ttitle').value;
  var tickdescription = document.getElementById('tdesc').value;
  var tickdeadline = document.getElementById('tdeadline').value;
  var tickcategory = document.getElementById('tcat').value;
  var tickcreator = GetUserInfo(currentUserData);

  // Updates Path & Realtime Database Ref
  ProjectPath = "Projects/" + sessionStorage.getItem("selectedProjID") + "/Tickets/" + tickid + "/";
  firebaseRef = firebase.database().ref(ProjectPath);

  // Adds to realtime database
  firebaseRef.set({TicketID:tickid, TicketTitle:ticktitle, TicketDescription:tickdescription, TicketDeadline:tickdeadline, TicketCategory:tickcategory, TicketCreator:tickcreator});
  // GetAllProjects();
  GetAllTickets();
  alert("Saved! ProjectPath: "+ProjectPath); //Debug
}

// Delete Ticket using My "Delete" button
function DeleteTicket(index){
  if(index == null){
    tickid = "";
  }
  else{
    index--;
    tickid = ticketList[index][0];
  }
  console.log(tickid);
  var ProjectPath = "Projects/"+ sessionStorage.getItem("selectedProjID") + "/Tickets/"+ tickid;
  var firebaseRef = firebase.database().ref(ProjectPath);

  console.log(firebaseRef.toString());
  firebaseRef.remove().then(
    function(){
      alert("Ticket was deleted"); // Debug
      GetAllTickets();
    }
  )
}


/*--------------------  PAUL'S OG TICKET PAGE JS  --------------------*/
// I removed ticket module functions to redo possibly? - MTo

// Selectors for new category form
const newCategoryForm = document.querySelector('[data-new-category-form]');
const newCategoryInput = document.querySelector('[data-new-category-input]');

// Selector for categories container
const categoriesContainer = document.querySelector('[data-categories]');

// Selector for currently viewing
const currentlyViewing = document.querySelector('[data-currently-viewing]');

// Selector for new ticket form
const newTicketForm = document.querySelector('[data-new-ticket-form]');
const newTicketSelect = document.querySelector('[data-new-ticket-select]');
const newTicketInput = document.querySelector('[data-new-ticket-input]');

// Selector for edit ticket form
const editTicketForm = document.querySelector('[data-edit-ticket-form]');
const editTicketSelect = document.querySelector('[data-edit-ticket-select]');
const editTicketInput = document.querySelector('[data-edit-ticket-input]');

// Selector for tickets container
const ticketsContainer = document.querySelector('[data-cards]');

// Local storage keys
const LOCAL_STORAGE_CATEGORIES_KEY = 'LOCAL_STORAGE_CATEGORIES_KEY';
const LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY = 'LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY';

let selectedCategoryId = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY);
let categories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY)) || [];

// EVENT: Add Category
newCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = newCategoryInput.value;
    const isCategoryEmpty = !category || !category.trim().length;

    if (isCategoryEmpty) {
        return console.log('please enter a task');
    }

    categories.push({ _id: Date.now().toString(), category: category, color: getRandomHexColor() });

    newCategoryInput.value = '';

    saveAndRender();
});

// EVENT: Get Selected Category Id
categoriesContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
        if (!e.target.dataset.categoryId) {
            selectedCategoryId = null;
        } else {
            selectedCategoryId = e.target.dataset.categoryId;
        }

        saveAndRender();
    }
});

// EVENT: Get Selected Category Color
categoriesContainer.addEventListener('change', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const newCategoryColor = e.target.value;
        const categoryId = e.target.parentElement.dataset.categoryId;
        const categoryToEdit = categories.find((category) => category._id === categoryId);

        categoryToEdit.color = newCategoryColor;

        saveAndRender();
    }
});

// EVENT: Delete Selected Category
currentlyViewing.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'span') {
        categories = categories.filter((category) => category._id !== selectedCategoryId);

        tickets = tickets.filter((ticket) => ticket.categoryId !== selectedCategoryId);

        selectedCategoryId = null;

        saveAndRender();
    }
});

// *==================== Functions ====================

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY, selectedCategoryId);
}

function render() {
    clearChildElements(categoriesContainer);
    clearChildElements(newTicketSelect);
    clearChildElements(editTicketSelect);
    clearChildElements(ticketsContainer);

    renderCategories();
    renderFormOptions();

    // Set the current viewing category
    if (!selectedCategoryId || selectedCategoryId === 'null') {
        currentlyViewing.innerHTML = `You are currently viewing <strong>All Categories</strong>`;
    } else {
        const currentCategory = categories.find((category) => category._id === selectedCategoryId);
        currentlyViewing.innerHTML = `You are currently viewing <strong>${currentCategory.category}</strong> <span>(delete)</span>`;
    }
}

function renderCategories() {
    categoriesContainer.innerHTML += `<li class="sidebar-item ${selectedCategoryId === 'null' || selectedCategoryId === null ? 'active' : ''}" data-category-id=""></li>
	`;

    categories.forEach(({ _id, category, color }) => {
        categoriesContainer.innerHTML += ` <li class="sidebar-item ${_id === selectedCategoryId ? 'active' : ''}" data-category-id=${_id}>${category}<input class="sidebar-color" type="color" value=${color}></li>`;
    });
}

function renderFormOptions() {

    newTicketSelect.innerHTML += `<option value="">Select A Category</option>`;
    editTicketSelect.innerHTML += `<option value="">Select A Category</option>`;

    categories.forEach(({ _id, category }) => {
        newTicketSelect.innerHTML += `<option value=${_id}>${category}</option>`;
        editTicketSelect.innerHTML += `<option value=${_id}>${category}</option>`;
    });
}


// HELPERS
function clearChildElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function convertHexToRGBA(hexCode, opacity) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
}

function getRandomHexColor() {
    var hex = (Math.round(Math.random() * 0xffffff)).toString(16);
    while (hex.length < 6) hex = "0" + hex;
    return `#${hex}`;
}

window.addEventListener('load', render);

window.addEventListener('load', render);
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});
