const container =
    document.getElementById("eligibleSchemeContainer");

const userEmail =
    localStorage.getItem("userEmail");


async function loadEligibleSchemes() {

    try {

        // Get all users
        const userResponse = await fetch(
            "http://localhost:8080/users",
            {
                credentials: "include"
            }
        );

        if (!userResponse.ok) {
            throw new Error("Unable to load user");
        }

        const users = await userResponse.json();


        // Find logged-in user's profile
        const currentUser = users.find(
            user =>
                user.emailId &&
                user.emailId.trim().toLowerCase() ===
                userEmail.trim().toLowerCase()
        );


        if (!currentUser) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>Profile not found</h3>
                    <p>Please complete your profile first.</p>
                    <a href="profile.html"
                       class="btn primary-btn">
                        Complete Profile
                    </a>
                </div>
            `;

            return;
        }


        // Get eligible schemes
        const response = await fetch(
            "http://localhost:8080/schemes/eligible/"
            + currentUser.id,
            {
                credentials: "include"
            }
        );


        if (!response.ok) {
            throw new Error("Unable to load eligible schemes");
        }


        const schemes = await response.json();
        const applicationResponse = await fetch(
            "http://localhost:8080/applications",
            {
                credentials: "include"
            }
        );

        if (!applicationResponse.ok) {
            throw new Error("Unable to load applications");
        }

        const applications =
            await applicationResponse.json();

        container.innerHTML = "";


        if (schemes.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div>📋</div>

                    <h3>No eligible schemes</h3>

                    <p>
                        Currently, no subsidy schemes match
                        your profile.
                    </p>

                </div>
            `;

            return;
        }


        schemes.forEach(function (scheme) {

            const card =
                document.createElement("div");

            card.className = "scheme-card";

            const existingApplication =
                applications.find(
                    application =>
                        application.user &&
                        application.scheme &&
                        application.user.id === currentUser.id &&
                        application.scheme.id === scheme.id &&
                        application.status !== "WITHDRAWN"
                );

            let buttonHtml;

            if (existingApplication) {

                buttonHtml = `
        <button
            class="scheme-btn"
            disabled>

            Already Applied

        </button>
    `;

            } else {

                buttonHtml = `
        ${buttonHtml}    `;
            }
            card.innerHTML = `

                <div class="scheme-top">

                    <span class="scheme-badge">
                        ELIGIBLE
                    </span>

                </div>


                <h3>
                    ${scheme.schemeName}
                </h3>


                <p>
                    ${scheme.description || ""}
                </p>


                <div class="scheme-info">

                    <div>
                        <small>Maximum Amount</small>

                        <strong>
                            ₹${scheme.maximumAmount}
                        </strong>
                    </div>


                    <div>
                        <small>Maximum Income</small>

                        <strong>
                            ₹${scheme.maximumIncome}
                        </strong>
                    </div>

                </div>


                <div class="scheme-details">

                    <p>
                        <strong>Age:</strong>
                        ${scheme.minimumAge}
                        -
                        ${scheme.maximumAge}
                    </p>

                    <p>
                        <strong>Occupation:</strong>
                        ${scheme.eligibleOccupation}
                    </p>

                    </div>


                <button
                    class="scheme-btn"
                    onclick="applyForScheme(${scheme.id})">

                    Apply Now

                </button>

            `;


            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-state">

                <h3>Unable to load eligible schemes</h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;
    }
}


async function applyForScheme(schemeId) {

    try {

        const userResponse =
            await fetch(
                "http://localhost:8080/users",
                {
                    credentials: "include"
                }
            );

        if (!userResponse.ok) {
            throw new Error("Unable to load user");
        }

        const users =
            await userResponse.json();


        const currentUser =
            users.find(
                user =>
                    user.emailId &&
                    user.emailId.trim().toLowerCase() ===
                    userEmail.trim().toLowerCase()
            );


        if (!currentUser) {

            alert("Please complete your profile first.");

            return;
        }


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
                "Unable to check applications"
            );

        }


        const applications =
            await applicationResponse.json();


        // Check same user's application for same scheme

        const existingApplication =
            applications.find(
                application =>
                    application.user &&
                    application.scheme &&
                    application.user.id === currentUser.id &&
                    application.scheme.id === Number(schemeId) &&
                    application.status !== "WITHDRAWN"
            );


        if (existingApplication) {

            alert(
                "You have already applied for this scheme."
            );

            return;
        }


        // No active/previous application
        // OR previous application was WITHDRAWN

        window.location.href =
            "apply.html?schemeId=" + schemeId;

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to check your application status."
        );

    }

}


document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("userEmail");

        window.location.href = "login.html";

    });


loadEligibleSchemes();