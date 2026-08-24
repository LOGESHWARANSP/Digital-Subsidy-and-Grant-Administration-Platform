(function () {

    const loggedInEmail =
        localStorage.getItem("userEmail");

    if (!loggedInEmail) {
        window.location.href = "login.html";
        return;
    }


    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const navUserEmail =
        document.getElementById("navUserEmail");

    const dropdownEmail =
        document.getElementById("dropdownEmail");


    if (navUserEmail) {
        navUserEmail.textContent = loggedInEmail;
    }

    if (dropdownEmail) {
        dropdownEmail.textContent = loggedInEmail;
    }


    if (profileButton && profileDropdown) {

        profileButton.addEventListener(
            "click",
            function () {

                profileDropdown.classList.toggle("show");

            }
        );

    }


    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                localStorage.removeItem("userEmail");

                window.location.href =
                    "login.html";

            }
        );

    }

})();