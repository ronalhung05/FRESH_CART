document.addEventListener('DOMContentLoaded', function() {
    // Cấu hình chung cho Quill
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link']
    ];

    // Khởi tạo Quill cho Customer Verification
    if (document.getElementById('emailContentEditor')) {
        const customerVerificationEditor = new Quill('#emailContentEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        // Load nội dung từ input hidden
        const customerVerificationContent = document.getElementById('customerVerificationContent');
        if (customerVerificationContent && customerVerificationContent.value) {
            customerVerificationEditor.root.innerHTML = customerVerificationContent.value;
        }

        // Cập nhật input hidden khi nội dung thay đổi
        customerVerificationEditor.on('text-change', function() {
            customerVerificationContent.value = customerVerificationEditor.root.innerHTML;
        });
    }

    // Khởi tạo Quill cho Order Confirmation
    if (document.getElementById('orderEmailContentEditor')) {
        const orderConfirmationEditor = new Quill('#orderEmailContentEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        // Load nội dung từ input hidden
        const orderConfirmationContent = document.getElementById('orderConfirmationContent');
        if (orderConfirmationContent && orderConfirmationContent.value) {
            orderConfirmationEditor.root.innerHTML = orderConfirmationContent.value;
        }

        // Cập nhật input hidden khi nội dung thay đổi
        orderConfirmationEditor.on('text-change', function() {
            orderConfirmationContent.value = orderConfirmationEditor.root.innerHTML;
        });
    }

    // Khởi tạo Quill cho Short Description
    if (document.getElementById('shortDescriptionEditor')) {
        const shortDescriptionEditor = new Quill('#shortDescriptionEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        // Load nội dung từ input hidden
        const shortDescriptionInput = document.getElementById('shortDescriptionInput');
        if (shortDescriptionInput && shortDescriptionInput.value) {
            shortDescriptionEditor.root.innerHTML = shortDescriptionInput.value;
        }

        // Cập nhật input hidden khi nội dung thay đổi
        shortDescriptionEditor.on('text-change', function() {
            shortDescriptionInput.value = shortDescriptionEditor.root.innerHTML;
        });
    }

    // Khởi tạo Quill cho Full Description
    if (document.getElementById('fullDescriptionEditor')) {
        const fullDescriptionEditor = new Quill('#fullDescriptionEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        // Load nội dung từ input hidden
        const fullDescriptionInput = document.getElementById('fullDescriptionInput');
        if (fullDescriptionInput && fullDescriptionInput.value) {
            fullDescriptionEditor.root.innerHTML = fullDescriptionInput.value;
        }

        // Cập nhật input hidden khi nội dung thay đổi
        fullDescriptionEditor.on('text-change', function() {
            fullDescriptionInput.value = fullDescriptionEditor.root.innerHTML;
        });
    }
});