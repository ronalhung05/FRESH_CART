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
                console.error('Invalid orderTime value.');
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
    } else {
        console.error('Required elements not found: deliverDaysInput, orderTimeElement, or deliverDateElement.');
    }
});

$(document).ready(function () {
    $('.container').on('blur', "input[name='deliverDays']", function () {
        const noteField = $(this);
        const value = noteField.val().toString().trim();

        if (!value) {
            showWarningMessage(messages.NOT_NULL_DELIVERDAYS);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else if (!Number.isInteger(Number(value)) || parseInt(value, 10) <= 0) {
            showWarningMessage(messages.EXCEED_MAX_LENGTH_DELIVERDAYS);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else {
            noteField.removeClass('is-invalid');
        }
    });

    $('.container').on('blur', "input[name='phoneNumber']", function () {
        const noteField = $(this);
        const value = noteField.val().toString().trim();

        if (!value) {
            showWarningMessage(messages.NOT_NULL_PHONENUMBER);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else if (!/^\d{10}$/.test(value)) {
            showWarningMessage(messages.NOT_PHONENUMBER);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else {
            noteField.removeClass('is-invalid');
        }
    });

    $('.container').on('blur', "input[name='firstName']", function () {
        const noteField = $(this);
        const value = noteField.val().toString().trim();

        if (!value) {
            showWarningMessage(messages.NOT_NULL_FIRSTNAME);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else if (value.length > 30) {
            showWarningMessage(messages.EXCEED_MAX_LENGTH_FIRSTNAME);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else {
            noteField.removeClass('is-invalid');
        }
    });

    $('.container').on('blur', "input[name='lastName']", function () {
        const noteField = $(this);
        const value = noteField.val().toString().trim();

        if (!value) {
            showWarningMessage(messages.NOT_NULL_LASTNAME);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else if (value.length > 30) {
            showWarningMessage(messages.EXCEED_MAX_LENGTH_LASTNAME);
            noteField.addClass('is-invalid');
            noteField.focus();
        } else {
            noteField.removeClass('is-invalid');
        }
    });
});
