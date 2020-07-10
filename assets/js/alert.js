//Requires Bootstrap Alert
var createAlert = function(text, type) {
    var alertType = type ? type : "success";
    var alert = $("<button type='button' class='alert alert-" + alertType + " fade show' data-dismiss='alert' aria-label='Close'>" +
                    text +
                  "</button>");
    $("#alertContainer").prepend(alert);
    window.setTimeout(function() {
        $(alert).alert("close");
    }, 3000);
}