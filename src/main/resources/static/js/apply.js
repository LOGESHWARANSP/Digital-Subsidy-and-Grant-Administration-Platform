const userEmail = localStorage.getItem("userEmail");

const applicationCard =
    document.querySelector(".auth-card");

const params = new URLSearchParams(window.location.search);

const schemeId = params.get("schemeId");

const schemeName =
    document.getElementById("schemeName");

const schemeDescription =
    document.getElementById("schemeDescription");

const maximumAmount =
    document.getElementById("maximumAmount");

const maximumIncome =
    document.getElementById("maximumIncome");

const ageLimit =
    document.getElementById("ageLimit");

const occupation =
    document.getElementById("occupation");

const requiredDocuments =
    document.getElementById("requiredDocuments");

const applicationForm =
    document.getElementById("applicationForm");

const applicationMessage =
    document.getElementById("applicationMessage");


let selectedScheme;


// ================= LOAD SCHEME =================

async function loadScheme() {

    try {

        const response = await fetch(
            `http://localhost:8080/schemes/${schemeId}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load scheme");
        }

        selectedScheme = await response.json();


        // Scheme details

        schemeName.textContent =
            selectedScheme.schemeName;

        schemeDescription.textContent =
            selectedScheme.description;
        document.getElementById("schemeBenefits").textContent =
            selectedScheme.benefits || "Benefits information not available.";

        maximumAmount.textContent =
            "₹" + selectedScheme.maximumAmount;

        maximumIncome.textContent =
            "₹" + selectedScheme.maximumIncome;

        ageLimit.textContent =
            selectedScheme.minimumAge +
            " - " +
            selectedScheme.maximumAge;

        occupation.textContent =
            selectedScheme.eligibleOccupation;
        const eligible =
            await checkEligibility();

        if (!eligible) {
            return;
        }


        // ================= REQUIRED DOCUMENTS =================

        requiredDocuments.innerHTML = "";


        if (!selectedScheme.requiredDocuments) {

            requiredDocuments.innerHTML = `
                <p>
                    No documents required.
                </p>
            `;

            return;
        }


        const documents =
            selectedScheme.requiredDocuments
                .split(",")
                .map(document => document.trim())
                .filter(document => document !== "");


        documents.forEach(function (documentName) {

            const documentDiv =
                document.createElement("div");

            documentDiv.className =
                "required-document";


            documentDiv.innerHTML = `

                <label>
                    ${documentName}
                </label>

                <input
                    type="file"
                    class="document-file"
                    data-document-type="${documentName}"
                    accept=".pdf"
                    required
                >

            `;


            requiredDocuments.appendChild(
                documentDiv
            );

        });


    } catch (error) {

        console.error(error);

        schemeName.textContent =
            "Unable to load scheme";

        requiredDocuments.innerHTML = `
            <p class="message error">
                Unable to load required documents.
            </p>
        `;

    }
}


// ================= SUBMIT APPLICATION =================

applicationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();
        const confirmed = confirm(
            "Are you sure you want to submit this application?"
        );

        if (!confirmed) {
            return;
        }

        applicationMessage.className =
            "message";

        applicationMessage.textContent =
            "Submitting application...";


        try {

            // ================= GET LOGGED-IN USER =================

            const userEmail =
                localStorage.getItem("userEmail");


            if (!userEmail) {

                window.location.href =
                    "login.html";

                return;
            }


            const userResponse =
                await fetch(
                    "http://localhost:8080/users",
                    {
                        credentials: "include"
                    }
                );


            if (!userResponse.ok) {

                throw new Error(
                    "Unable to load user"
                );

            }


            const users =
                await userResponse.json();


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

                throw new Error(
                    "User profile not found"
                );

            }


            // ================= CREATE APPLICATION =================

            const applicationResponse =
                await fetch(
                    "http://localhost:8080/applications",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            user: {
                                id: currentUser.id
                            },

                            scheme: {
                                id: Number(schemeId)
                            },

                            applicationDate:
                                new Date()
                                    .toISOString()
                                    .split("T")[0],

                            status: "SUBMITTED"

                        })
                    }
                );


            if (!applicationResponse.ok) {

                const error =
                    await applicationResponse.json();

                throw new Error(
                    error.message ||
                    "Application submission failed"
                );

            }


            const application =
                await applicationResponse.json();


            console.log(
                "Application created:",
                application
            );


            // ================= UPLOAD DOCUMENTS =================

            const fileInputs =
                document.querySelectorAll(
                    ".document-file"
                );


            for (const input of fileInputs) {

                const file =
                    input.files[0];

                const documentType =
                    input.dataset.documentType;


                if (!file) {

                    throw new Error(
                        "Please upload " +
                        documentType
                    );

                }
                const fileName =
                    file.name.toLowerCase();

                if (!fileName.endsWith(".pdf")) {

                    throw new Error(
                        documentType + " must be a PDF file."
                    );
                }


                const formData =
                    new FormData();


                formData.append(
                    "file",
                    file
                );

                formData.append(
                    "documentType",
                    documentType
                );

                formData.append(
                    "applicationId",
                    application.id
                );


                const documentResponse =
                    await fetch(
                        "http://localhost:8080/documents/upload",
                        {
                            method: "POST",

                            credentials: "include",

                            body: formData
                        }
                    );


                if (!documentResponse.ok) {

                    throw new Error(
                        "Failed to upload " +
                        documentType
                    );

                }


                const uploadedDocument =
                    await documentResponse.json();


                console.log(
                    "Uploaded document:",
                    uploadedDocument
                );

            }


            // ================= SUCCESS =================

            applicationMessage.className =
                "message success";

            applicationMessage.textContent =
                "Application and documents submitted successfully!";


            setTimeout(function () {

                window.location.href =
                    "my-applications.html";

            }, 1200);


        } catch (error) {

            console.error(error);

            applicationMessage.className =
                "message error";

            applicationMessage.textContent =
                error.message ||
                "Unable to submit application.";

        }

    }
);


// ================= LOGOUT =================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "userEmail"
            );

            window.location.href =
                "login.html";

        }
    );

}

async function checkEligibility() {

    if (!userEmail) {
        window.location.href = "login.html";
        return false;
    }

    try {

        // Get logged-in user's profile
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

        const currentUser = users.find(
            user =>
                user.emailId &&
                user.emailId.trim().toLowerCase() ===
                userEmail.trim().toLowerCase()
        );

        if (!currentUser) {

            showNotEligible(
                "Please complete your profile before applying."
            );

            return false;
        }


        // ================= SCHEME STATUS =================

        if (selectedScheme.status !== "ACTIVE") {

            showNotEligible(
                "This scheme is currently not active."
            );

            return false;
        }


        // ================= SCHEME DATE =================

        const today = new Date().toISOString().split("T")[0];

        if (
            today < selectedScheme.startDate ||
            today > selectedScheme.endDate
        ) {

            showNotEligible(
                "This scheme is currently outside its application period."
            );

            return false;
        }


        // ================= AGE =================

        const birthDate =
            new Date(currentUser.dateofbirth);

        const todayDate = new Date();

        let age =
            todayDate.getFullYear() -
            birthDate.getFullYear();

        const month =
            todayDate.getMonth() -
            birthDate.getMonth();

        if (
            month < 0 ||
            (month === 0 &&
                todayDate.getDate() < birthDate.getDate())
        ) {
            age--;
        }


        if (
            age < selectedScheme.minimumAge ||
            age > selectedScheme.maximumAge
        ) {

            showNotEligible(
                `Your age (${age}) does not meet the required age range of ${selectedScheme.minimumAge} - ${selectedScheme.maximumAge}.`
            );

            return false;
        }


        // ================= INCOME =================

        if (
            Number(currentUser.annualIncome) >
            Number(selectedScheme.maximumIncome)
        ) {

            showNotEligible(
                `Your annual income exceeds the maximum income limit of ₹${selectedScheme.maximumIncome}.`
            );

            return false;
        }
        // ================= LOCATION =================


        // ================= OCCUPATION =================

        if (
            selectedScheme.eligibleOccupation &&
            selectedScheme.eligibleOccupation
                .toLowerCase() !==
            currentUser.occupation
                .toLowerCase()
        ) {

            showNotEligible(
                `This scheme is available only for ${selectedScheme.eligibleOccupation}.`
            );

            return false;
        }


        // Everything is valid
        return true;

    } catch (error) {

        console.error(error);

        showNotEligible(
            "Unable to verify your eligibility. Please try again."
        );

        return false;
    }
}
function showNotEligible(reason) {

    applicationCard.innerHTML = `

        <div style="text-align:center; padding:30px;">

            <div style="font-size:45px;">
                ❌
            </div>

            <h2>
                You are not eligible
            </h2>

            <p style="color:#64748b; margin:15px 0;">
                ${reason}
            </p>

            <a
                href="schemes.html"
                class="btn primary-btn">

                Back to Schemes

            </a>

        </div>

    `;
}
// ================= START =================

loadScheme();