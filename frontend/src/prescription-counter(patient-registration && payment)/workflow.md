# Front Desk Reception and Billing Workflow

## Overview
This document outlines the standard operating procedures for the front desk counter. It covers patient registration, appointment verification, doctor routing, patient account management, and payment processing.

---

## Workflow Steps

### 1. Patient Registration & Verification (Counter)
* **Action:** The patient arrives at the hospital/clinic reception counter.
* **Process:** * **Walk-in Patients:** The receptionist creates a new patient account or updates an existing one in the system.
    * **Online Registered Patients:** The patient provides their ID or booking reference. The receptionist verifies their online appointment details.

### 2. Patient Account Management
* **Action:** Maintaining up-to-date patient records.
* **Process:** The front desk ensures the patient's demographic details, contact information (email and phone number), and account status are accurate before proceeding.

### 3. Doctor Routing & Queueing
* **Action:** Directing the patient to the consultation.
* **Process:** Once verified, the patient is assigned a queue number or directly routed to the correct doctor's consultation room based on their specific booking time.

### 4. Payment Handling
* **Action:** Processing consultation or facility fees.
* **Process:** The counter staff calculates the total bill (consultation, lab fees, pharmacy, etc.) and processes the payment using the accepted payment methods (cash, card, or online payment gateways).

### 5. Receipt & Notification Delivery
* **Action:** Issuing the payment confirmation.
* **Process:** Once the payment is successfully processed, the system automatically generates a digital payment slip.
* **Output:** The receipt is sent directly to the patient's registered contact details via **Email** and **SMS**.

---

## Visual Workflow Diagram

```mermaid
graph TD
    A[Patient arrives at Counter] --> B{Check Registration Status};
    B -->|Walk-in Patient| C[Register Patient Account];
    B -->|Online Booking| D[Verify Online Registration];
    C --> E[Update/Manage Patient Account];
    D --> E;
    E --> F[Route to correct Doctor at booking time];
    F --> G[Doctor Consultation Completed];
    G --> H[Process Payments & Billing];
    H --> I{Send Digital Payment Slip};
    I -->|via Email| J[Email Receipt Delivered];
    I -->|via SMS| K[SMS Receipt Delivered];
    J --> L((Transaction Closed));
    K --> L;