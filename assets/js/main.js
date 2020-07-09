const userId = 173;
var checked = false;
var alertArray = [];

var addLoadingScreen = function(){
    $("#list").append("<div class='text-center' id='loading'>" +
                        "<i class='fa fa-spinner fa-spin'></i>" +
                        " Loading" +
                      "</div>")
};

var removeLoadingScreen = function() {
    $("#loading").remove();
};

var getTodos = function() {
    $.ajax({
        type: "GET",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=" + userId,
        dataType: "json",
        success: function(response, status) {
            removeLoadingScreen();
            createList(response.tasks);
            console.log(response);
        },
        error: function(err, status, errMessage) {
            console.log(errMessage);
        }
    });
}

var createList = function(tasks) {
    tasks.forEach(task => {
        $("#list").append("<div class='item' data-id='" + task.id + "' data-complete='" + task.completed + "'>" +
                            "<i class='completed far " + (task.completed ? "fa-check-square" : "fa-square") + "'></i>" +
                            "<span>" + task.content + "</span>" +
                            "<i class='remove fa fa-times'></i>");
    })  
};

var createAlert = function(text, type) {
    var alertType = type ? type : "success";
    $("#alertContainer").prepend("<button type='button' class='alert alert-" + type + "' data-dismiss='alert' aria-label='Close'>" +
                                text +
                            "</button>")

    // <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    //     <span aria-hidden="true">&times;</span>
    // </button>
}

var toggleCompleted = function(taskId, isComplete) {
    var uriParam = isComplete ? "mark_complete" : "mark_active";
    $.ajax({
        type: "PUT",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks/" + taskId + "/" + uriParam + "?api_key=" + userId,
        dataType: "json",
        success: function(response, status) {
            createAlert("Successfully Changed Status", "success");
        },
        error: function(err, status, errMessage) {
            console.log(errMessage);
        }
    });
};

var createEventListeners = function() {
    $(document).on("click", ".completed", function() {
        var item = $(this).closest(".item");
        var isComplete = item.data("complete") ? false : true;

        $(this).toggleClass(["fa-square", "fa-check-square"]);
        item.data("complete", isComplete);
        toggleCompleted(item.data("id"), isComplete);
    });
}

$(document).ready(function() {
    $("#list").text("");
    addLoadingScreen();
    getTodos();
    createEventListeners();
});

{/* <div class="item" data-id="123">
        <i class="far fa-square"></i>
        <span>Must Do Something</span>
        <i class="fa fa-times"></i>
    </div> */}