export const mockPendingPrescriptions = [
  { id: 'RX-1042', patientId: 'PT-84729', patientName: 'Sarah Jenkins', doctorName: 'Dr. Michael Smith', time: '10:45 AM', status: 'pending', items: [
    { name: 'Amoxicillin 500mg', instructions: '1 capsule three times a day for 7 days', qty: 21, stock: 150 },
    { name: 'Ibuprofen 400mg', instructions: '1 tablet every 6 hours as needed for pain', qty: 30, stock: 500 }
  ]},
  { id: 'RX-1043', patientId: 'PT-92130', patientName: 'James Wilson', doctorName: 'Dr. Emily Chen', time: '11:15 AM', status: 'pending', items: [
    { name: 'Metformin 500mg', instructions: '1 tablet twice a day with meals', qty: 60, stock: 200 }
  ]},
  { id: 'RX-1044', patientId: 'PT-56321', patientName: 'Emma Davis', doctorName: 'Dr. Michael Smith', time: '12:30 PM', status: 'pending', items: [
    { name: 'Atorvastatin 20mg', instructions: '1 tablet daily at bedtime', qty: 30, stock: 10 } // low stock example
  ]},
];

export const mockFulfilledPrescriptions = [
  { id: 'RX-1039', patientId: 'PT-11234', patientName: 'Alicia Keys', doctorName: 'Dr. Emily Chen', time: '09:15 AM', status: 'fulfilled', dispensedBy: 'Pharmacist Jane' },
  { id: 'RX-1040', patientId: 'PT-44512', patientName: 'Robert Pattinson', doctorName: 'Dr. John Doe', time: '09:45 AM', status: 'fulfilled', dispensedBy: 'Pharmacist Jane' },
];
