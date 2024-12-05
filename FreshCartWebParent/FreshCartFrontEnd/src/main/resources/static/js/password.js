document.addEventListener('DOMContentLoaded', function () {
    // For main password field
    var password = document.getElementById('password'),
        toggler = document.getElementById('passwordToggler');

    // For confirm password field
    var confirmPassword = document.getElementById('confirmPassword'),
        confirmToggler = document.getElementById('confirmPasswordToggler');

    function showHidePassword(passwordField, togglerIcon) {
        if (passwordField.type === 'password') {
            passwordField.setAttribute('type', 'text');
            togglerIcon.classList.remove('bi-eye-slash');
            togglerIcon.classList.add('bi-eye');
        } else {
            passwordField.setAttribute('type', 'password');
            togglerIcon.classList.remove('bi-eye');
            togglerIcon.classList.add('bi-eye-slash');
        }
    }

    // Event listener for main password
    toggler.addEventListener('click', function() {
        showHidePassword(password, toggler);
    });

    // Event listener for confirm password
    confirmToggler.addEventListener('click', function() {
        showHidePassword(confirmPassword, confirmToggler);
    });
});
