ref.onAuth(function(authData) {
	console.log("outside if")
	console.log(authData);
	console.log("in");
  if (authData) {
  	console.log("inside if")
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    if (authData.facebook){
    	  ref.child("users").child(authData.facebook.id).set({
		      fname: getFName(authData),
		      lname: getLName(authData),
		      id: getId(authData)
	    });
    }
    //ref.child("users").child(authData.facebook.id).set({
      //fname: getFName(authData),
      //lname: getLName(authData),
      //id: getId(authData)
    //});
		if (authData.twitter){
			console.log(authData.twitter);
			ref.child("users").child(authData.twitter.id).set({
					/*username: authData.twitter.username,
					displayname: authData.twitter.displayName,
					id: twitter.id*/
					fname: authData.twitter.displayName,
		      		lname: authData.twitter.displayName,
		      		id: authData.twitter.id
				});
		}
    //ref.child("users").child(authData.twitter.id).set({
      //fname: getFName(authData),
      //lname: getLName(authData),
      //id: getId(authData)
    //});
  }
});

function getId(authData){
	return authData.facebook.id;
}

function getFName(authData){
	return authData.facebook.cachedUserProfile.first_name;
}

function getLName(authData){
	return authData.facebook.cachedUserProfile.last_name;
}


function loginFB(){

	ref.authWithOAuthPopup("facebook", function(error, authData) {
  		if (error) {
   			console.log("Login Failed!", error);
  		} else {
  			console.log("Authenticated successfully with payload:", authData.facebook.cachedUserProfile.first_name);
  			checkSession();
  		}
	}, {
  		remember: "sessionOnly"
	});
}
function loginTwitter(){

	ref.authWithOAuthPopup("twitter", function(error, authData) {
  		if (error) {
   			console.log("Login Failed!", error);
  		} else {
  			console.log("Authenticated successfully with payload:", authData.twitter.cachedUserProfile.first_name);  //authData
  			checkSession();
  		}
	}, {
  		remember: "sessionOnly"
	});
}
function logout(){
	ref.unauth();
	window.location.href = "index.html";
}

function checkSession(){
	authData = ref.getAuth();
	console.log("Entertin");
	console.log(authData);
	if(authData){
		window.location.href = "pages/index.html";
	}
}

function checkSessionLogin(){
	authData = ref.getAuth();
	console.log(authData);
	if(authData == null){
		window.location.href = "index.html";
	}else{
		window.full_name = getFName(authData) + " "+ getLName(authData);
		$(".username").html("&nbsp;&nbsp;" + window.full_name);
	}
}

$("#logout_anchor").click(function(){
    logout();
});

