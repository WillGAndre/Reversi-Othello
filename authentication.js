let CURRENTUSER = null;
_initializeAuthentication();

// This function shall be called in the onLoad event ONLY!
function _initializeAuthentication(){
	//Define local storage basis
	if(!localStorage.getItem("users")){
		let initialUsers = [new User("guest", "")];
		localStorage.setItem("users", JSON.stringify(initialUsers));
	}
	
	// Define default CURRENTUSER
	let users = JSON.parse(localStorage.getItem("users"));
	let userIndex = users.findIndex(x => x.username === "guest");
	let user = users[userIndex];
	CURRENTUSER = new User(user.username, user.password);
	CURRENTUSER.totalPoints = user.totalPoints;
	CURRENTUSER.scores = user.scores;

	// Hide user information
	document.getElementById("userInformation").hidden = true;

	// Build Hall of Fame
	buildHOFTableBody();
}

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
			CURRENTUSER = new User(username, password);
			CURRENTUSER.totalPoints = user.totalPoints;
			CURRENTUSER.scores = user.scores;
			loginSuccess()
		} else {
			alert("User or password are incorrect");
		}
	} else { // otherwise
		CURRENTUSER = new User(username, password)
		users.push(CURRENTUSER);
		localStorage.setItem("users", JSON.stringify(users));
		loginSuccess()
	}
}
function loginSuccess(){
	document.getElementById("formLogin").hidden = true;
	document.getElementById("userInformation").hidden = false;
	document.getElementById("userUsername").innerText = CURRENTUSER.username;
}

function onLogoutUserPress(){
	let users = JSON.parse(localStorage.getItem("users"));
	let userIndex = users.findIndex(x => x.username === "guest");
	let user = users[userIndex];
	CURRENTUSER = new User(user.username, user.password);
	CURRENTUSER.totalPoints = user.totalPoints;
	CURRENTUSER.scores = user.scores;
	document.getElementById("formLogin").hidden = false;
	document.getElementById("userInformation").hidden = true;
}

/**
* Some objects.
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

		buildHOFTableBody();
	}
}

function Score(points, date){
	this.points = points;
	this.date = date;
}

/**
* Table scores
*/
function buildHOFTableBody(){
	let scores = [];
	JSON.parse(localStorage.getItem("users")).forEach(x => x.scores.forEach(y => scores.push({
		username: x.username,
		score: y
	})));
	scores = scores.sort((x,y) => x.score.points > y.score.points ? -1 : (x.score.points < y.score.points ? 1 : 0));

	let tableBody = document.getElementById("HOF_body");
	while(tableBody.firstChild){
		tableBody.removeChild(tableBody.firstChild);
	}
	for (var i = 0; i < (scores.length < 5 ? scores.length : 5); i++) {
		tableBody.appendChild((new HighScoreRow(scores[i].username, scores[i].score)).toHTMLRow());
	}
}

/**
* Some objects
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