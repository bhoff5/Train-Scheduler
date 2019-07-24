var firebaseConfig = {
    apiKey: "AIzaSyA-cFbPBoJWiHh-Yo3BdccEMn3winQ2TO8",
    authDomain: "test-80432.firebaseapp.com",
    databaseURL: "https://test-80432.firebaseio.com",
    projectId: "test-80432",
    storageBucket: "",
    messagingSenderId: "921489265203",
    appId: "1:921489265203:web:3530459cfb22ece3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";


$("#submit").on("click", function (event) {
    event.preventDefault();

    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#firstTrainTime").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    firstTrainTime = sv.firstTrainTime;

    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm");
    var currentTime = moment();
    console.log(moment().format("hh:mm"));
    var diffTime = currentTime.diff(firstTrainTimeConverted, "minutes");
    var remainderTime = sv.frequency - (diffTime % sv.frequency);
    var nextTrainTime = currentTime.add(remainderTime, "minutes");
    var minutesAway = nextTrainTime.diff(moment(), "minutes");

    function checkTime() {
        if (diffTime < 0) {
            nextTrainTime = firstTrainTimeConverted;
            minutesAway = nextTrainTime.diff(moment(), "minutes");
            console.log(minutesAway)
        }
    }
    checkTime();

    var newRow = $("<tr>");
    var trainNameTD = $("<td>").text(sv.trainName);
    var destinationTD = $("<td>").text(sv.destination);
    var frequencyTD = $("<td>").text(sv.frequency);
    var nextArrivalTD = $("<td>").text(nextTrainTime.format("hh:mm")).css("color", "#d7de4e");
    var minutesAwayTD = $("<td>").text(minutesAway);

    newRow.append(trainNameTD).append(destinationTD).append(frequencyTD).append(nextArrivalTD).append(minutesAwayTD);
    $("#tableRow").append(newRow);

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});