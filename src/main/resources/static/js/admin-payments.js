const paymentsContainer =
    document.getElementById("paymentsContainer");

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


// ================= ADMIN LOGIN CHECK =================

if (!staffEmail || staffRole !== "ADMIN") {

    window.location.href =
        "staff-login.html";

}



// ================= LOAD PAYMENTS =================

async function loadPayments() {

    try {

        const response =
            await fetch(
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


        paymentsContainer.innerHTML = "";


        let paymentFound = false;


        // Check approved applications

        for (const application of applications) {

            if (
                application.status !== "APPROVED"
            ) {

                continue;

            }


            // ================= GET BANK DETAILS =================

            try {

                const bankResponse =
                    await fetch(
                        "http://localhost:8080/bank-details/application/"
                        + application.id,
                        {
                            credentials: "include"
                        }
                    );





                let bankDetails = null;

                if (bankResponse.ok) {

                    const bankText =
                        await bankResponse.text();

                    if (bankText.trim() !== "") {

                        bankDetails =
                            JSON.parse(bankText);

                    }

                }

                // Only VERIFIED bank details

                if (
                    bankDetails?.verificationStatus !==
                    "VERIFIED"
                ) {

                    continue;

                }


                paymentFound = true;


                // ================= APPLICATION DATA =================

                const schemeName =
                    application.scheme
                        ? application.scheme.schemeName
                        : "Unknown Scheme";


                const applicant =
                    application.user
                        ? application.user.emailId
                        : "Unknown User";


                // Mask account number

                const accountNumber =
                    bankDetails.accountNumber;


                const maskedAccount =
                    "XXXXXX" +
                    accountNumber.slice(-4);
                const amount =
                    application.scheme.maximumAmount;


                // ================= CREATE CARD =================

                const card =
                    document.createElement("div");


                card.className =
                    "payment-card";


                card.innerHTML = `

                    <div class="payment-card-header">

                        <div>

                            <p class="hero-tag">

                                APPLICATION #${application.id}

                            </p>


                            <h3>

                                ${schemeName}

                            </h3>


                            <p>

                                Applicant:
                                ${applicant}

                            </p>

                        </div>


                        <span class="payment-status">

                            BANK VERIFIED

                        </span>

                    </div>


                    <div class="payment-details">


                        <div class="payment-detail">

                            <small>
                                Bank Name
                            </small>

                            <strong>
                                ${bankDetails.bankName}
                            </strong>

                        </div>


                        <div class="payment-detail">

                            <small>
                                Account Number
                            </small>

                            <strong>
                                ${maskedAccount}
                            </strong>

                        </div>


                        <div class="payment-detail">

                            <small>
                                IFSC Code
                            </small>

                            <strong>
                                ${bankDetails.ifscCode}
                            </strong>

                        </div>


                    </div>


                    <div class="payment-details">


                         <div class="payment-detail">
                            <small>Payment Amount</small>
                            <strong>
                                ₹${amount}
                            </strong>
                        </div>

                       


                    </div>


                    <div class="payment-action">

                        <button
                            class="process-payment-btn"
                            data-id="${application.id}">

                            💳 Process Payment

                        </button>

                    </div>

                `;


                paymentsContainer.appendChild(card);


                // ================= PAYMENT BUTTON =================

                const paymentButton =
                    card.querySelector(
                        ".process-payment-btn"
                    );


                paymentButton.addEventListener(
                    "click",
                    async function () {


                        const applicationId =
                            this.dataset.id;


                        const amount =
                            application.scheme.maximumAmount;


                        // Validation

                        if (
                            !amount ||
                            Number(amount) <= 0
                        ) {

                            alert(
                                "Please enter a valid payment amount"
                            );

                            return;

                        }


                        const confirmed =
                            confirm(
                                "Process payment of ₹"
                                + amount
                                + "?"
                            );


                        if (!confirmed) {

                            return;

                        }


                        // Generate transaction reference

                        const transactionReference =
                            "TXN"
                            + Date.now();


                        const disbursement = {

                            application: {
                                id:
                                    Number(
                                        applicationId
                                    )
                            },

                            amount:
                                Number(amount),

                            disbursementDate:
                                new Date()
                                    .toISOString()
                                    .split("T")[0],

                            paymentStatus:
                                "PAID",

                            transactionReference:
                            transactionReference

                        };


                        try {

                            const paymentResponse =
                                await fetch(
                                    "http://localhost:8080/disbursements",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        credentials:
                                            "include",

                                        body:
                                            JSON.stringify(
                                                disbursement
                                            )

                                    }
                                );


                            if (
                                !paymentResponse.ok
                            ) {

                                const error =
                                    await paymentResponse
                                        .text();


                                alert(
                                    error ||
                                    "Payment processing failed"
                                );

                                return;

                            }


                            alert(
                                "Payment processed successfully!"
                            );


                            // Reload page

                            loadPayments();


                        } catch (error) {

                            console.error(error);


                            alert(
                                "Unable to connect to server"
                            );

                        }

                    }
                );


            } catch (error) {

                console.error(
                    "Unable to load bank details:",
                    error
                );

            }

        }


        // ================= NO PAYMENTS =================

        if (!paymentFound) {

            paymentsContainer.innerHTML = `

                <div class="empty-state">

                    <div>
                        💳
                    </div>

                    <h3>
                        No payments pending
                    </h3>

                    <p>
                        There are no applications
                        with verified bank details.
                    </p>

                </div>

            `;

        }


    } catch (error) {

        console.error(error);


        paymentsContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load payments
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ================= PROFILE =================

const staffEmailElement =
    document.getElementById("staffEmail");

const dropdownStaffEmail =
    document.getElementById(
        "dropdownStaffEmail"
    );


if (staffEmailElement) {

    staffEmailElement.textContent =
        staffEmail;

}


if (dropdownStaffEmail) {

    dropdownStaffEmail.textContent =
        staffEmail;

}


// ================= PROFILE DROPDOWN =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");


if (profileButton && profileDropdown) {

    profileButton.addEventListener(
        "click",
        function () {

            profileDropdown.classList.toggle(
                "show"
            );

        }
    );

}


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "staffEmail"
            );

            localStorage.removeItem(
                "staffRole"
            );

            window.location.href =
                "staff-login.html";

        }
    );


// ================= START =================

loadPayments();