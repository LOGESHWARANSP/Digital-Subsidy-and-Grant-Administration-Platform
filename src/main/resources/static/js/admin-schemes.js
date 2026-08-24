const API_URL =
    "http://localhost:8080/schemes";

const tableBody =
    document.getElementById("schemesTableBody");

const schemeFormCard =
    document.getElementById("schemeFormCard");

const schemeForm =
    document.getElementById("schemeForm");

const showFormBtn =
    document.getElementById("showFormBtn");

const cancelFormBtn =
    document.getElementById("cancelFormBtn");

const formTitle =
    document.getElementById("formTitle");

let editingSchemeId = null;


// ================= CHECK ADMIN =================

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


if (!staffEmail || staffRole !== "ADMIN") {

    window.location.href =
        "staff-login.html";

}


// ================= LOAD SCHEMES =================

async function loadSchemes() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load schemes"
            );

        }

        const schemes =
            await response.json();

        tableBody.innerHTML = "";


        if (schemes.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No schemes found.
                    </td>
                </tr>
            `;

            return;
        }


        schemes.forEach(function(scheme) {

            const statusClass =
                scheme.status === "ACTIVE"
                    ? "status-active"
                    : "status-inactive";


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${scheme.id}
                </td>

                <td>
                    ${scheme.schemeName}
                </td>

                <td>
                    ₹${scheme.maximumAmount}
                </td>

                <td>
                    ${scheme.minimumAge}
                    -
                    ${scheme.maximumAge}
                </td>
                <td>
    <span class="${statusClass}">
        ${scheme.status || "ACTIVE"}
    </span>
</td>

                <td class="scheme-actions">

    <button
        class="action-btn edit-scheme-btn"
        onclick="editScheme(${scheme.id})">

        ✏ Edit

    </button>

    <button
        class="action-btn delete-scheme-btn"
        onclick="deleteScheme(${scheme.id})">

        🗑 Delete

    </button>

</td>

            `;


            tableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load schemes.
                </td>
            </tr>
        `;

    }

}


// ================= SHOW ADD FORM =================

showFormBtn.addEventListener(
    "click",
    function() {

        editingSchemeId = null;

        schemeForm.reset();

        formTitle.textContent =
            "Add New Scheme";

        schemeFormCard.style.display =
            "block";

    }
);


// ================= CANCEL FORM =================

cancelFormBtn.addEventListener(
    "click",
    function() {

        schemeFormCard.style.display =
            "none";

        schemeForm.reset();

        editingSchemeId = null;

    }
);


// ================= SAVE SCHEME =================

schemeForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const scheme = {

            schemeName:
            document.getElementById(
                "schemeName"
            ).value,

            description:
            document.getElementById(
                "description"
            ).value,

            maximumAmount:
                Number(
                    document.getElementById(
                        "maximumAmount"
                    ).value
                ),

            minimumAge:
                Number(
                    document.getElementById(
                        "minimumAge"
                    ).value
                ),

            maximumAge:
                Number(
                    document.getElementById(
                        "maximumAge"
                    ).value
                ),

            maximumIncome:
                Number(
                    document.getElementById(
                        "maximumIncome"
                    ).value
                ),

            eligibleOccupation:
            document.getElementById(
                "eligibleOccupation"
            ).value,
            eligibleGender:
            document.getElementById(
                "eligibleGender"
            ).value,
            requiredDocuments:
            document.getElementById(
                "requiredDocuments"
            ).value,

            startDate:
            document.getElementById(
                "startDate"
            ).value,

            endDate:
            document.getElementById(
                "endDate"
            ).value,
            status:
            document.getElementById("status").value,

            benefits:
            document.getElementById(
                "benefits"
            ).value
        };


        let url = API_URL;
        let method = "POST";


        // EDIT MODE

        if (editingSchemeId !== null) {

            url =
                `${API_URL}/${editingSchemeId}`;

            method = "PUT";

        }


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: method,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(scheme)
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to save scheme"
                );

            }


            alert(
                editingSchemeId !== null
                    ? "Scheme updated successfully."
                    : "Scheme created successfully."
            );


            schemeForm.reset();

            schemeFormCard.style.display =
                "none";

            editingSchemeId = null;


            loadSchemes();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to save scheme."
            );

        }

    }
);


// ================= EDIT SCHEME =================

async function editScheme(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Scheme not found"
            );

        }


        const scheme =
            await response.json();


        editingSchemeId = id;


        formTitle.textContent =
            "Edit Scheme";


        schemeFormCard.style.display =
            "block";


        document.getElementById(
            "schemeName"
        ).value =
            scheme.schemeName || "";


        document.getElementById(
            "description"
        ).value =
            scheme.description || "";


        document.getElementById(
            "maximumAmount"
        ).value =
            scheme.maximumAmount || "";


        document.getElementById(
            "minimumAge"
        ).value =
            scheme.minimumAge || "";


        document.getElementById(
            "maximumAge"
        ).value =
            scheme.maximumAge || "";


        document.getElementById(
            "maximumIncome"
        ).value =
            scheme.maximumIncome || "";


        document.getElementById(
            "eligibleOccupation"
        ).value =
            scheme.eligibleOccupation || "";

        document.getElementById(
            "eligibleGender"
        ).value =
            scheme.eligibleGender || "ALL";

        document.getElementById(
            "requiredDocuments"
        ).value =
            scheme.requiredDocuments || "";


        document.getElementById(
            "startDate"
        ).value =
            scheme.startDate || "";


        document.getElementById(
            "endDate"
        ).value =
            scheme.endDate || "";
        document.getElementById("benefits").value =
            scheme.benefits || "";
        document.getElementById("status").value =
            scheme.status || "ACTIVE";
        document.getElementById("eligibleGender").value =
            scheme.eligibleGender || "ALL";



    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load scheme details."
        );

    }

}


// ================= DELETE SCHEME =================

async function deleteScheme(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this scheme?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete scheme"
            );

        }


        alert(
            "Scheme deleted successfully."
        );


        loadSchemes();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete scheme."
        );

    }

}


// ================= PROFILE =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");


document.getElementById(
    "staffEmail"
).textContent =
    staffEmail;


document.getElementById(
    "dropdownStaffEmail"
).textContent =
    staffEmail;


profileButton.addEventListener(
    "click",
    function() {

        profileDropdown.classList.toggle(
            "show"
        );

    }
);


// ================= LOGOUT =================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    function() {

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

loadSchemes();