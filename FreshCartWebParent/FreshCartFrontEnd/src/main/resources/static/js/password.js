document.addEventListener('DOMContentLoaded', function () {
    var password = document.getElementById('password'),
        toggler = document.getElementById('passwordToggler');

    function showHidePassword() {
        if (password.type === 'password') {
            password.setAttribute('type', 'text');
            toggler.classList.remove('bi-eye-slash');
            toggler.classList.add('bi-eye');
        } else {
            password.setAttribute('type', 'password');
            toggler.classList.remove('bi-eye');
            toggler.classList.add('bi-eye-slash');
        }
    }

    toggler.addEventListener('click', showHidePassword);
});
