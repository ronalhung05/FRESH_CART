function showModalDialog(title, message) {
    $("#modalTitle").text(title);
    $("#modalBody").text(message);
    $("#modalDialog").modal();
}

function showErrorMessage(message) {
    showModalDialog("Error", message);
}

function showWarningMessage(message) {
    showModalDialog("Warning", message);
}	