export type Action =
  | "read"
  | "list"
  | "create"
  | "update"
  | "delete"
  | "manage"
  | "approve"
  | "impersonate";

export type Resource =
  | "all"
  | "overview"
  | "user"
  | "agent"
  | "property"
  | "tour"
  | "payment"
  | "verification"
  | "content"
  | "audit_log"
  | "ticket"
  | "notification";

export type CaslRule = {
  action: Action | Action[];
  subject: Resource | Resource[];
  conditions?: Record<string, unknown>;
  inverted?: boolean;
};

export type Permission = {
  action: Action;
  resource: Resource;
};

export type Role = {
  id: string;
  name: string;
};

export type AuthMe = {
  user: {
    id: string;
    email: string;
    fullName: string;
    type: "admin";
  };
  roles: Role[];
  permissions: Permission[];
  rules: CaslRule[];
};

export type UserStatus = "active" | "pending" | "flagged" | "inactive";
export type AgentStatus =
  | "not_submitted"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "Home_Seeker" | "Agent" | "Landlord" | "Developer" | "Admin" | "Super_Admin";
  state: string;
  status: UserStatus;
  joinedAt: string;
  profileImage?: string | null;
  agentStatus?: AgentStatus | null;
  cacNumber?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt?: string;
    verified?: boolean;
  }>;
  company?: string;
  trustScore?: number;
  verified?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  bankName?: string;
  bankAccountMasked?: string;
  totalCommissionsNgn?: number;
  listings?: Array<{
    id: string;
    title: string;
    price: number;
    status: "published" | "sold" | "pending" | "off_market";
    date: string;
  }>;
  commissions?: Array<{
    id: string;
    propertyTitle: string;
    amount: number;
    status: "paid" | "pending";
    date: string;
  }>;
};

export type PropertyBoardStatus =
  | "pending_review"
  | "verified"
  | "published"
  | "sold_delisted";

export type PropertyPricePeriod = "sale" | "month";

export type PropertyTrustScore = "passed" | "failed" | "pending";

export type PropertyDocumentStatus = "pending" | "verified" | "rejected";

export type PropertyChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type PropertyDocument = {
  id: string;
  type?:
    | "certificate_of_occupancy"
    | "survey_plan"
    | "deed_of_assignment"
    | "governors_consent"
    | "power_of_attorney"
    | "other_supporting";
  name: string;
  url?: string;
  uploadedAt: string;
  status: PropertyDocumentStatus;
};

export type PropertyAgent = {
  id?: string;
  name: string;
  kycStatus?: AgentStatus;
};

export type PropertyListingReview = "pending" | "approved" | "rejected";

export type PropertyInspectionStatus =
  | "not_started"
  | "scheduled"
  | "completed"
  | "failed";

export type PropertyInspectionStep = {
  id: string;
  title: string;
  description: string;
  status: "success" | "info" | "warning" | "failed";
  date?: string;
};

export type PropertyInspection = {
  status: PropertyInspectionStatus;
  scheduledAt?: string;
  completedAt?: string;
  note?: string;
  timeline: PropertyInspectionStep[];
};

export type AdminProperty = {
  id: string;
  title: string;
  type: string;
  city: string;
  state: string;
  price: number;
  pricePeriod: PropertyPricePeriod;
  boardStatus: PropertyBoardStatus;
  featured?: boolean;
  flagged?: boolean;
  listingReview?: PropertyListingReview;
  reviewFeedback?: {
    title?: string | null;
    description?: string | null;
    issues?: string[];
    action?: "approve" | "reject" | "flag" | null;
    createdAt?: string | null;
    createdBy?: string | null;
  } | null;
  isSold?: boolean;
  totalUnits?: number;
  availableUnits?: number;
  ownerName: string;
  phone?: string;
  description?: string;
  images?: string[];
  listedAt?: string;
  trustScore?: PropertyTrustScore;
  checklist?: PropertyChecklistItem[];
  documents?: PropertyDocument[];
  inspection?: PropertyInspection;
  agent?: PropertyAgent;
};

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type EscrowLedgerStatus =
  | "released"
  | "held_in_escrow"
  | "initiated"
  | "disputed";

export type EscrowTimelineStep = {
  id: string;
  title: string;
  actor: string;
  timestamp: string;
  done: boolean;
};

export type EscrowDocumentStatus =
  | "pending"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected";

export type EscrowDocument = {
  id: string;
  name: string;
  url?: string;
  status: EscrowDocumentStatus;
  note?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectedAt?: string;
};

export type EscrowInspectionStatus =
  | "not_started"
  | "scheduled"
  | "completed"
  | "failed";

export type EscrowInspectionStep = {
  id: string;
  title: string;
  description: string;
  status: "success" | "info" | "warning" | "failed";
  date?: string;
};

export type EscrowInspection = {
  status: EscrowInspectionStatus;
  scheduledAt?: string;
  completedAt?: string;
  note?: string;
  timeline: EscrowInspectionStep[];
};

export type EscrowBankDetails = {
  bankName: string;
  bankCode?: string | null;
  accountName: string;
  accountNumber?: string;
  accountNumberMasked?: string;
  updatedAt?: string | null;
};

export type AdminPayment = {
  id: string;
  reference: string;
  propertyTitle: string;
  amount: number;
  currency: "NGN";
  status: PaymentStatus;
  escrowStatus: EscrowLedgerStatus;
  paymentFor: "tour" | "property" | "subscription" | "refund";
  createdAt: string;
  paymentId?: string;
  verificationId?: string;
  buyerName?: string;
  agentName?: string;
  provider?: string;
  initiatedAt?: string;
  fundedAt?: string;
  buyerBankDetails?: EscrowBankDetails | null;
  agentPayoutDetails?: EscrowBankDetails | null;
  timeline?: EscrowTimelineStep[];
  verificationStatus?: VerificationStatus;
  fundsReleased?: boolean;
  fundsReleasedAt?: string;
  rejectionReason?: string;
  currentStage?: {
    title: string;
    description: string;
    estimatedCompletion?: string | null;
  };
  documents?: EscrowDocument[];
  inspection?: EscrowInspection;
  certificate?: {
    id?: string;
    url?: string;
    issuedAt?: string;
  };
};

export type EscrowSummary = {
  totalVolume: number;
  inEscrow: number;
  released: number;
  disputed: number;
};

export type DisputeStatus = "new" | "open" | "resolved";

export type AdminDispute = {
  id: string;
  status: DisputeStatus;
  description: string;
  amount: number;
  date: string;
  propertyTitle: string;
  buyerName: string;
  agentName: string;
  verificationId?: string;
};

export type PayoutStatus = "pending" | "paid" | "failed";

export type AdminPayout = {
  id: string;
  agentName: string;
  amount: number;
  status: PayoutStatus;
  date: string;
  verificationId?: string;
};

export type VerificationStatus =
  | "pending"
  | "payment_confirmed"
  | "verification_started"
  | "documents_under_review"
  | "inspection_scheduled"
  | "completed"
  | "rejected"
  | "cancelled";

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  status: "done" | "current" | "upcoming";
  date: string;
};

export type AdminVerification = {
  id: string;
  paymentReference: string;
  propertyTitle: string;
  buyerName: string;
  agentName: string;
  amount: number;
  status: VerificationStatus;
  fundsReleased: boolean;
  documents: Array<{
    id: string;
    name: string;
    status: "pending" | "submitted" | "under_review" | "verified" | "rejected";
  }>;
  timeline: TimelineEvent[];
};

export type AttentionItem = {
  id: string;
  title: string;
  detail?: string;
  kind: "kyc" | "listing" | "escrow" | "ticket";
  status: "pending" | "under_review";
  priority: "high" | "medium";
  href: string;
};

export type EscrowTrendPoint = {
  month: string;
  volume: number;
  released: number;
};

export type ListingByState = {
  state: string;
  count: number;
};

export type OverviewStats = {
  welcomeName: string;
  activeListings: number;
  listingChangePct: number;
  escrowVolumeNgn: number;
  escrowChangePct: number;
  pendingVerification: number;
  pendingPriorityLabel: string;
  trend: EscrowTrendPoint[];
  listingsByState: ListingByState[];
  attention: AttentionItem[];
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  resource: Resource;
  summary: string;
  createdAt: string;
};

export type TicketStatus = "open" | "pending" | "resolved";

export type SupportTicket = {
  id: string;
  subject: string;
  requester: string;
  status: TicketStatus;
  createdAt: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};
