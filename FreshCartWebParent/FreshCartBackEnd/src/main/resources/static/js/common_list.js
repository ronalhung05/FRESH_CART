function clearFilter() {
	window.location = moduleURL;
}

function showDeleteConfirmModal(link, entityName) {
	// Lấy `entityId` từ thuộc tính `data-entity-id`
	var entityId = link.data("entity-id");

	// Xóa href của `#yesButton` để tránh điều hướng tự động
	$("#yesButton").attr("href", "");

	// Cập nhật liên kết của nút xác nhận để thực hiện xóa khi người dùng đồng ý
	$("#yesButton").attr("href", link.attr("href"));

	// Hiển thị thông báo xác nhận
	$("#confirmText").text("Are you sure you want to delete this " + entityName + " ID " + entityId + "?");

	// Hiển thị modal xác nhận
	$("#confirmModal").modal("show");
}

