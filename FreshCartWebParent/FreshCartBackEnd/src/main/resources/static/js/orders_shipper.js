var iconNames = {
	'PICKED': 'fa-people-carry',
	'SHIPPING': 'fa-shipping-fast',
	'DELIVERED': 'fa-box-open',
	'RETURNED': 'fa-undo'
};

var confirmText;
var confirmModalDialog;
var yesButton;
var noButton;

$(document).ready(function() {
	confirmText = $("#confirmText");
	confirmModalDialog = $("#confirmModal");
	yesButton = $("#yesButton");
	noButton = $("#noButton");

	$(document).on("click", ".linkUpdateStatus", function(e) {
		e.preventDefault();
		const link = $(this);

		console.log("Link clicked:", {
			orderId: link.attr("orderId"),
			status: link.attr("status"),
			href: link.attr("href")
		});
		showUpdateConfirmModal(link);
	});

	$(document).on("click", "#noButton", function(e) {
		console.log("NO button clicked");
		$("#confirmModal").modal("hide");
	});

	$(document).on("click", ".close", function(e) {
		console.log("Close button clicked");
		$("#confirmModal").modal("hide");
	});

	addEventHandlerForYesButton();
});

function addEventHandlerForYesButton() {
	yesButton.click(function(e) {
		e.preventDefault();
		sendRequestToUpdateOrderStatus($(this));
	});
}

function sendRequestToUpdateOrderStatus(button) {
	requestURL = button.attr("href");

	$.ajax({
		type: 'POST',
		url: requestURL,
		beforeSend: function(xhr) {
			xhr.setRequestHeader(csrfHeaderName, csrfValue);
		}
	}).done(function(response) {
		showMessageModal("Order updated successfully");
		updateStatusIconColor(response.orderId, response.status);

		console.log(response);
	}).fail(function(err) {
		showMessageModal("Error updating order status");
	})
}

function updateStatusIconColor(orderId, status) {
	link = $("#link" + status + orderId);
	link.replaceWith("<i class='fas " + iconNames[status] + " fa-2x icon-green'></i>");
}

function showUpdateConfirmModal(link) {
	noButton.text("NO");
	yesButton.show();

	orderId = link.attr("orderId");
	status = link.attr("status");
	yesButton.attr("href", link.attr("href"));

	const href = link.attr("href");
	if (!orderId || !status || !href) {
		console.error("Missing attributes for link:", link);
		return;
	}

	confirmText.text("Are you sure you want to update status of the order ID #" + orderId
		+ " to " + status + "?");
	console.log("Showing modal for:", { orderId, status, href });
	$("#confirmModal").modal("show"); // Chỉ rõ ID modal
}

function showMessageModal(message) {
	noButton.text("Close");
	yesButton.hide();
	confirmText.text(message);

	noButton.off("click").on("click", function () {
		confirmModalDialog.modal("hide");
	});

	confirmModalDialog.modal("show");
}