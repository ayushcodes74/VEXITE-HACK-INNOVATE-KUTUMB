// Synthetic demonstration documents for Sharma Family
// NOTE: All data here is entirely synthetic and fictional for hackathon testing.

export const canonicalFamily = {
  rajesh: { name: 'Rajesh Sharma', role: 'Father' },
  sunita: { name: 'Sunita Sharma', role: 'Mother' },
  aarav: { name: 'Aarav Sharma', role: 'Son' },
  ananya: { name: 'Ananya Sharma', role: 'Daughter' }
};

export const demoDocumentsList = [
  {
    id: 'health-insurance',
    title: 'Health Insurance Policy',
    fileName: 'health_insurance_policy_sharma.pdf',
    type: 'Insurance Policy',
    mimeType: 'application/pdf',
    facts: {
      policyHolder: 'Rajesh Sharma',
      insured: ['Rajesh Sharma', 'Sunita Sharma', 'Aarav Sharma', 'Ananya Sharma'],
      nominee: 'Sunita Sharma',
      renewal: '18 September 2026',
      premium: '₹24,850',
      currency: 'INR',
      amount: 24850
    },
    rawText: `STAR HEALTH & ALLIED INSURANCE COMPANY LTD.
FAMILY OPTIMA HEALTH INSURANCE POLICY SCHEDULE
Policy No: SH-OPT-2026-90421
Policy Holder: Rajesh Sharma
Insured Persons Covered:
1. Rajesh Sharma (Self, 46 Yrs)
2. Sunita Sharma (Spouse, 43 Yrs)
3. Aarav Sharma (Son, 19 Yrs)
4. Ananya Sharma (Daughter, 16 Yrs)
Nominee: Sunita Sharma (Relationship: Wife, 100% Share)
Policy Period: 19 September 2025 to 18 September 2026
Renewal Due Date: 18 September 2026
Total Gross Premium Payable: ₹24,850 (INR)
Sum Insured Floater: ₹15,00,000
Action Required: Pay renewal premium before 18 September 2026 to ensure continuity of coverage.`
  },
  {
    id: 'vehicle-insurance',
    title: 'Vehicle Insurance Certificate',
    fileName: 'vehicle_insurance_brezza.pdf',
    type: 'Motor Insurance Certificate',
    mimeType: 'application/pdf',
    facts: {
      vehicleOwner: 'Rajesh Sharma',
      vehicle: 'Maruti Suzuki Brezza',
      registration: 'MP04 AB 4521',
      nominee: 'Sunita Sharma',
      renewal: '4 November 2026',
      currency: 'INR',
      amount: 14200
    },
    rawText: `ICICI LOMBARD GENERAL INSURANCE COMPANY
CERTIFICATE OF INSURANCE - PRIVATE CAR PACKAGE POLICY
Certificate / Policy No: 3001/VEC/9842109
Registered Owner: Rajesh Sharma
Vehicle Make & Model: Maruti Suzuki Brezza ZXI+
Registration No: MP04 AB 4521
Chassis No: MA3FJB61S0091245
Nominee for Owner-Driver: Sunita Sharma (Spouse)
Policy Expiry Date: 04 November 2026
Renewal Due Date: 04 November 2026
Premium Amount: ₹14,200 INR
IDV (Insured Declared Value): ₹9,40,000`
  },
  {
    id: 'home-loan',
    title: 'Home Loan Statement',
    fileName: 'home_loan_statement_hdfc.pdf',
    type: 'Loan Statement',
    mimeType: 'application/pdf',
    facts: {
      borrower: 'Rajesh Sharma',
      coApplicant: 'Sunita Sharma',
      monthlyEmi: '₹28,450',
      nextEmi: '25 September 2026',
      property: '24, Green Valley Colony, Bhopal, Madhya Pradesh - 462016',
      currency: 'INR',
      amount: 28450
    },
    rawText: `HDFC BANK LIMITED - RETAIL ASSET OPERATIONS
HOME LOAN QUARTERLY STATEMENT OF ACCOUNT
Loan Account Number: HDFC-HL-462016-891
Primary Borrower: Rajesh Sharma
Co-Applicant / Borrower: Sunita Sharma
Property Mortgaged: 24, Green Valley Colony, Bhopal, Madhya Pradesh - 462016
Sanctioned Amount: ₹38,00,000
Outstanding Principal: ₹27,42,800
Monthly EMI Amount: ₹28,450 (INR)
Next EMI Due Date: 25 September 2026
Repayment Mode: Auto-Debit NACH from Joint Account ending 4092
Action Required: Maintain sufficient funds of at least ₹28,450 before 25 September 2026.`
  },
  {
    id: 'electricity-bill',
    title: 'Electricity Bill',
    fileName: 'electricity_bill_sept2026.pdf',
    type: 'Utility Bill',
    mimeType: 'application/pdf',
    facts: {
      accountHolder: 'Sunita Sharma',
      amount: '₹2,184',
      due: '20 September 2026',
      status: 'Unpaid',
      address: '24, Green Valley Colony, Bhopal, Madhya Pradesh - 462016',
      currency: 'INR'
    },
    rawText: `MADHYA PRADESH MADHYA KSHETRA VIDYUT VITARAN CO. LTD.
ELECTRICITY CONSUMER BILL (LT-DOMESTIC)
Consumer Number / IVRS: 100984214
Account Holder Name: Sunita Sharma
Service Address: 24, Green Valley Colony, Bhopal, Madhya Pradesh - 462016
Bill Month: August 2026
Bill Issue Date: 02 September 2026
Units Consumed: 284 kWh
Bill Amount Payable: ₹2,184.00 (INR)
Payment Due Date: 20 September 2026
Payment Status: UNPAID
Action Required: Pay electricity bill of ₹2,184 on or before 20 September 2026 to avoid late surcharge.`
  },
  {
    id: 'property-tax',
    title: 'Property Tax Receipt',
    fileName: 'property_tax_receipt_bhopal.pdf',
    type: 'Tax Receipt',
    mimeType: 'application/pdf',
    facts: {
      owner: 'Rajesh Sharma',
      property: '24, Green Valley Colony, Bhopal, Madhya Pradesh - 462016',
      amount: '₹8,760',
      status: 'Paid',
      currency: 'INR'
    },
    rawText: `BHOPAL MUNICIPAL CORPORATION - REVENUE DEPARTMENT
PROPERTY TAX ASSESSMENT & PAYMENT RECEIPT
Receipt Number: BMC-PTR-2026-08129
Assessment Year: 2026 - 2027
Property Owner: Rajesh Sharma
Property Address: 24, Green Valley Colony, Bhopal, Madhya Pradesh - 462016
Property UID: BPL-PROP-462016-092
Annual Tax Amount: ₹8,760 (INR)
Amount Paid: ₹8,760.00
Payment Date: 12 August 2026
Payment Mode: Net Banking Transaction Ref: TXN998234120
Payment Status: FULLY PAID & VERIFIED
Action Required: None. Retain this receipt for municipal audit and record keeping.`
  },
  {
    id: 'life-insurance',
    title: 'Life Insurance Policy',
    fileName: 'lic_tech_term_life_policy.pdf',
    type: 'Life Insurance Policy',
    mimeType: 'application/pdf',
    facts: {
      policyHolder: 'Rajesh Sharma',
      nominee: 'Sunita Sharma',
      annualPremium: '₹32,400',
      nextDue: '10 December 2026',
      status: 'Active',
      currency: 'INR',
      amount: 32400
    },
    rawText: `LIFE INSURANCE CORPORATION OF INDIA
LIC TECH TERM PLAN (TABLE NO. 854) - FIRST PREMIUM RECEIPT & SCHEDULE
Policy Number: 504892147
Life Assured / Policy Holder: Rajesh Sharma (Age: 46)
Sum Assured: ₹1,00,00,000 (One Crore INR)
Nominee: Sunita Sharma (Relationship: Wife, 100% Share)
Policy Status: ACTIVE
Annual Premium: ₹32,400 (INR)
Next Due Date: 10 December 2026
Grace Period: 30 days from due date`
  }
];
