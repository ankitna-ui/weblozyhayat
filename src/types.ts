export type Status = 'Pending' | 'In Progress' | 'Completed' | 'Approved' | 'Rejected' | 'Dispatched';

export interface Farmer {
  id: string;
  name: string;
  cropType: string;
  location: string;
  estimatedYield: number; // kg
  lastDeliveryDate: string;
  rating: number;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  certifications: string[];
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  productType: string;
  pricePerKg: number;
  leadTime: number; // days
  rating: number;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  certifications: string[];
}

export interface RawMaterialBatch {
  id: string;
  name: string;
  quantity: number; // kg
  farmerId: string;
  receivedDate: string;
  status: 'Awaiting Processing' | 'In QC' | 'Passed' | 'Processing';
  qcResults?: {
    purity: number;
    moisture: number;
    ashContent?: number;
    foreignMatter?: number;
  };
  imageUrl?: string;
  storageLocation?: string;
  harvestMethod?: string;
  dryingMethod?: string;
  processingHistory?: {
    stage: string;
    timestamp: string;
    operator: string;
    notes: string;
  }[];
}

export interface ExtractBatch {
  id: string;
  name: string;
  type: string;
  potency: string;
  quantity: number; // kg
  rawMaterialBatchId: string;
  processedDate: string;
  status: 'Pending QC' | 'Approved' | 'Rejected';
  coaUrl?: string;
  qcMetrics?: {
    pesticides: 'Pass' | 'Fail';
    heavyMetals: 'Pass' | 'Fail';
    hplc: number;
    microbial: 'Pass' | 'Fail';
    solventResidue: 'Pass' | 'Fail';
    terpeneProfile?: string;
    aflatoxins?: 'Pass' | 'Fail';
  };
  testerName?: string;
  testDate?: string;
  imageUrl?: string;
  extractionMethod?: string;
  solventUsed?: string;
  yieldPercentage?: number;
  processingParameters?: {
    temperature: string;
    pressure: string;
    duration: string;
    equipmentId: string;
  };
  allocatedOrderId?: string;
}

export interface Order {
  id: string;
  clientName: string;
  productName: string;
  quantity: number; // kg
  priority: 'Low' | 'Medium' | 'High';
  status: 'Enquiry' | 'Confirmed' | 'Allocated' | 'Dispatched';
  requestDate: string;
  allocatedBatchId?: string;
  shippingMethod?: 'Air' | 'Sea';
  trackingNumber?: string;
  estimatedDelivery?: string;
  destination?: string;
  portOfExit?: string;
  containerId?: string;
  vesselName?: string;
  documents?: {
    invoice: string;
    packingList: string;
    billOfLading: string;
  };
}

export interface TeamTask {
  id: string;
  team: 'Processing' | 'QC' | 'Dispatch';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'Doing' | 'Done';
  linkedId?: string;
}

export interface AppState {
  farmers: Farmer[];
  suppliers: Supplier[];
  rawMaterials: RawMaterialBatch[];
  extracts: ExtractBatch[];
  orders: Order[];
  tasks: TeamTask[];
  notifications: { id: string; message: string; time: string; type: 'info' | 'success' | 'warning' }[];
}
