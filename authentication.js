/**
 * In order to implement some sort of user management, we use the localStorage.
 * The usage of localStorage is as follows:
 *  	users - This will store as a string, all users that once logged in the site.
 *  	currentUser - This will store as a string, the current user. Like a login "remember me" is set to true.
 */

 /**
  * Some points about the authentication:
  * - We know that it isn't secure to store the user password in the localStorage but we wanted to implement some sort of login "remember me".
  * An alternative would be to create a cockie with expiration time and in the backend we would validate it. But we don't have access to backend.
  * - We thought about what happens if the user changes password. The localStorage would not be updated... This point is a consequence of the other
  * but since it isn't supposed to exist such functionality, it will not be a problem.
  */

let CURRENTUSER = null;
_initializeAuthentication();

function onLoginSubmitPress() {
	let username = document.getElementById("autUsername").value.trim();
	let password = document.getElementById("autPassword").value;

	if (username === "guest") {
		alert("You cannot use this username");
		return;
	}
	if (username === "" || password === "") {
		return;
	}

	// This is the workaround we found to pass the username and the password t the _registerSuccess
	let fnRegisterSuccess = this._registerSuccess.bind(this, username, password);
	othelloService.register({
		nick: username,
		pass: password
	}).then(data => {
		if (!data.error) {
			fnRegisterSuccess.call();
		} else {
			alert(data.error);
		}
	});
}

function loginSuccess() {
	document.getElementById("formLogin").hidden = true;
	document.getElementById("userInformation").hidden = false;
	document.getElementById("userUsername").innerText = CURRENTUSER.username;
}

function onLogoutUserPress() {
	if(othelloService.game){
		othelloService.leave({
			game: othelloService.game,
			nick: CURRENTUSER.username,
			pass: CURRENTUSER.password
		})
	}
	_setCurrentUser(_getGuestUser());

	document.getElementById("formLogin").hidden = false;
	document.getElementById("userInformation").hidden = true;
	pl2_checked.checked = false;
}

function buildHOFTableBody() {
	let scores = [];
	// Sorting all the existing scores in descendant order
	JSON.parse(localStorage.getItem("users")).forEach(x => x.scores.forEach(y => scores.push({
		username: x.username,
		score: y
	})));
	scores = scores.sort((x, y) => x.score.points > y.score.points ? -1 : (x.score.points < y.score.points ? 1 : 0));

	let tableBody = document.getElementById("HOF_body");
	// Remove existing scores
	while (tableBody.firstChild) {
		tableBody.removeChild(tableBody.firstChild);
	}
	// Add the top 5 scores
	for (var i = 0; i < (scores.length < 5 ? scores.length : 5); i++) {
		tableBody.appendChild((new HighScoreRow(scores[i].username, scores[i].score)).toHTMLRow());
	}
}

/**
 * Private functions
 */
// This funtion will validate if the localStorage has already been used and initialize it if necessary.
function _initializeAuthentication() {
	//Define local storage basis
	let initialUsers = [new User("guest", "")];
	if (!localStorage.getItem("users")) {
		localStorage.setItem("users", JSON.stringify(initialUsers));
	}
	if (!localStorage.getItem("currentUser")) {
		localStorage.setItem("currentUser", JSON.stringify(initialUsers[0]));
	}

	// Define default CURRENTUSER
	let currentUser = JSON.parse(localStorage.getItem("currentUser"));
	// _setCurrentUser(currentUser);

	// Hide user information
	if (currentUser.username === "guest") {
		document.getElementById("userInformation").hidden = true;
	} else {
		// This is the workaround we found to pass the username and the password to the _registerSuccess function
		let fnRegisterSuccess = this._registerSuccess.bind(this, currentUser.username, currentUser.password);
		othelloService.register({
			nick: currentUser.username,
			pass: currentUser.password
		}).then(data => {
			if (!data.error) {
				fnRegisterSuccess.call();
			} else {
				alert(data.error);
			}
		});
	}
	// Build Hall of Fame
	buildHOFTableBody();
}

function _registerSuccess(username, password) {
	let users = JSON.parse(localStorage.getItem("users"));

	let userIndex = users.findIndex(x => x.username === username);
	let user = users[userIndex];

	if (user) { // user exists
		_setCurrentUser(user);
	} else { // otherwise
		_setCurrentUser(new User(username, password));
		users.push(CURRENTUSER);
		localStorage.setItem("users", JSON.stringify(users));
	}
	loginSuccess();
}

function _setCurrentUser(user) {
	CURRENTUSER = new User(user.username, user.password);
	CURRENTUSER.totalPoints = user.totalPoints;
	CURRENTUSER.scores = user.scores;
	localStorage.setItem("currentUser", JSON.stringify(CURRENTUSER));
}

function _getGuestUser() {
	let users = JSON.parse(localStorage.getItem("users"));
	let userIndex = users.findIndex(x => x.username === "guest");
	let user = users[userIndex];

	let ret = new User(user.username, user.password);
	ret.scores = user.scores;
	ret.totalPoints = user.totalPoints;

	return ret;
}

// ------------------------------------------------------------------------

/**
 * HOF table "classes"
 */
function HighScoreRow(username, score) {
	this.username = username;
	this.score = score.points;
	this.date = score.date;

	this.toHTMLRow = function () {
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
function User(username, password) {
	this.username = username;
	this.password = password;
	this.totalPoints = 0;
	this.scores = [];

	this.addScore = function (points) {
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
function Score(points, date) {
	this.points = points;
	this.date = date;
}