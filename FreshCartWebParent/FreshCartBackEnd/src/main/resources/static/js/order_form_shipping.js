document.addEventListener('DOMContentLoaded', function () {
    const deliverDaysInput = document.querySelector('input[name="deliverDays"]');
    const deliverDateElement = document.querySelector('input[name="deliverDateOnForm"]');
    const orderTimeElement = document.getElementById('orderTime'); // Lấy giá trị từ thẻ hidden

    if (deliverDaysInput && orderTimeElement && deliverDateElement) {
        deliverDaysInput.addEventListener('input', function () {
            const deliverDays = parseInt(deliverDaysInput.value, 10) || 0;

            // Lấy giá trị ngày tạo đơn hàng
            const orderTime = new Date(orderTimeElement.value);
            if (isNaN(orderTime.getTime())) {
                console.error('Ngày tạo đơn hàng không hợp lệ.');
                return;
            }

            // Cộng thêm số ngày giao hàng
            const deliverDate = new Date(orderTime);
            deliverDate.setDate(orderTime.getDate() + deliverDays);

            // Định dạng lại ngày giao hàng thành yyyy-MM-dd
            const formattedDate = deliverDate.toISOString().split('T')[0];

            // Gán giá trị vào trường ngày giao hàng
            deliverDateElement.value = formattedDate;
        });
    }
});
