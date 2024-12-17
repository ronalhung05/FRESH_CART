document.addEventListener('DOMContentLoaded', function () {
    // For password field
    var password = document.getElementById('password'),
        toggler = document.getElementById('passwordToggler');

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

    // Event listener for password
    toggler.addEventListener('click', function() {
        showHidePassword(password, toggler);
    });
}); 