let currentUser = null;

document.getElementById("userInformation").hidden = true;

function onLoginSubmitPress(){
	let username = document.getElementById("autUsername").value;
	let password = document.getElementById("autPassword").value;

	if(username === "" || password === ""){
		return;
	}

	let user = localStorage.getItem(username);
	if(user){ // user exists
		user = JSON.parse(user);
		if(password === user.password){
			currentUser = user;
			loginSuccess()
		} else {
			alert("User or password are incorrect");
		}
	} else { // otherwise
		currentUser = new User(username, password)
		localStorage.setItem(username, JSON.stringify(currentUser));
		loginSuccess()
	}
}
function loginSuccess(){
	document.getElementById("formLogin").hidden = true;
	document.getElementById("userInformation").hidden = false;
	document.getElementById("userUsername").innerText = currentUser.username;
}

function onLogoutUserPress(){
	currentUser = null;
	document.getElementById("formLogin").hidden = false;
	document.getElementById("userInformation").hidden = true;
}

function User(username, password){
	this.username = username;
	this.password = password;
	this.totalPoints = 0;
	this.scores = [];

	function addScore(points){
		this.totalPoints += points;
		this.scores.push(new Score(points, new Date()));
	}
}

function Score(points, date){
	this.points = points;
	this.date = date;
}