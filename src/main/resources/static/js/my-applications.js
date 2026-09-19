const container =
    document.getElementById("applicationsContainer");

const userEmail =
    localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "login.html";
}

const navUserEmail =
    document.getElementById("navUserEmail");

const dropdownEmail =
    document.getElementById("dropdownEmail");

if (navUserEmail) {
    navUserEmail.textContent = userEmail;
}

if (dropdownEmail) {
    dropdownEmail.textContent = userEmail;
}
// ================= APPLICATION PROGRESS =================

function getProgressSteps(status) {

    const stages = [
        "Application Submitted",
        "Field Officer Verified",
        "District Officer Verified",
        "Bank Details Submitted",
        "Bank Details Verified",
        "Application Approved",
        "Installment 1 Paid",
        "Utilization Proof 1 Submitted",
        "Utilization Proof 1 Verified",
        "Installment 2 Paid",
        "Utilization Proof 2 Submitted",
        "Utilization Proof 2 Verified",
        "Disbursed"
    ];

    const statusStageMap = {

        "SUBMITTED": 0,
        "FIELD_VERIFIED": 1,
        "DISTRICT_APPROVED": 2,

        "BANK_DETAILS_SUBMITTED": 3,

        // Bank details rejected → Step 4 current
        "BANK_DETAILS_REJECTED": 2,
        "BANK_REJECTED": 2,

        "BANK_VERIFIED": 4,
        "APPROVED": 5,

        "INSTALLMENT_1_PAID": 6,

        "UTILIZATION_PROOF_1_SUBMITTED": 7,

        // Proof 1 rejected → Step 8 current
        "UTILIZATION_PROOF_1_REJECTED": 6,

        "UTILIZATION_PROOF_1_VERIFIED": 8,

        "INSTALLMENT_2_PAID": 9,

        "UTILIZATION_PROOF_2_SUBMITTED": 10,

        // Proof 2 rejected → Step 11 current
        "UTILIZATION_PROOF_2_REJECTED": 9,

        "UTILIZATION_PROOF_2_VERIFIED": 11,

        "DISBURSED": 12

    };

    let currentStage;

    if (status === "DISBURSED") {

        // All stages completed
        currentStage = stages.length;

    } else {

        // Current status completed
        // Next step becomes current
        currentStage =
            (statusStageMap[status] ?? 0) + 1;

    }

    return `
        <div class="application-progress">

            <div class="progress-track">

                ${stages.map((stage, index) => {

        let stepClass = "upcoming";
        let symbol = index + 1;

        if (index < currentStage) {

            stepClass = "completed";
            symbol = "✓";

        } else if (index === currentStage) {

            stepClass = "current";
            symbol = index + 1;

        } else {

            stepClass = "upcoming";
            symbol = index + 1;

        }

        return `
            <div class="progress-step ${stepClass}">

                <div class="progress-icon">
                    ${symbol}
                </div>

                <div class="progress-number">
                    ${index + 1}
                </div>

                <div class="progress-label">
                    ${stage}
                </div>

            </div>
        `;

    }).join("")}

            </div>

        </div>
    `;

}
async function loadApplications() {

    if (!userEmail) {

        window.location.href = "login.html";

        return;
    }


    try {

        // ================= GET USER PROFILES =================

        const userResponse = await fetch(
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


        // ================= FIND LOGGED-IN USER =================

        const currentUser =
            users.find(
                user =>
                    user.emailId &&
                    user.emailId
                        .trim()
                        .toLowerCase() ===
                    userEmail
                        .trim()
                        .toLowerCase()
            );


        if (!currentUser) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        Profile not found
                    </h3>

                    <p>
                        Please complete your profile first.
                    </p>

                    <a href="profile.html"
                       class="btn primary-btn">
                        Complete Profile
                    </a>

                </div>
            `;

            return;
        }


        // ================= GET ALL APPLICATIONS =================

        const response = await fetch(
            "http://localhost:8080/applications",
            {
                credentials: "include"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load applications"
            );

        }


        const applications =
            await response.json();


        // ================= ONLY LOGGED-IN USER'S APPLICATIONS =================

        const myApplications =
            applications
                .filter(application => {

                    if (!application.user) {
                        return false;
                    }


                    const sameUser =
                        Number(application.user.id) ===
                        Number(currentUser.id)

                        ||

                        (
                            application.user.emailId &&
                            currentUser.emailId &&

                            application.user.emailId
                                .trim()
                                .toLowerCase() ===
                            currentUser.emailId
                                .trim()
                                .toLowerCase()
                        );


                    return sameUser &&
                        application.status !== "WITHDRAWN";

                })


                // ================= SORT =================

                .sort((a, b) => {

                    const dateDifference =
                        new Date(b.applicationDate) -
                        new Date(a.applicationDate);


                    if (dateDifference !== 0) {
                        return dateDifference;
                    }


                    return b.id - a.id;

                });


        console.log(
            "CURRENT USER:",
            currentUser
        );

        console.log(
            "MY APPLICATIONS:",
            myApplications
        );


        container.innerHTML = "";


        // ================= NO APPLICATIONS =================

        if (myApplications.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div>📋</div>

                    <h3>
                        No applications yet
                    </h3>

                    <p>
                        You haven't applied for any
                        subsidy schemes yet.
                    </p>

                    <a href="eligible-schemes.html"
                       class="btn primary-btn">
                        View Eligible Schemes
                    </a>

                </div>
            `;

            return;
        }


        // ================= CREATE APPLICATION CARDS =================

        for (const application of myApplications) {

            const card =
                document.createElement("div");

            card.className =
                "application-card";


            const schemeName =
                application.scheme
                    ? application.scheme.schemeName
                    : "Unknown Scheme";


            const status =
                application.status ||
                "SUBMITTED";
            console.log("Application ID:", application.id);
            console.log("Application Status:", application.status);


            // ================= APPLICATION CARD =================

            card.innerHTML = `

                <div class="application-card-header">

                    <div>

                        <p class="hero-tag">
                            APPLICATION #${application.id}
                        </p>

                        <h3>
                            ${schemeName}
                        </h3>

                    </div>


                    <span class="
                        application-status
                        ${status.toLowerCase()}
                    ">
                        ${status}
                    </span>

                </div>


                <div class="application-details">

                    <div>

                        <small>
                            Application Date
                        </small>

                        <strong>
                            ${application.applicationDate}
                        </strong>

                    </div>


                    <a
                        href="application-details.html?applicationId=${application.id}"
                        class="view-application-btn"
                    >
                        View Application →
                    </a>

                </div>
                ${getProgressSteps(status)}


                ${
                status === "SUBMITTED" ||
                status === "PENDING"

                    ?

                    `
                    <div style="margin-top: 20px;">

                        <button
                            class="btn login-btn withdraw-btn"
                            data-id="${application.id}"
                        >
                            Withdraw Application
                        </button>

                    </div>
                    `

                    :

                    ""
            }

            `;


            // ================= ADD CARD =================

            container.appendChild(card);


            // ================= WITHDRAW =================

            const withdrawButton =
                card.querySelector(".withdraw-btn");


            if (withdrawButton) {

                withdrawButton.addEventListener(
                    "click",
                    async function () {

                        const applicationId =
                            this.dataset.id;


                        const confirmed =
                            confirm(
                                "Are you sure you want to withdraw this application?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            const response =
                                await fetch(
                                    `http://localhost:8080/applications/${applicationId}/withdraw`,
                                    {
                                        method: "PUT",
                                        credentials: "include"
                                    }
                                );


                            if (!response.ok) {

                                let errorMessage =
                                    "Unable to withdraw application.";


                                try {

                                    const error =
                                        await response.json();

                                    errorMessage =
                                        error.message ||
                                        errorMessage;

                                } catch (e) {
                                    // Ignore JSON parsing error
                                }


                                alert(errorMessage);

                                return;
                            }


                            alert(
                                "Application withdrawn successfully."
                            );


                            // Remove card from screen

                            card.remove();


                        } catch (error) {

                            console.error(error);

                            alert(
                                "Unable to connect to the server."
                            );

                        }

                    }
                );

            }

        }


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

    }

}


loadApplications();