const API = "http://localhost:8080";

let selectedSchemeId = "ALL";

// ================= USER LOGIN =================

const userEmail = localStorage.getItem("userEmail");

if (!userEmail) {

    window.location.href = "login.html";

}


// ================= PROFILE =================

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


// ================= PROFILE DROPDOWN =================

const profileButton =
    document.getElementById("profileButton");

const profileDropdown =
    document.getElementById("profileDropdown");


if (profileButton && profileDropdown) {

    profileButton.addEventListener(
        "click",
        function () {

            profileDropdown.classList.toggle("show");

        }
    );

}


// ================= MY PROFILE =================

const myProfileBtn =
    document.getElementById("myProfileBtn");


if (myProfileBtn) {

    myProfileBtn.addEventListener(
        "click",
        function () {

            window.location.href = "profile.html";

        }
    );

}


// ================= LOGOUT =================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("userEmail");

            window.location.href = "login.html";

        }
    );

}

// ================= LOAD ANALYTICS =================

async function loadAnalytics() {

    try {

        const [
            applicationsResponse,
            disbursementsResponse,
            allocationsResponse,
            milestonesResponse
        ] = await Promise.all([

            fetch(`${API}/applications`, {
                credentials: "include"
            }),

            fetch(`${API}/disbursements`, {
                credentials: "include"
            }),

            fetch(`${API}/regional-allocations`, {
                credentials: "include"
            }),

            fetch(`${API}/compliance-milestones`, {
                credentials: "include"
            })

        ]);


        if (
            !applicationsResponse.ok ||
            !disbursementsResponse.ok ||
            !allocationsResponse.ok ||
            !milestonesResponse.ok
        ) {
            throw new Error("Unable to load analytics data");
        }


        const applications =
            await applicationsResponse.json();

        const disbursements =
            await disbursementsResponse.json();

        const allocations =
            await allocationsResponse.json();

        const milestones =
            await milestonesResponse.json();


        populateSchemeFilter(allocations);


        calculateOverall(
            applications,
            disbursements,
            allocations
        );


        calculateApplicationStatus(applications);


        calculateStateWise(
            applications,
            disbursements,
            allocations
        );


        calculateSchemeWise(
            applications,
            disbursements,
            allocations
        );


        calculateDisbursementSummary(
            disbursements,
            applications
        );


        calculateCompliance(
            milestones
        );


        calculateCategory(
            applications
        );


        updateLastUpdated();

    } catch (error) {

        console.error(
            "Analytics loading error:",
            error
        );

    }

}


// ================= SCHEME FILTER =================

function populateSchemeFilter(allocations) {

    const select =
        document.getElementById("schemeFilter");

    if (!select) {
        return;
    }


    if (select.options.length > 1) {
        return;
    }


    const schemes = new Map();


    allocations.forEach(allocation => {

        if (
            allocation.scheme &&
            allocation.scheme.id
        ) {

            schemes.set(
                allocation.scheme.id,
                allocation.scheme.schemeName
            );

        }

    });


    schemes.forEach((schemeName, schemeId) => {

        const option =
            document.createElement("option");

        option.value = schemeId;

        option.textContent = schemeName;

        select.appendChild(option);

    });


    select.addEventListener(
        "change",
        function () {

            selectedSchemeId = this.value;

            loadAnalytics();

        }
    );

}


// ================= OVERALL =================

function calculateOverall(
    applications,
    disbursements,
    allocations
) {

    const states = new Set();


    allocations.forEach(allocation => {

        if (allocation.region) {
            states.add(allocation.region);
        }

    });


    /*
     * Existing project logic:
     * ₹10 lakhs allocated per state
     */
    const totalBudget = allocations
        .filter(allocation =>
            selectedSchemeId === "ALL" ||
            String(allocation.scheme?.id) === String(selectedSchemeId)
        )
        .reduce(
            (sum, allocation) =>
                sum + Number(allocation.allocatedBudget || 0),
            0
        );


    let totalDisbursed = 0;


    disbursements.forEach(disbursement => {

        if (
            disbursement.paymentStatus === "PAID"
        ) {

            if (
                selectedSchemeId !== "ALL" &&
                String(disbursement.application?.scheme?.id)
                !== String(selectedSchemeId)
            ) {
                return;
            }

            totalDisbursed +=
                Number(disbursement.amount || 0);

        }

    });


    const remainingBudget =
        Math.max(
            totalBudget - totalDisbursed,
            0
        );


    const percentage =
        totalBudget > 0
            ? (totalDisbursed / totalBudget) * 100
            : 0;


    document.getElementById(
        "totalBudget"
    ).textContent =
        formatCurrency(totalBudget);


    document.getElementById(
        "totalDisbursed"
    ).textContent =
        formatCurrency(totalDisbursed);


    document.getElementById(
        "remainingBudget"
    ).textContent =
        formatCurrency(remainingBudget);


    document.getElementById(
        "totalApplications"
    ).textContent =
        applications.length;


    document.getElementById(
        "budgetPercent"
    ).textContent =
        percentage.toFixed(1) + "%";


    document.getElementById(
        "budgetPercentage"
    ).textContent =
        percentage.toFixed(1) + "%";


    document.getElementById(
        "disbursedPercentage"
    ).textContent =
        percentage.toFixed(1) +
        "% of budget";


    document.getElementById(
        "remainingPercentage"
    ).textContent =
        (100 - percentage).toFixed(1) +
        "% remaining";


    document.getElementById(
        "legendDisbursed"
    ).textContent =
        formatCurrency(totalDisbursed);


    document.getElementById(
        "legendRemaining"
    ).textContent =
        formatCurrency(remainingBudget);


    document.getElementById(
        "budgetAllocated"
    ).textContent =
        formatCurrency(totalBudget);


    document.getElementById(
        "budgetUsed"
    ).textContent =
        formatCurrency(totalDisbursed);


    document.getElementById(
        "budgetRemaining"
    ).textContent =
        formatCurrency(remainingBudget);


    document.getElementById(
        "usedBar"
    ).style.width =
        Math.min(percentage, 100) + "%";


    document.getElementById(
        "remainingBar"
    ).style.width =
        Math.min(
            100 - percentage,
            100
        ) + "%";


    updateBudgetDonut(percentage);

}


// ================= BUDGET DONUT =================

function updateBudgetDonut(percentage) {

    const donut =
        document.getElementById("budgetDonut");

    const degree =
        Math.min(percentage, 100) * 3.6;


    donut.style.background =
        `conic-gradient(
            #2563eb 0deg ${degree}deg,
            #e2e8f0 ${degree}deg 360deg
        )`;

}


// ================= APPLICATION STATUS =================

function calculateApplicationStatus(applications) {

    let approved = 0;
    let pending = 0;
    let review = 0;
    let rejected = 0;

    applications.forEach(application => {

        // Scheme filter
        if (
            selectedSchemeId !== "ALL" &&
            String(application.scheme?.id) !==
            String(selectedSchemeId)
        ) {
            return;
        }

        const status = application.status || "";

        // ================= REJECTED =================

        if (
            status === "REJECTED" ||
            status.includes("REJECTED")
        ) {
            rejected++;
        }

        // ================= APPROVED / COMPLETED =================

        else if (
            status === "APPROVED" ||
            status === "INSTALLMENT_1_PAID" ||
            status === "UTILIZATION_PROOF_1_SUBMITTED" ||
            status === "UTILIZATION_PROOF_1_VERIFIED" ||
            status === "INSTALLMENT_2_PAID" ||
            status === "UTILIZATION_PROOF_2_SUBMITTED" ||
            status === "UTILIZATION_PROOF_2_VERIFIED" ||
            status === "DISBURSED"
        ) {
            approved++;
        }

        // ================= UNDER REVIEW =================

        else if (
            status === "FIELD_VERIFIED" ||
            status === "DISTRICT_APPROVED" ||
            status === "BANK_DETAILS_SUBMITTED" ||
            status === "BANK_DETAILS_VERIFIED"
        ) {
            review++;
        }

        // ================= PENDING =================

        else {
            pending++;
        }

    });


    const total =
        approved +
        pending +
        review +
        rejected;


    // ================= UPDATE UI =================

    document.getElementById(
        "statusTotal"
    ).textContent = total;

    document.getElementById(
        "approvedCount"
    ).textContent = approved;

    document.getElementById(
        "pendingCount"
    ).textContent = pending;

    document.getElementById(
        "reviewCount"
    ).textContent = review;

    document.getElementById(
        "rejectedCount"
    ).textContent = rejected;


    updateStatusDonut(
        approved,
        pending,
        review,
        rejected,
        total
    );

}

// ================= STATUS DONUT =================

function updateStatusDonut(
    approved,
    pending,
    review,
    rejected,
    total
) {

    const donut =
        document.getElementById("statusDonut");


    if (total === 0) {

        donut.style.background =
            "#e2e8f0";

        return;

    }


    const approvedDeg =
        approved / total * 360;

    const pendingDeg =
        pending / total * 360;

    const reviewDeg =
        review / total * 360;


    const second =
        approvedDeg +
        pendingDeg;

    const third =
        second +
        reviewDeg;


    donut.style.background =
        `conic-gradient(
            #22c55e 0deg ${approvedDeg}deg,
            #2563eb ${approvedDeg}deg ${second}deg,
            #fbbf24 ${second}deg ${third}deg,
            #ef4444 ${third}deg 360deg
        )`;

}


// ================= STATE =================
// ================= STATE =================

let showAllStates = false;
let currentStateData = {};


function calculateStateWise(
    applications,
    disbursements,
    allocations
) {

    const stateData = {};


    allocations.forEach(allocation => {

        const state =
            allocation.region || "Unknown";


        if (!stateData[state]) {

            stateData[state] = {
                allocated: 0,
                disbursed: 0
            };

        }


        stateData[state].allocated +=
            Number(allocation.allocatedBudget || 0);

    });


    disbursements.forEach(disbursement => {

        if (
            disbursement.paymentStatus !== "PAID"
        ) {
            return;
        }


        const application =
            disbursement.application;


        if (
            !application ||
            !application.user
        ) {
            return;
        }


        if (
            selectedSchemeId !== "ALL" &&
            String(application.scheme?.id)
            !== String(selectedSchemeId)
        ) {
            return;
        }


        const state =
            application.user.location ||
            "Unknown";


        if (!stateData[state]) {

            stateData[state] = {
                allocated: 1000000,
                disbursed: 0
            };

        }


        stateData[state].disbursed +=
            Number(disbursement.amount || 0);

    });


    currentStateData = stateData;

    renderStateTable();

}


// ================= RENDER STATE TABLE =================

function renderStateTable() {

    const tbody =
        document.getElementById(
            "stateAnalyticsBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    const entries =
        Object.entries(currentStateData);


    const visibleEntries =
        showAllStates
            ? entries
            : entries.slice(0, 5);


    visibleEntries.forEach(
        ([state, data]) => {

            const remaining =
                Math.max(
                    data.allocated -
                    data.disbursed,
                    0
                );


            const percentage =
                data.allocated > 0
                    ? (
                    data.disbursed /
                    data.allocated
                ) * 100
                    : 0;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td class="state-name">
                    ${state}
                </td>

                <td>
                    ${formatCurrency(
                data.allocated
            )}
                </td>

                <td>
                    ${formatCurrency(
                data.disbursed
            )}
                </td>

                <td>
                    ${formatCurrency(
                remaining
            )}
                </td>

                <td>

                    <div class="progress-small">

                        <div style="
                            width:${Math.min(
                percentage,
                100
            )}%;
                        "></div>

                    </div>

                    ${percentage.toFixed(0)}%

                </td>

            `;


            tbody.appendChild(row);

        }
    );


    const stateButton =
        document.getElementById(
            "stateShowMoreBtn"
        );


    if (stateButton) {

        if (entries.length > 5) {

            stateButton.style.display =
                "block";

            stateButton.textContent =
                showAllStates
                    ? "Show Less"
                    : "Show More";

        }
        else {

            stateButton.style.display =
                "none";

        }

    }

}


// ================= SHOW MORE / LESS =================

const stateShowMoreBtn =
    document.getElementById(
        "stateShowMoreBtn"
    );


if (stateShowMoreBtn) {

    stateShowMoreBtn.addEventListener(
        "click",
        function () {

            showAllStates =
                !showAllStates;

            renderStateTable();

        }
    );

}





// ================= SCHEME =================
// ================= SCHEME =================

let showAllSchemes = false;
let currentSchemeData = {};

function calculateSchemeWise(
    applications,
    disbursements,
    allocations
) {
    const schemeData = {};

    // ================= ALLOCATION =================
    allocations.forEach(allocation => {

        if (
            selectedSchemeId !== "ALL" &&
            String(allocation.scheme?.id) !==
            String(selectedSchemeId)
        ) {
            return;
        }

        const schemeName =
            allocation.scheme?.schemeName ||
            allocation.schemeName ||
            "Unknown Scheme";

        if (!schemeData[schemeName]) {
            schemeData[schemeName] = {
                allocated: 0,
                disbursed: 0
            };
        }

        schemeData[schemeName].allocated +=
            Number(allocation.allocatedBudget || 0);
    });

    // ================= DISBURSEMENT =================
    disbursements.forEach(disbursement => {

        if (disbursement.paymentStatus !== "PAID") {
            return;
        }

        const application =
            disbursement.application;

        if (!application || !application.scheme) {
            return;
        }

        if (
            selectedSchemeId !== "ALL" &&
            String(application.scheme.id) !==
            String(selectedSchemeId)
        ) {
            return;
        }

        const schemeName =
            application.scheme.schemeName ||
            "Unknown Scheme";

        if (!schemeData[schemeName]) {
            schemeData[schemeName] = {
                allocated: 0,
                disbursed: 0
            };
        }

        schemeData[schemeName].disbursed +=
            Number(disbursement.amount || 0);
    });

    currentSchemeData = schemeData;

    renderSchemeTable();
}
function renderSchemeTable() {

    const container =
        document.getElementById("schemeAnalytics");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const entries =
        Object.entries(currentSchemeData);

    const visibleEntries =
        showAllSchemes
            ? entries
            : entries.slice(0, 5);

    visibleEntries.forEach(([scheme, data]) => {

        const percentage =
            data.allocated > 0
                ? (data.disbursed / data.allocated) * 100
                : 0;

        const row =
            document.createElement("div");

        row.className = "scheme-row";

        row.innerHTML = `
            <div class="scheme-top">
                <span>${scheme}</span>

                <strong>
                    ${formatCurrency(data.disbursed)}
                </strong>
            </div>

            <div class="scheme-progress">
                <div style="
                    width:${Math.min(percentage, 100)}%;
                "></div>
            </div>

            <small>
                ${percentage.toFixed(1)}% utilized
            </small>
        `;

        container.appendChild(row);
    });

    if (entries.length === 0) {

        container.innerHTML = `
            <div class="scheme-row">
                <span>No disbursement data</span>
            </div>
        `;
    }

    const button =
        document.getElementById("schemeShowMoreBtn");

    if (!button) {
        return;
    }

    if (entries.length > 5) {

        button.style.display = "block";

        button.textContent =
            showAllSchemes
                ? "Show Less"
                : "Show More";

    } else {

        button.style.display = "none";
    }
}
// Scheme Show More / Show Less
document.addEventListener("click", function (event) {

    const button =
        event.target.closest("#schemeShowMoreBtn");

    if (!button) {
        return;
    }

    showAllSchemes = !showAllSchemes;

    renderSchemeTable();

});

// ================= DISBURSEMENT SUMMARY =================

function calculateDisbursementSummary(
    disbursements,
    applications
) {
    let paid = 0;
    let amount = 0;
    let pending = 0;

    // ================= PAID DISBURSEMENTS =================

    disbursements.forEach(disbursement => {

        if (disbursement.paymentStatus === "PAID") {

            paid++;

            amount += Number(
                disbursement.amount || 0
            );

        } else {

            // Pending payment records
            pending++;

        }

    });


    // ================= PENDING INSTALLMENTS =================

    applications.forEach(application => {

        // Apply scheme filter
        if (
            selectedSchemeId !== "ALL" &&
            String(application.scheme?.id) !==
            String(selectedSchemeId)
        ) {
            return;
        }

        const installmentPlans =
            application.installmentPlans || [];

        installmentPlans.forEach(installment => {

            /*
             * AVAILABLE means payment is ready
             * LOCKED means it is not yet available
             */

            if (
                installment.status === "AVAILABLE"
            ) {

                pending++;

            }

        });

    });


    // ================= UPDATE UI =================

    document.getElementById(
        "totalDisbursements"
    ).textContent =
        disbursements.length;


    document.getElementById(
        "paidInstallments"
    ).textContent =
        paid;


    document.getElementById(
        "paidAmount"
    ).textContent =
        formatCurrency(amount);


    document.getElementById(
        "pendingPayments"
    ).textContent =
        pending;

}


// ================= COMPLIANCE =================

function calculateCompliance(
    milestones
) {

    let pending = 0;
    let submitted = 0;
    let verified = 0;
    let rejected = 0;
    let overdue = 0;


    milestones.forEach(milestone => {

        const status =
            milestone.status;


        if (status === "PENDING") {
            pending++;
        }

        else if (status === "SUBMITTED") {
            submitted++;
        }

        else if (status === "COMPLETED") {
            verified++;
        }

        else if (status === "REJECTED") {
            rejected++;
        }

        else if (status === "OVERDUE") {
            overdue++;
        }

    });


    document.getElementById(
        "pendingMilestones"
    ).textContent = pending;


    document.getElementById(
        "verifiedMilestones"
    ).textContent = verified;


    document.getElementById(
        "rejectedMilestones"
    ).textContent = rejected;


    document.getElementById(
        "overdueMilestones"
    ).textContent = overdue;

}


// ================= CATEGORY =================
function calculateCategory(applications) {

    const categoryData = {
        OC: 0,
        BC: 0,
        MBC: 0,
        SC: 0,
        ST: 0,
    };

    applications.forEach(application => {

        if (!application.user) {
            return;
        }

        if (
            selectedSchemeId !== "ALL" &&
            String(application.scheme?.id) !== String(selectedSchemeId)
        ) {
            return;
        }

        const category =
            application.user.beneficiaryCategory || "Unknown";

        if (!categoryData[category]) {
            categoryData[category] = 0;
        }

        categoryData[category]++;
    });


    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);


    const canvas = document.getElementById("categoryChart");
    const ctx = canvas.getContext("2d");


    // Clear previous chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    const width = canvas.parentElement.clientWidth;
    const height = 220;

    canvas.width = width;
    canvas.height = height;


    if (labels.length === 0) {

        ctx.fillStyle = "#64748b";
        ctx.font = "14px Arial";

        ctx.fillText(
            "No application data",
            20,
            40
        );

        return;
    }


    console.log(categoryData);


    const maxValue = Math.max(...values, 1);


    // Chart spacing
    const paddingLeft = 55;
    const paddingRight = 25;
    const paddingTop = 20;
    const paddingBottom = 40;


    const chartWidth =
        width - paddingLeft - paddingRight;

    const chartHeight =
        height - paddingTop - paddingBottom;


    // Bar gap
    const barGap = 35;

    const barWidth =
        (chartWidth -
            barGap * (labels.length - 1))
        / labels.length;


    /*
     * -------------------------
     * Y AXIS + GRID
     * -------------------------
     */

    const steps = Math.max(maxValue, 4);


    for (let i = 0; i <= steps; i++) {

        const value =
            Math.round(
                (maxValue / steps) * i
            );

        const y =
            height -
            paddingBottom -
            (value / maxValue) * chartHeight;


        // Grid line
        ctx.beginPath();

        ctx.moveTo(
            paddingLeft,
            y
        );

        ctx.lineTo(
            width - paddingRight,
            y
        );

        ctx.strokeStyle = "#eef2f7";
        ctx.lineWidth = 1;

        ctx.stroke();


        // Y value
        ctx.fillStyle = "#64748b";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";

        ctx.fillText(
            value,
            paddingLeft - 10,
            y + 4
        );
    }


    /*
     * -------------------------
     * BARS
     * -------------------------
     */

    labels.forEach((label, index) => {

        const value = values[index];


        const barHeight =
            (value / maxValue) * chartHeight;


        const x =
            paddingLeft +
            index * (barWidth + barGap);


        const y =
            height -
            paddingBottom -
            barHeight;


        /*
         * Bar
         */

        ctx.fillStyle = "#2563eb";

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            barWidth,
            barHeight,
            6
        );

        ctx.fill();


        /*
         * Value
         */

        ctx.fillStyle = "#0f172a";

        ctx.font = "bold 13px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            value,
            x + barWidth / 2,
            Math.max(y - 8, 14)
        );


        /*
         * Category
         */

        ctx.fillStyle = "#475569";

        ctx.font = "bold 12px Arial";

        ctx.fillText(
            label,
            x + barWidth / 2,
            height - 15
        );

    });


    ctx.textAlign = "left";
}
function updateLastUpdated() {
    const element = document.getElementById("lastUpdated");

    if (element) {
        element.textContent =
            "Last updated: " +
            new Date().toLocaleString("en-IN");
    }
}
// ================= REPORT PDF =================

function downloadPDF() {

    const element =
        document.querySelector(".analytics-page");

    const options = {
        margin: 8,

        filename:
            "digital-subsidy-analytics.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 3,
            useCORS: true,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "landscape"
        },

        pagebreak: {
            mode: [
                "css",
                "legacy"
            ],
            avoid: [
                ".analytics-card",
                ".chart-container"
            ]
        }
    };

    html2pdf()
        .set(options)
        .from(element)
        .save();
}


// ================= REPORT EXCEL =================

function downloadExcel() {

    const table =
        document.getElementById(
            "stateAnalyticsBody"
        );


    let csv =
        "State,Allocated,Disbursed,Remaining,Utilization\n";


    const rows =
        table.querySelectorAll("tr");


    rows.forEach(row => {

        const columns =
            row.querySelectorAll("td");


        const data = [];


        columns.forEach(column => {

            data.push(
                column.innerText
                    .replace(/,/g, "")
                    .trim()
            );

        });


        csv +=
            data.join(",") +
            "\n";

    });


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "digital-subsidy-analytics.csv";

    link.click();


    URL.revokeObjectURL(url);

}


// ================= HELPERS =================

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString("en-IN");

}

// ================= BUTTONS =================

document.getElementById(
    "downloadPdfBtn"
).addEventListener(
    "click",
    downloadPDF
);


document.getElementById(
    "downloadExcelBtn"
).addEventListener(
    "click",
    downloadExcel
);




// ================= START =================

loadAnalytics();