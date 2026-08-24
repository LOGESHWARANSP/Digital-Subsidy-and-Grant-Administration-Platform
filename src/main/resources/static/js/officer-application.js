const documentsContainer =
    document.getElementById("documentsContainer");


// ================= GET APPLICATION ID =================

const params =
    new URLSearchParams(window.location.search);

const applicationId =
    params.get("id");


if (!applicationId) {

    documentsContainer.innerHTML =
        "<p>Invalid application.</p>";

} else {

    loadDocuments();

}


// ================= LOAD DOCUMENTS =================

async function loadDocuments() {

    try {

        console.log(
            "Loading documents for application:",
            applicationId
        );


        const response =
            await fetch(
                `http://localhost:8080/documents/application/${applicationId}`,
                {
                    credentials: "include"
                }
            );


        console.log(
            "Document response:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load documents"
            );

        }


        const documents =
            await response.json();


        console.log(
            "Documents:",
            documents
        );


        documentsContainer.innerHTML = "";


        if (documents.length === 0) {

            documentsContainer.innerHTML = `

                <p>
                    No documents uploaded.
                </p>

            `;

            return;
        }


        documents.forEach(function(doc) {

            const status =
                doc.verificationStatus || "PENDING";


            const card =
                document.createElement("div");


            card.className =
                "document-card";


            card.innerHTML = `

                <div class="document-name">

                    <span class="document-icon">
                        📄
                    </span>

                    <div>

                        <strong>
                            ${doc.documentType}
                        </strong>

                        <small>
                            ${doc.documentName}
                        </small>

                        <br>

                        <span class="
                            verification-status
                            ${status.toLowerCase()}
                        ">

                            ${status}

                        </span>

                    </div>

                </div>


                <div class="document-actions">

                    <button
                        class="view-pdf-btn"
                        onclick="viewPDF(${doc.id})">

                        View PDF

                    </button>

                </div>

            `;


            documentsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Document loading error:",
            error
        );


        documentsContainer.innerHTML = `

            <p>
                Unable to load documents.
            </p>

        `;

    }

}


// ================= APPLICATION DECISION =================

const approveApplicationBtn =
    document.getElementById("approveApplicationBtn");

const rejectApplicationBtn =
    document.getElementById("rejectApplicationBtn");

const confirmRejectBtn =
    document.getElementById("confirmRejectBtn");

const cancelRejectBtn =
    document.getElementById("cancelRejectBtn");

const rejectionSection =
    document.getElementById("rejectionSection");

const rejectionReason =
    document.getElementById("rejectionReason");

const otherReasonSection =
    document.getElementById("otherReasonSection");

const otherReason =
    document.getElementById("otherReason");


// ================= APPROVE =================

approveApplicationBtn.addEventListener(
    "click",
    async function () {

        try {

            const response =
                await fetch(
                    `http://localhost:8080/applications/${applicationId}/approve`,
                    {
                        method: "PUT",
                        credentials: "include"
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                alert(
                    errorText ||
                    "Unable to approve application."
                );

                return;
            }


            await response.json();


            alert(
                "Application approved successfully."
            );


            window.location.href =
                "officer-dashboard.html";

        }


        catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ================= SHOW REJECTION FORM =================

rejectApplicationBtn.addEventListener(
    "click",
    function () {

        rejectionSection.style.display =
            "block";

    }
);


// ================= OTHER REASON =================

rejectionReason.addEventListener(
    "change",
    function () {

        if (this.value === "Other") {

            otherReasonSection.style.display =
                "block";

        } else {

            otherReasonSection.style.display =
                "none";

            otherReason.value = "";

        }

    }
);


// ================= CANCEL REJECTION =================

cancelRejectBtn.addEventListener(
    "click",
    function () {

        rejectionSection.style.display =
            "none";

        rejectionReason.value = "";

        otherReason.value = "";

        otherReasonSection.style.display =
            "none";

    }
);


// ================= CONFIRM REJECTION =================

confirmRejectBtn.addEventListener(
    "click",
    async function () {

        let reason =
            rejectionReason.value;


        if (!reason) {

            alert(
                "Please select a rejection reason."
            );

            return;

        }


        if (reason === "Other") {

            reason =
                otherReason.value.trim();


            if (!reason) {

                alert(
                    "Please enter the rejection reason."
                );

                return;

            }

        }


        try {

            const response =
                await fetch(
                    `http://localhost:8080/applications/${applicationId}/reject?remarks=${encodeURIComponent(reason)}`,
                    {
                        method: "PUT",
                        credentials: "include"
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                alert(
                    errorText ||
                    "Unable to reject application."
                );

                return;
            }


            await response.json();


            alert(
                "Application rejected successfully."
            );


            window.location.href =
                "officer-dashboard.html";

        }


        catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ================= VIEW PDF =================

function viewPDF(documentId) {

    window.open(
        `http://localhost:8080/documents/${documentId}/file`,
        "_blank"
    );

}


// ================= LOGOUT =================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("staffEmail");
            localStorage.removeItem("staffRole");

            window.location.href =
                "staff-login.html";

        }
    );

}