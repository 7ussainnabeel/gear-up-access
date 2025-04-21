
// Core types for the asset management system

export type UserRole = 'admin' | 'user' | 'management' | 'it';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  dateCreated: string;
  isActive: boolean;
}

export type AssetType = 
  | 'company_car' 
  | 'mobile' 
  | 'computer' 
  | 'laptop' 
  | 'ip_phone' 
  | 'email'
  | 'accessories';

export type AssetStatus = 
  | 'assigned' 
  | 'pending_approval' 
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'replacement_requested';

export interface Asset {
  id: string;
  type: AssetType;
  serialNumber?: string;
  model?: string;
  details: string;
  assignedTo?: string;
  assignedDate?: string;
  status: AssetStatus;
  requestDate?: string;
}

export interface AssetRequest {
  id: string;
  userId: string;
  assetType: AssetType;
  requestDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedByManagement?: boolean;
  approvedByIT?: boolean;
  notes?: string;
  isReplacement: boolean;
}

export interface ConsentForm {
  id: string;
  userId: string;
  assetId: string;
  sent: boolean;
  signed: boolean;
  dateCreated: string;
  dateSigned?: string;
  content: string;
  signature?: string;
  adminApproved: boolean;
  managementApproved: boolean;
}

export interface TerminationRequest {
  id: string;
  userId: string;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  handoverNotes?: string;
  collectedAssets: {
    assetId: string;
    collected: boolean;
    collectorSignature?: string;
  }[];
  managementApproval: boolean;
}

// Mock data for initial development
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    department: 'IT',
    dateCreated: '2023-01-01',
    isActive: true
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    department: 'Marketing',
    dateCreated: '2023-01-02',
    isActive: true
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    department: 'Finance',
    dateCreated: '2023-01-03',
    isActive: true
  },
  {
    id: '4',
    name: 'Management User',
    email: 'manager@example.com',
    role: 'management',
    department: 'Executive',
    dateCreated: '2023-01-04',
    isActive: true
  },
  {
    id: '5',
    name: 'IT Support',
    email: 'itsupport@example.com',
    role: 'it',
    department: 'IT',
    dateCreated: '2023-01-05',
    isActive: true
  }
];

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    type: 'company_car',
    serialNumber: 'CAR-12345',
    model: 'Tesla Model 3',
    details: 'Black, Electric, 2022',
    assignedTo: '2',
    assignedDate: '2023-02-01',
    status: 'assigned',
    requestDate: '2023-01-15'
  },
  {
    id: '2',
    type: 'laptop',
    serialNumber: 'LT-98765',
    model: 'MacBook Pro 16"',
    details: 'M1 Pro, 16GB RAM, 512GB SSD',
    assignedTo: '3',
    assignedDate: '2023-02-05',
    status: 'assigned',
    requestDate: '2023-01-25'
  },
  {
    id: '3',
    type: 'mobile',
    serialNumber: 'MB-54321',
    model: 'iPhone 13 Pro',
    details: '256GB, Graphite',
    status: 'pending_approval',
    requestDate: '2023-03-10'
  },
  {
    id: '4',
    type: 'ip_phone',
    serialNumber: 'IP-67890',
    model: 'Cisco IP Phone 8841',
    details: 'Black, VoIP Phone',
    assignedTo: '2',
    assignedDate: '2023-02-10',
    status: 'assigned',
    requestDate: '2023-01-30'
  }
];

export const MOCK_ASSET_REQUESTS: AssetRequest[] = [
  {
    id: '1',
    userId: '2',
    assetType: 'mobile',
    requestDetails: 'Need a new phone for client calls',
    status: 'pending',
    requestDate: '2023-03-10',
    approvedByManagement: false,
    approvedByIT: false,
    isReplacement: false
  },
  {
    id: '2',
    userId: '3',
    assetType: 'computer',
    requestDetails: 'Require a desktop computer for design work',
    status: 'approved',
    requestDate: '2023-03-05',
    approvedByManagement: true,
    approvedByIT: true,
    isReplacement: false
  },
  {
    id: '3',
    userId: '2',
    assetType: 'laptop',
    requestDetails: 'Current laptop having battery issues',
    status: 'pending',
    requestDate: '2023-03-15',
    approvedByManagement: false,
    approvedByIT: false,
    isReplacement: true
  }
];

export const MOCK_CONSENT_FORMS: ConsentForm[] = [
  {
    id: '1',
    userId: '2',
    assetId: '1',
    sent: true,
    signed: true,
    dateCreated: '2023-01-10',
    dateSigned: '2023-01-12',
    content: 'I agree to take responsibility for the company car with serial number CAR-12345.',
    signature: 'John Doe',
    adminApproved: true,
    managementApproved: true
  },
  {
    id: '2',
    userId: '3',
    assetId: '2',
    sent: true,
    signed: true,
    dateCreated: '2023-01-20',
    dateSigned: '2023-01-22',
    content: 'I agree to take responsibility for the laptop with serial number LT-98765.',
    signature: 'Jane Smith',
    adminApproved: true,
    managementApproved: true
  },
  {
    id: '3',
    userId: '2',
    assetId: '3',
    sent: true,
    signed: false,
    dateCreated: '2023-03-11',
    content: 'I agree to take responsibility for the mobile phone with serial number MB-54321.',
    adminApproved: false,
    managementApproved: false
  }
];
