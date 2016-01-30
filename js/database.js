function searchTasks()
{
  var keyword = document.getElementById("searchKeywords").value;
  searchTask("ChennaiFloods", keyword, function(data){});


}
function searchTask(term,keyword, callback){
  var keywords = keyword.split(" ");
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  taskRef.orderByChild("Taken").equalTo("0").on("value", function(snapshot) {

     var searchResult = [];
     snapshot.forEach(function(childSnapshot) {

        var temp = JSON.stringify(childSnapshot.val());
        console.log(temp);
        if(keywords){
          flag=0;
          for(i=0;i<keywords.length;i++)
          {
            var n = temp.search(keywords[i]);
            if(n>-1){
              flag=0;
            }
            else
            {
              console.log("Not matched");
              flag=1;
              break;
            }
          }
          if(flag==0)
            searchResult.push(temp);
        }
      });
     console.log(searchResult);

      callback(searchResult);
  });
}
function allTasks(disaster, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  taskRef.orderByChild("Taken").equalTo("0").on("value", function(snapshot) {

     var searchResult = [];
     snapshot.forEach(function(childSnapshot) {
        var temp = JSON.stringify(childSnapshot.val());
        if(disaster){
          var n = temp.search(disaster);
          if(n>-1){
            searchResult.push(childSnapshot.val());
          }
        }
        else{
         searchResult.push(childSnapshot.val());
        }
      });
     console.log(searchResult);

      callback(searchResult);
  });
}

function saveTask(task, callback){
  ref.child("Tasks").push(task);
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  task.forEach(function(object){
    taskRef.update(object, callback);
  });
}
  
function takeTask(uid, requestID, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE+requestID);
  taskRef.update({"Taken":uid}, callback);
}
function completeTask(uid, requestID, callback){
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE+requestID);
  taskRef.update({"Finished":uid}, callback);
}

function getMyTasks(uid, callback){
  var return_data = [];
  var taskRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  taskRef.orderByChild("Taken").equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data){
      return_data.push(data.val());
    });
    callback(return_data);
  });
}

function getCompletedTasks(uid, callback){
  var return_data = [];
  var bookRef = new Firebase(FIRE_BASE_URL+TASKS_TABLE);
  bookRef.orderByChild("Finished").equalTo(uid).on("value", function(snapshot) {
    snapshot.forEach(function(data){
      return_data.push(data.val());
    });
    callback(return_data);
  });
}

function getUser(uid, callback){
var user_data = [];
var userRef = new Firebase(FIRE_BASE_URL+USERS_TABLE+uid);

userRef.once('value', function(data) {
	//console.log(data.val());
  user_data.push(data.val());
	callback(user_data);
	});
}


getUser('facebook:1037502162960482', function(data){
    data.forEach(function(innerData){
        //console.log(innerData.fname);
    });
});

