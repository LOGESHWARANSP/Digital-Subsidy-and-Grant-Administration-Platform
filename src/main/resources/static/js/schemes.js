const schemeContainer =
    document.getElementById("schemeContainer");


const schemeuserEmail =
    localStorage.getItem("userEmail");


// ================= LOAD SCHEMES =================

async function loadSchemes() {

    try {

        if (!schemeuserEmail) {

            window.location.href = "login.html";

            return;
        }


        // Get users
        const userResponse =
            await fetch(
                "http://localhost:8080/users",
                {
                    credentials: "include"
                }
            );


        if (!userResponse.ok) {

            throw new Error(
                "Unable to load users"
            );

        }


        const users =
            await userResponse.json();


        // Find logged-in user
        const currentUser =
            users.find(
                user =>
                    user.emailId &&
                    user.emailId
                        .trim()
                        .toLowerCase() ===
                    schemeuserEmail
                        .trim()
                        .toLowerCase()
            );


        if (!currentUser) {

            window.location.href =
                "profile.html";

            return;
        }


        // Get schemes
        const response =
            await fetch(
                "http://localhost:8080/schemes",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load schemes"
            );

        }


        const schemes =
            await response.json();


        // Get all applications
        const applicationResponse =
            await fetch(
                "http://localhost:8080/applications",
                {
                    credentials: "include"
                }
            );


        if (!applicationResponse.ok) {

            throw new Error(
                "Unable to load applications"
            );

        }


        const applications =
            await applicationResponse.json();


        // Only current user's applications
        const myApplications =
            applications.filter(
                application =>
                    application.user &&
                    application.user.id ===
                    currentUser.id
            );


        schemeContainer.innerHTML = "";


        // ================= DISPLAY SCHEMES =================

        schemes.forEach(function (scheme) {

            const card =
                document.createElement("div");

            card.className =
                "scheme-card";


            // Check whether user already applied
            const existingApplication =
                myApplications.find(
                    application =>
                        application.scheme &&
                        application.scheme.id ===
                        scheme.id &&
                        application.status !==
                        "WITHDRAWN"
                );


            let buttonHTML;


            if (existingApplication) {

                // Already applied
                buttonHTML = `

                    <button
                        class="scheme-btn applied-btn"
                        onclick="viewApplication()">

                        Applied ✓

                    </button>

                `;

            } else {

                // Not applied / withdrawn
                buttonHTML = `

                    <button
                        class="scheme-btn"
                        onclick="applyForScheme(${scheme.id})">

                        Apply Now

                    </button>

                `;

            }


            card.innerHTML = `

                <div class="scheme-top">

                    <span class="scheme-badge">
                        ${scheme.status}
                    </span>

                </div>


                <h3>
                    ${scheme.schemeName}
                </h3>


                <p>
                    ${scheme.description ||
            "No description available"}
                </p>


                <div class="scheme-info">

                    <div>

                        <small>
                            Maximum Amount
                        </small>

                        <strong>
                            ₹${scheme.maximumAmount}
                        </strong>

                    </div>


                    <div>

                        <small>
                            Maximum Income
                        </small>

                        <strong>
                            ₹${scheme.maximumIncome}
                        </strong>

                    </div>

                </div>


                <div class="scheme-details">

                    <p>
                        <strong>Age:</strong>
                        ${scheme.minimumAge} -
                        ${scheme.maximumAge}
                    </p>


                    <p>
                        <strong>Occupation:</strong>
                        ${scheme.eligibleOccupation}
                    </p>
  
                </div>


                ${buttonHTML}

            `;


            schemeContainer.appendChild(card);

        });


    } catch (error) {

        console.error(error);

        schemeContainer.innerHTML = `

            <p>
                Unable to load schemes.
            </p>

        `;

    }

}


// ================= APPLY =================

function applyForScheme(schemeId) {

    window.location.href =
        "apply.html?schemeId=" + schemeId;

}


// ================= VIEW APPLICATION =================

function viewApplication() {

    window.location.href =
        "my-applications.html";

}


// ================= LOGOUT =================

document.getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "userEmail"
            );

            window.location.href =
                "login.html";

        }
    );


loadSchemes();