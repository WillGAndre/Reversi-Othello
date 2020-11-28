/**
 * In order to implement some sort of user management, we use the localStorage.
 * The usage of localStorage is as follows:
 *  	users - This will store as a string, all users that once logged in the site.
 *  	currentUser - This will store as a string, the current user. Like a login "remember me" is set to true.
 */

let CURRENTUSER = null;
_initializeAuthentication();

const login_fetch = document.getElementById("login_bt");
/* Register player to tw server */
login_fetch.addEventListener("click", function() {
  if (document.getElementById("userInformation").hidden == false) {
    getFetch("http://twserver.alunos.dcc.fc.up.pt:8008/register",{'nick': CURRENTUSER.username, 'pass': CURRENTUSER.password});
  }
}, false);

function onLoginSubmitPress(){
	let username = document.getElementById("autUsername").value.trim();
	let password = document.getElementById("autPassword").value;

	if(username === "guest"){
		alert("You cannot use this username");
		return;
	}
	if(username === "" || password === ""){
		return;
	}

	let users = JSON.parse(localStorage.getItem("users")); 
	
	let userIndex = users.findIndex(x => x.username === username);
	let user = users[userIndex];
	if(user){ // user exists;
		if(password === user.password){
			_setCurrentUser(user);
			loginSuccess();
		} else {
			alert("User or password are incorrect");
		}
	} else { // otherwise
		_setCurrentUser(new User(username, password));
		users.push(CURRENTUSER);
		localStorage.setItem("users", JSON.stringify(users));
		loginSuccess();
	}
}
function loginSuccess(){
	document.getElementById("formLogin").hidden = true;
	document.getElementById("userInformation").hidden = false;
	document.getElementById("userUsername").innerText = CURRENTUSER.username;
}

function onLogoutUserPress(){
	_setCurrentUser(_getGuestUser());

	document.getElementById("formLogin").hidden = false;
	document.getElementById("userInformation").hidden = true;
	pl2_checked.checked = false;
}

function buildHOFTableBody(){
	let scores = [];
	// Sorting all the existing scores in descendant order
	JSON.parse(localStorage.getItem("users")).forEach(x => x.scores.forEach(y => scores.push({
		username: x.username,
		score: y
	})));
	scores = scores.sort((x,y) => x.score.points > y.score.points ? -1 : (x.score.points < y.score.points ? 1 : 0));

	let tableBody = document.getElementById("HOF_body");
	// Remove existing scores
	while(tableBody.firstChild){
		tableBody.removeChild(tableBody.firstChild);
	}
	// Add the top 5 scores
	for (var i = 0; i < (scores.length < 5 ? scores.length : 5); i++) {
		tableBody.appendChild((new HighScoreRow(scores[i].username, scores[i].score)).toHTMLRow());
	}
}

/**
 * HOF table "classes"
 */
function HighScoreRow(username, score){
	this.username = username;
	this.score = score.points;
	this.date = score.date;

	this.toHTMLRow = function(){
        let ret = document.createElement("tr");
        let tableCell;

        tableCell = document.createElement("td");
        tableCell.textContent = this.username;
        ret.appendChild(tableCell);

        tableCell = document.createElement("td");
        tableCell.textContent = this.score;
        ret.appendChild(tableCell);

        tableCell = document.createElement("td");
        tableCell.textContent = new Date(this.date).toLocaleDateString();
        ret.appendChild(tableCell);
        
        return ret;
	}
}

/**
 * User "classes"
 */
function User(username, password){
	this.username = username;
	this.password = password;
	this.totalPoints = 0;
	this.scores = [];

	this.addScore = function(points){
		this.totalPoints += points;
		this.scores.push(new Score(points, new Date().toISOString()));
		
		// Update Local Storage
		let users = JSON.parse(localStorage.getItem("users"));
		let userIndex = users.findIndex(x => x.username === this.username);

		users[userIndex] = this;
		CURRENTUSER = this;

		localStorage.setItem("users", JSON.stringify(users));
		localStorage.setItem("currentUser", JSON.stringify(this));

		buildHOFTableBody();
	}
}
function Score(points, date){
	this.points = points;
	this.date = date;
}

/**
 * Private functions
 */
// This funtion will validate if the localStorage has already been used and initialize it if necessary.
function _initializeAuthentication(){
	//Define local storage basis
	let initialUsers = [new User("guest", "")];
	if(!localStorage.getItem("users")){
		localStorage.setItem("users", JSON.stringify(initialUsers));
	}
	if(!localStorage.getItem("currentUser")){
		localStorage.setItem("currentUser", JSON.stringify(initialUsers[0]));
	}
	
	// Define default CURRENTUSER
	let currentUser = JSON.parse(localStorage.getItem("currentUser"));
	_setCurrentUser(currentUser);
	
	// Hide user information
	if(CURRENTUSER.username === "guest"){
		document.getElementById("userInformation").hidden = true;
	} else {
		loginSuccess();
	}
	// Build Hall of Fame
	buildHOFTableBody();
}

function _setCurrentUser(user){
	CURRENTUSER = new User(user.username, user.password);
	CURRENTUSER.totalPoints = user.totalPoints;
	CURRENTUSER.scores = user.scores;
	localStorage.setItem("currentUser", JSON.stringify(CURRENTUSER));
}

function _getGuestUser(){
	let users = JSON.parse(localStorage.getItem("users"));
	let userIndex = users.findIndex(x => x.username === "guest");
	let user = users[userIndex];

	let ret = new User(user.username, user.password);
	ret.scores = user.scores;
	ret.totalPoints = user.totalPoints;

	return ret;
}

// ------------------------------------------------------------------------
