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
  role: "Home_Seeker" | "Agent" | "Landlord" | "Developer" | "Admin";
  state: string;
  status: UserStatus;
  joinedAt: string;
  agentStatus?: AgentStatus;
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

export type AdminProperty = {
  id: string;
  title: string;
  type: string;
  city: string;
  state: string;
  price: number;
  verificationStatus: "unverified" | "pending" | "verified";
  isAvailable: boolean;
  ownerName: string;
};

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type AdminPayment = {
  id: string;
  reference: string;
  propertyTitle: string;
  amount: number;
  currency: "NGN";
  status: PaymentStatus;
  paymentFor: "tour" | "property" | "subscription" | "refund";
  createdAt: string;
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
