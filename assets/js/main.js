const userId = 173;
var filter;
var tasks = [];

var addLoadingScreen = function(){
    $("#list").append("<div class='text-center' id='loading'>" +
                        "<i class='fa fa-spinner fa-spin'></i>" +
                        " Loading" +
                      "</div>")
};

var removeLoadingScreen = function() {
    $("#loading").remove();
};

var getTodos = function(filter) {
    addLoadingScreen();
    $.ajax({
        type: "GET",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=" + userId,
        dataType: "json",
        success: function(response, status) {
            tasks = response.tasks;
            filterData()
            removeLoadingScreen();
        },
        error: function(err, status, errMessage) {
            console.log(errMessage);
        }
    });
};

var updateStatus = function(taskId, isComplete) {
    var uriParam = isComplete ? "mark_complete" : "mark_active";
    $.ajax({
        type: "PUT",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks/" + taskId + "/" + uriParam + "?api_key=" + userId,
        dataType: "json",
        success: function(response, status) {
            createAlert("Successfully Changed Status", "success");
            tasks.splice(tasks.map(x => x.id).indexOf(response.task.id), 1, response.task);
            filterData(filter);
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
            createAlert("Successfully Added Task");
            tasks.push(response.task);
            filterData(filter);
        },
        error: function(err, status, errMessage) {
            console.log(errMessage);
        }
    });
};

var deleteTodo = function(taskId) {
    $.ajax({
        type: "DELETE",
        url: "https://altcademy-to-do-list-api.herokuapp.com/tasks/" + taskId + "?api_key=" + userId,
        dataType: "json",
        success: function(response, status) {
            tasks.splice(tasks.map(x => x.id).indexOf(taskId), 1);
            filterData(filter);
            createAlert("Successfully removed Task", "success");
        },
        error(err, status, errMessage) {
            console.log(errMessage);
        }
    });
};

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
};

var createList = function(tasks) {
    if(tasks.length === 0) {
        $("#list").append("<div class='text-center'>No Tasks Available</div>")
    }
    tasks.forEach(task => {
        addTaskToDom(task);
    })  
};

var addTodoItem = function(event) {
    event.preventDefault();
    createTodo($(this).find("[name=taskName]").val());
    $(this).find("[name=taskName]").val("");
};

var changeCategory = function() {
    filter = $(this).data("filter");
    filterData(filter);
};

var filterData = function(filter) {
    $("#list").text("");
    var filteredTasks = [];

    switch(filter) {
        case 0: filteredTasks = tasks.filter(x => x.completed === false);
            break;
        case 1: filteredTasks = tasks.filter(x => x.completed === true);
            break;
        default: filteredTasks = tasks;
    }

    createList(filteredTasks);
}

var toggleComplete = function() {
    var completeIcon = $(this).children(".completed").first();
        var item = $(this).closest(".item");
        var isComplete = item.data("complete") ? false : true;

        item.addClass("disabled");
        completeIcon.removeClass(["far", "fa-square", "fa-check-square"]);
        completeIcon.addClass(["fa", "fa-spin", "fa-spinner"]);
        updateStatus(item.data("id"), isComplete);
}

var createEventListeners = function() {
    $(document).on("click", ".item-fg", toggleComplete);

    $(document).on("click", ".item-bg", function() {
        var item = $(this).closest(".item");
        item.addClass("disabled");

        deleteTodo(item.data("id"));
    });

    $(document).on("submit", "#todoForm", addTodoItem);

    filter = $("#filter");

    for(var child of filter.children()) {
        $($(child).children()[0]).on("change", changeCategory);
    }
};

$(document).ready(function() {
    getTodos();
    createEventListeners();
});