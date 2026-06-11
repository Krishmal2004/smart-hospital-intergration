# Lab Report Request and Delivery Workflow

## Overview
This document outlines the workflow for processing patient lab tests, starting from the doctor's initial request to the final delivery of the lab reports via email or printed copy.

---

## Workflow Steps

### 1. Lab Test Request (Doctor)
* **Action:** The doctor examines the patient and determines which diagnostic tests are needed.
* **Process:** The doctor writes a lab test request (physically or via the hospital system) specifying the exact tests required for the patient.
* **Output:** A formal lab request is generated and assigned to the patient.

### 2. Sample Collection & Processing (Lab)
* **Action:** The lab receives the request and the patient.
* **Process:** * Lab technicians collect the necessary samples (blood, tissue, etc.) from the patient.
    * The samples are tested and analyzed according to the doctor's request.

### 3. Record Maintenance (Lab)
* **Action:** Storing and managing patient data.
* **Process:** * The lab securely records the test results into the patient's medical profile.
    * The system maintains an organized history of the patient's lab reports for future reference and compliance.
* **Output:** The lab report is finalized and marked as "Newly Available" in the system.

### 4. Report Delivery (Lab to Patient/Doctor)
* **Action:** Distributing the final results.
* **Process:** Once the report is available, the lab provides the results to the patient and/or the requesting doctor through one of two channels:
    * **Email:** An automated system sends a secure, encrypted digital copy (PDF) to the patient's registered email address.
    * **Printing:** A physical copy is printed at the lab desk for the patient to pick up in person.
* **Output:** The patient receives their lab report, closing the lab workflow loop.

---

## Visual Workflow Diagram

```mermaid
graph TD
    A[Doctor examines patient] --> B(Doctor requests specific lab tests);
    B --> C[Lab receives request & collects samples];
    C --> D[Lab analyzes samples];
    D --> E[Lab system maintains & stores patient records];
    E --> F{Report Status: Newly Available};
    F -->|Digital Delivery| G[Send Lab Report via Email];
    F -->|Physical Delivery| H[Print Lab Report at Desk];
    G --> I((Workflow Complete));
    H --> I;