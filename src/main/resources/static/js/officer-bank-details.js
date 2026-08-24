const bankDetailsBody =
    document.getElementById(
        "bankDetailsBody"
    );


async function loadBankDetails() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/bank-details",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load bank details"
            );

        }


        const bankDetailsList =
            await response.json();


        bankDetailsBody.innerHTML = "";


        if (bankDetailsList.length === 0) {

            bankDetailsBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No bank details submitted yet.
                    </td>
                </tr>
            `;

            return;
        }


        bankDetailsList.forEach(
            function (bank) {

                const row =
                    document.createElement("tr");


                let actionHTML = "";


                if (
                    bank.verificationStatus ===
                    "PENDING"
                ) {

                    actionHTML = `

                        <button
                            class="verify-btn"
                            data-id="${bank.id}">

                            Verify

                        </button>

                        <button
                            class="reject-btn"
                            data-id="${bank.id}">

                            Reject

                        </button>

                    `;
                } else {

                    actionHTML =
                        "No action";
                }


                row.innerHTML = `

                    <td>
                        ${bank.application.id}
                    </td>

                    <td>
                        ${bank.accountHolderName}
                    </td>

                    <td>
                        ${bank.bankName}
                    </td>

                    <td>
                        ******${bank.accountNumber.slice(-4)}
                    </td>

                    <td>
                        ${bank.ifscCode}
                    </td>

                    <td class="status-${bank.verificationStatus.toLowerCase()}">

                        ${bank.verificationStatus}

                    </td>

                    <td>

                        ${actionHTML}

                    </td>

                `;


                bankDetailsBody.appendChild(row);

            }
        );


        // VERIFY BUTTONS

        document
            .querySelectorAll(
                ".verify-btn"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            await verifyBank(
                                this.dataset.id
                            );

                        }
                    );

                }
            );


        // REJECT BUTTONS

        document
            .querySelectorAll(
                ".reject-btn"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            const reason =
                                prompt(
                                    "Enter rejection reason:"
                                );


                            if (!reason) {

                                return;

                            }


                            await rejectBank(
                                this.dataset.id,
                                reason
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(error);


        bankDetailsBody.innerHTML = `

            <tr>

                <td colspan="7">

                    Unable to load bank details.

                </td>

            </tr>

        `;
    }

}


async function verifyBank(id) {

    try {

        const response =
            await fetch(
                "http://localhost:8080/bank-details/"
                + id
                + "/verify",
                {
                    method: "PUT",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to verify bank details"
            );

            return;
        }


        alert(
            "Bank details verified successfully"
        );


        loadBankDetails();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server"
        );

    }

}

async function rejectBank(id) {

    try {

        const response =
            await fetch(
                "http://localhost:8080/bank-details/"
                + id
                + "/reject",
                {
                    method: "PUT",
                    credentials: "include"
                }
            );

        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to reject bank details"
            );

            return;
        }

        alert("Bank details rejected");

        loadBankDetails();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");

    }

}

// Load when page opens

loadBankDetails();