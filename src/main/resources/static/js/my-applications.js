const container =
    document.getElementById("applicationsContainer");

const userEmail =
    localStorage.getItem("userEmail");


async function loadApplications() {

    if (!userEmail) {

        window.location.href = "login.html";

        return;
    }


    try {

        // Get user profiles
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


        // Find logged-in user
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


        // Get all applications
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


        // Only logged-in user's applications
        const myApplications =
            applications
                .filter(
                    application =>
                        application.user &&
                        application.user.id === currentUser.id &&
                        application.status !== "WITHDRAWN"
                )
                .sort(
                    (a, b) => {

                        const dateDifference =
                            new Date(b.applicationDate) -
                            new Date(a.applicationDate);

                        if (dateDifference !== 0) {
                            return dateDifference;
                        }

                        return b.id - a.id;
                    }
                );


        container.innerHTML = "";


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


            // ================= GET DOCUMENTS =================

            let documents = [];

            try {

                const documentResponse =
                    await fetch(
                        `http://localhost:8080/documents/application/${application.id}`,
                        {
                            credentials: "include"
                        }
                    );


                if (documentResponse.ok) {

                    documents =
                        await documentResponse.json();

                }

            } catch (error) {

                console.error(
                    "Unable to load documents:",
                    error
                );

            }


            // ================= DOCUMENT HTML =================

            let documentHTML = "";


            if (documents.length === 0) {

                documentHTML = `
            <p>
                No documents uploaded.
            </p>
        `;

            } else {

                documents.forEach(function (document) {

                    const verificationStatus =
                        document.verificationStatus || "PENDING";

                    documentHTML += `

        <div class="application-document">

            <div>

                <strong>
                    📄 ${document.documentType}
                </strong>

                <span class="document-status ${verificationStatus.toLowerCase()}">
                    ${verificationStatus}
                </span>

            </div>

            <a
                href="http://localhost:8080/documents/${document.id}/file"
                target="_blank"
                class="view-pdf-btn">

                View PDF

            </a>

        </div>

    `;

                });

            }


            // ================= APPLICATION CARD =================
            let bankDetails = null;

            if (status === "APPROVED") {

                try {

                    const bankResponse =
                        await fetch(
                            "http://localhost:8080/bank-details/application/"
                            + application.id,
                            {
                                credentials: "include"
                            }
                        );

                    if (bankResponse.ok) {

                        bankDetails =
                            await bankResponse.json();

                    }

                } catch (error) {

                    console.error(
                        "Unable to load bank details:",
                        error
                    );

                }

            }
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


            <span class="application-status ${status.toLowerCase()}">
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

        </div>


      

            <!-- Uploaded Documents -->
            
            <div class="application-documents">
            
                <h4>Uploaded Documents</h4>
            
                ${documentHTML}
            
            </div>
            <!-- BANK DETAILS -->

<!-- BANK DETAILS -->

${
                status === "APPROVED"

                    ?

                    bankDetails

                        ?

                        bankDetails.verificationStatus === "REJECTED"

                            ?

                            `
<div class="bank-status rejected">

    <strong>
        🏦 Bank Details: REJECTED
    </strong>

    <p>
        Your bank details were rejected.
        Please submit the correct bank details.
    </p>

    <button
        class="btn login-btn bank-details-btn"
        data-id="${application.id}">

        🏦 Resubmit Bank Details

    </button>

</div>
`

                            :

                            bankDetails.verificationStatus === "PENDING"

                                ?

                                `
<div class="bank-status pending">

    <strong>
        🏦 Bank Details: PENDING
    </strong>

    <p>
        Your bank details are under verification.
    </p>

</div>
`

                                :

                                `
<div class="bank-status verified">

    <strong>
        🏦 Bank Details: VERIFIED
    </strong>

    <p>
        Your bank details have been verified.
        Payment is being processed.
    </p>

</div>
`

                        :

                        `
<div class="bank-status no-bank">

    <strong>
        🏦 Bank Details Not Submitted
    </strong>

    <br><br>

    <button
        class="btn login-btn bank-details-btn"
        data-id="${application.id}">

        🏦 Submit Bank Details

    </button>

</div>
`

                    :

                    ""
            }
        <!-- Withdraw -->

        ${
                status === "SUBMITTED" ||
                status === "PENDING"

                    ?

                    `
            <div style="margin-top: 20px;">

                <button
                    class="btn login-btn withdraw-btn"
                    data-id="${application.id}">

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
            const bankDetailsButton =
                card.querySelector(".bank-details-btn");

            if (bankDetailsButton) {

                bankDetailsButton.addEventListener(
                    "click",
                    function () {

                        const applicationId =
                            this.dataset.id;

                        window.location.href =
                            "bank-details.html?applicationId="
                            + applicationId;

                    }
                );

            }

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


                            // Remove from screen
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