const staffLoginForm =
    document.getElementById("staffLoginForm");

const staffMessage =
    document.getElementById("staffMessage");

const staffPassword =
    document.getElementById("staffPassword");

const toggleStaffPassword =
    document.getElementById("toggleStaffPassword");


// Show / hide password
toggleStaffPassword.addEventListener("click", function () {

    if (staffPassword.type === "password") {

        staffPassword.type = "text";
        toggleStaffPassword.textContent = "🙈";

    } else {

        staffPassword.type = "password";
        toggleStaffPassword.textContent = "👁";

    }

});


staffLoginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("staffEmail").value;

        const password =
            staffPassword.value;


        staffMessage.className = "message";
        staffMessage.textContent = "";


        try {

            const response = await fetch(
                "http://localhost:8080/staff/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );
            if (response.ok) {

                const staff = await response.json();

                localStorage.removeItem("userEmail");

                localStorage.setItem("staffEmail", staff.email);
                localStorage.setItem("staffRole", staff.role);

                staffMessage.className = "message success";
                staffMessage.textContent = "Login successful!";

                setTimeout(() => {

                    if (staff.role === "ADMIN") {
                        window.location.href = "admin-dashboard.html";
                    }
                    else if (staff.role === "FIELD_OFFICER") {
                        window.location.href = "field-officer.html";
                    }
                    else if (staff.role === "DISTRICT_OFFICER") {
                        window.location.href = "district-officer.html";
                    }
                    else if (staff.role === "FINANCE_OFFICER") {
                        window.location.href = "officer-bank-details.html";
                    }

                }, 800);
            }
            else {
                staffMessage.className = "message error";
                staffMessage.textContent = "Invalid email or password.";
            }

        }

        catch(error) {

            staffMessage.className =
                "message error";

            staffMessage.textContent =
                "Unable to connect to server.";

        }

    }
);