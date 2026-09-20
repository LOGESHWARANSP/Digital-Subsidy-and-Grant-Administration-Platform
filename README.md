# Digital Subsidy & Grant Administration Platform

## Project Description

The Digital Subsidy & Grant Administration Platform is a web-based application that manages the complete subsidy lifecycle digitally.

It supports user registration, scheme applications, eligibility checking, field verification, district approval, bank verification, installment payments, and utilization proof verification.

## Technologies Used

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL
- HTML
- CSS
- JavaScript
- Maven

## Main Modules

### User Module
- User registration and login
- View available schemes
- Check scheme eligibility
- Apply for schemes
- Upload required documents
- Add bank details
- Track application status
- View installment payments
- Upload utilization proof

### Field Officer Module
- View assigned applications
- Verify applications at the field level
- Approve or reject field verification

### District Officer Module
- Review field-verified applications
- Approve or reject applications at the district level

### Finance Officer Module
- Verify bank details
- Process installment payments
- Verify utilization proof
- Unlock subsequent installments

### Admin Module
- Manage schemes
- Manage users
- View applications
- Manage regional allocations
- View bank details
- Manage payments

## Application Workflow

1. User registers and logs in.
2. User views available schemes.
3. User checks eligibility and applies for a scheme.
4. User uploads the required documents.
5. Field Officer verifies the application.
6. District Officer reviews and approves the application.
7. User adds bank details.
8. Finance Officer verifies the bank details.
9. The installment plan becomes available.
10. Finance Officer processes the first installment payment.
11. User uploads utilization proof.
12. Finance Officer verifies the utilization proof.
13. The next installment is unlocked.
14. The process continues for subsequent installments.

## Database Setup

### Prerequisites

Install the following software:

- Java JDK
- MySQL
- Maven
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/LOGESHWARANSP/Digital-Subsidy-and-Grant-Administration-Platform.git
```

Navigate into the project folder:

```bash
cd Digital-Subsidy-and-Grant-Administration-Platform
```

### Step 2: Create the MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE subsidy;
```

Select the database:

```sql
USE subsidy;
```

### Step 3: Import the SQL File

Make sure the `subsidy.sql` file is available in the project folder.

Run the following command in Command Prompt or Terminal:

```bash
mysql -u root -p subsidy < subsidy.sql
```

Enter your own MySQL password when prompted.

The SQL file contains the database structure and available data, including regional allocation records if they were included during export.

### Step 4: Configure Database Connection

Open:

```text
src/main/resources/application.properties
```

Update the database configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/subsidy
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.

Do not upload real passwords or other sensitive credentials to GitHub.

### Step 5: Configure Email Service

If email functionality is required, configure your own email credentials securely.

Do not commit actual email passwords or app passwords to GitHub.

### Step 6: Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

Alternatively, run the main Spring Boot application class from your IDE.

### Step 7: Access the Application

The backend normally runs at:

```text
http://localhost:8080
```

Open the frontend HTML pages using your configured frontend server.

## Regional Allocation

Regional allocation data is stored in the `regional_allocations` table.

To check the number of records:

```sql
SELECT COUNT(*) FROM regional_allocations;
```

To view the records:

```sql
SELECT * FROM regional_allocations;
```

If the SQL file contains regional allocation records, importing it will add those records to the local database.

## Important Notes

- Each user must configure their own MySQL credentials.
- The database name must be `subsidy`.
- The `subsidy.sql` file must be imported before running the application.
- Email credentials must not be shared publicly.
- Each team member must test the complete workflow before uploading their project to GitHub.