const staffLoginForm =
    document.getElementById("staffLoginForm");

const staffMessage =
    document.getElementById("staffMessage");


staffLoginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("staffEmail").value;

        const password =
            document.getElementById("staffPassword").value;


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


            if (!response.ok) {

                staffMessage.className =
                    "message error";

                staffMessage.textContent =
                    "Invalid email or password.";

                return;
            }


            const staff =
                await response.json();


            localStorage.setItem(
                "staffEmail",
                staff.email
            );

            localStorage.setItem(
                "staffRole",
                staff.role
            );


            staffMessage.className =
                "message success";

            staffMessage.textContent =
                "Login successful!";


            setTimeout(function() {

                if (staff.role === "ADMIN") {

                    window.location.href =
                        "admin-dashboard.html";

                }

                else if (staff.role === "OFFICER") {

                    window.location.href =
                        "officer-dashboard.html";

                }

            },800);

        }

        catch(error) {

            staffMessage.className =
                "message error";

            staffMessage.textContent =
                "Unable to connect to server.";

        }

    }
);