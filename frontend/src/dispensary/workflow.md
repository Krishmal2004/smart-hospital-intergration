# Prescription Fulfillment Workflow

## Overview
This document outlines the standard workflow for processing a patient's prescription, starting from the doctor's consultation to the final dispensation of medicine at the pharmacy/dispensary.

---

## Workflow Steps

### 1. Prescription Creation (Doctor)
*   **Action:** The doctor examines the patient and determines the required medication.
*   **Process:** The doctor writes or digitally enters the prescription details (medication name, dosage, frequency, and duration).
*   **Output:** A generated prescription linked to the patient's ID.

### 2. Transmission to Dispensary
*   **Action:** The prescription is sent to the dispensary.
*   **Process:** This can be done physically (handing a paper slip to the patient) or electronically routed through the hospital management system.
*   **Output:** The dispensary receives the prescription in their queue.

### 3. Verification & Preparation (Dispensary)
*   **Action:** The pharmacist/dispenser reviews the prescription.
*   **Process:** 
    *   Verify the availability of the prescribed medicines in stock.
    *   Pack and label the medications with the correct dosage instructions.

### 4. Patient Authentication & Dispensation
*   **Action:** Handing over the medicine to the patient.
*   **Process:** 
    *   **Crucial Step:** The dispenser verifies the patient's identity (e.g., asking for Name, Patient ID, or Date of Birth) to ensure the medicine is given to the **correct patient**.
    *   Provide the medicine and explain the dosage instructions.

### 5. Closing the Prescription
*   **Action:** Finalizing the transaction.
*   **Process:** The dispenser marks the prescription as "Fulfilled" or "Closed" in the system.
*   **Output:** The workflow is complete, and the record is archived in the patient's medical history.

---

## Visual Workflow Diagram

```mermaid
graph TD
    A[Doctor examines patient] --> B(Doctor writes prescription);
    B --> C{Send to Dispensary};
    C -->|Electronic/Physical| D[Dispensary receives prescription];
    D --> E[Dispensary prepares medicine];
    E --> F{Verify Patient Identity};
    F -->|Identity Confirmed| G[Hand over medicine to correct patient];
    G --> H((Close Prescription));