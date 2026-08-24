const userEmail = localStorage.getItem("userEmail");


// If user is not logged in
if (!userEmail) {

    window.location.href = "login.html";

}


// ================= PROFILE DROPDOWN =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");

const navUserEmail =
    document.getElementById("navUserEmail");

const dropdownEmail =
    document.getElementById("dropdownEmail");


if (userEmail) {

    navUserEmail.textContent = userEmail;

    dropdownEmail.textContent = userEmail;

}


profileButton.addEventListener("click", function () {

    profileDropdown.classList.toggle("show");

});


// ================= CHECK PROFILE =================

async function checkUserProfile() {

    try {

        const response = await fetch(
            "http://localhost:8080/users",
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (!response.ok) {

            console.log("Unable to get users");

            return;

        }


        const users = await response.json();


        const currentUser = users.find(
            user =>
                user.emailId &&
                user.emailId.trim().toLowerCase() ===
                userEmail.trim().toLowerCase()
        );


        console.log("LOGIN EMAIL:", userEmail);

        console.log("MATCHED USER:", currentUser);


        if (!currentUser) {

            alert("Please complete your profile first.");

            window.location.href = "profile.html";

            return;

        }


        console.log("User profile found:", currentUser);

    }
    catch (error) {

        console.error(
            "Profile check failed:",
            error
        );

    }

}


// ================= LOGOUT =================

document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("userEmail");

        window.location.href = "login.html";

    });


// Start profile check
checkUserProfile();