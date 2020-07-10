const userId = 173;
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

var createTodo = function(taskDesc) {
    $.ajax({
        type: "POST",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=" + userId,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            task: {
                content: taskDesc
            }
        }),
        success: function(response, status) {
            console.log(response.task);
            addTaskToDom(response.task);
        },
        error: function(err, status, errMessage) {
            console.log(errMessage);
        }
    });
}

var deleteTodo = function(taskId) {
    $.ajax({
        type: "DELETE",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks/" + taskId + "?api_key=" + userId,
        dataType: "json",
        success: function(response, status) {
            console.log(response.task);
            createAlert("Successfully removed Task", "success");
        }
    });
}

var addTaskToDom = function(task) {
    $("#list").append("<div class='item' data-id='" + task.id + "' data-complete='" + task.completed + "'>" +
                            "<div class='item-fg'>" +
                                "<i class='completed far " + (task.completed ? "fa-check-square" : "fa-square") + "'></i>" +
                                "<div class='d-inline-block'>" + task.content + "</div>" +
                            "</div>" +
                            "<div class='item-bg'>" +
                                "<i class='remove fa fa-times'></i>" +
                            "</div>" +
                      "</div>");
}

var createList = function(tasks) {
    tasks.forEach(task => {
        addTaskToDom(task);
    })  
};

var createAlert = function(text, type) {
    var alertType = type ? type : "success";
    $("#alertContainer").prepend("<button type='button' class='alert alert-" + alertType + "' data-dismiss='alert' aria-label='Close'>" +
                                text +
                            "</button>");
}

var addTodoItem = function(event) {
    event.preventDefault();
    createTodo($(this).find("[name=taskName]").val());
}

var createEventListeners = function() {
    $(document).on("click", ".item-fg", function() {
        var completeIcon = $(this).children(".completed").first();
        var item = $(this).closest(".item");
        var isComplete = item.data("complete") ? false : true;

        completeIcon.toggleClass(["fa-square", "fa-check-square"]);
        item.data("complete", isComplete);
        toggleCompleted(item.data("id"), isComplete);
    });

    $(document).on("click", ".item-bg", function() {
        var item = $(this).closest(".item");
        deleteTodo(item.data("id"));
        item.slideUp(350, function() {
            $(this).remove();
        });
    });

    $(document).on("submit", "#todoForm", addTodoItem);
}

$(document).ready(function() {
    addLoadingScreen();
    getTodos();
    createEventListeners();
});