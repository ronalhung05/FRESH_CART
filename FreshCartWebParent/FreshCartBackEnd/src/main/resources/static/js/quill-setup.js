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

    let shortDescriptionEditor, fullDescriptionEditor;

    // Khởi tạo Quill cho Short Description
    if (document.getElementById('shortDescriptionEditor')) {
        shortDescriptionEditor = new Quill('#shortDescriptionEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        const shortDescriptionInput = document.getElementById('shortDescriptionInput');
        if (shortDescriptionInput && shortDescriptionInput.value) {
            shortDescriptionEditor.root.innerHTML = shortDescriptionInput.value;
        }

        shortDescriptionEditor.on('text-change', function() {
            const content = shortDescriptionEditor.root.innerHTML;
            shortDescriptionInput.value = content;
            
            // Validate content
            if (isQuillEmpty(shortDescriptionEditor)) {
                const errorElement = document.getElementById('shortDescriptionError');
                errorElement.textContent = messages.SHORT_DESCRIPTION_REQUIRED;
                errorElement.style.display = 'none';
                $(errorElement).fadeIn();
                shortDescriptionEditor.root.style.border = '1px solid #dc3545';
            } else {
                document.getElementById('shortDescriptionError').style.display = 'none';
                shortDescriptionEditor.root.style.border = '1px solid #ced4da';
            }
        });

        // Add blur event for short description
        shortDescriptionEditor.root.addEventListener('blur', function() {
            const content = shortDescriptionEditor.root.innerHTML;
            shortDescriptionInput.value = content;
            
            if (isQuillEmpty(shortDescriptionEditor)) {
                const errorElement = document.getElementById('shortDescriptionError');
                errorElement.textContent = messages.SHORT_DESCRIPTION_REQUIRED;
                errorElement.style.display = 'none';
                $(errorElement).fadeIn();
                shortDescriptionEditor.root.style.border = '1px solid #dc3545';
            }
        });
    }

    // Khởi tạo Quill cho Full Description
    if (document.getElementById('fullDescriptionEditor')) {
        fullDescriptionEditor = new Quill('#fullDescriptionEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });

        const fullDescriptionInput = document.getElementById('fullDescriptionInput');
        if (fullDescriptionInput && fullDescriptionInput.value) {
            fullDescriptionEditor.root.innerHTML = fullDescriptionInput.value;
        }

        fullDescriptionEditor.on('text-change', function() {
            const content = fullDescriptionEditor.root.innerHTML;
            fullDescriptionInput.value = content;
            
            // Validate content
            if (isQuillEmpty(fullDescriptionEditor)) {
                const errorElement = document.getElementById('fullDescriptionError');
                errorElement.textContent = messages.FULL_DESCRIPTION_REQUIRED;
                errorElement.style.display = 'none';
                $(errorElement).fadeIn();
                fullDescriptionEditor.root.style.border = '1px solid #dc3545';
            } else {
                document.getElementById('fullDescriptionError').style.display = 'none';
                fullDescriptionEditor.root.style.border = '1px solid #ced4da';
            }
        });

        // Add blur event for full description
        fullDescriptionEditor.root.addEventListener('blur', function() {
            const content = fullDescriptionEditor.root.innerHTML;
            fullDescriptionInput.value = content;
            
            if (isQuillEmpty(fullDescriptionEditor)) {
                const errorElement = document.getElementById('fullDescriptionError');
                errorElement.textContent = messages.FULL_DESCRIPTION_REQUIRED;
                errorElement.style.display = 'none';
                $(errorElement).fadeIn();
                fullDescriptionEditor.root.style.border = '1px solid #dc3545';
            }
        });
    }

    // Helper function to check if Quill editor is empty
    function isQuillEmpty(quill) {
        if (!quill || !quill.root) return true;
        
        // Check if the editor contains only whitespace or empty HTML tags
        const text = quill.getText().trim();
        const html = quill.root.innerHTML;
        return text.length === 0 || html === '<p><br></p>';
    }

    // Add form submit validation
    const productForm = document.querySelector('form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            let isValid = true;

            // Validate short description
            if (shortDescriptionEditor && isQuillEmpty(shortDescriptionEditor)) {
                const errorElement = document.getElementById('shortDescriptionError');
                errorElement.textContent = messages.SHORT_DESCRIPTION_REQUIRED;
                errorElement.style.display = 'none';
                $(errorElement).fadeIn();
                shortDescriptionEditor.root.style.border = '1px solid #dc3545';
                isValid = false;
            }

            // Validate full description
            if (fullDescriptionEditor && isQuillEmpty(fullDescriptionEditor)) {
                const errorElement = document.getElementById('fullDescriptionError');
                errorElement.textContent = messages.FULL_DESCRIPTION_REQUIRED;
                errorElement.style.display = 'none';
                $(errorElement).fadeIn();
                fullDescriptionEditor.root.style.border = '1px solid #dc3545';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                document.getElementById('description-tab').click();
            }
        });
    }
});