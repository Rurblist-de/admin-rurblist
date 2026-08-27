import type {
  AdminNotification,
  AdminPayment,
  AdminProperty,
  AdminUser,
  AdminVerification,
  AuditLog,
  OverviewStats,
  SupportTicket,
} from "~/services/api/types";

export const MOCK_STATS: OverviewStats = {
  welcomeName: "Emmanuel",
  activeListings: 1284,
  listingChangePct: 12,
  escrowVolumeNgn: 48_400_000,
  escrowChangePct: 8,
  pendingVerification: 47,
  pendingPriorityLabel: "High Priority",
  trend: [
    { month: "Jan", volume: 80_000_000, released: 55_000_000 },
    { month: "Feb", volume: 95_000_000, released: 70_000_000 },
    { month: "Mar", volume: 110_000_000, released: 150_000_000 },
    { month: "Apr", volume: 120_000_000, released: 240_000_000 },
    { month: "May", volume: 140_000_000, released: 180_000_000 },
    { month: "Jun", volume: 160_000_000, released: 210_000_000 },
    { month: "July", volume: 175_000_000, released: 230_000_000 },
  ],
  listingsByState: [
    { state: "Lagos", count: 400 },
    { state: "Abuja", count: 300 },
    { state: "Delta", count: 310 },
    { state: "Enugu", count: 300 },
  ],
  attention: [
    {
      id: "att-1",
      title: "Oluwaseun Adeyemi",
      detail: "CAC Documents Uploaded. Submitted 2 days ago.",
      kind: "kyc",
      status: "pending",
      priority: "high",
      href: "/users/user-emeka",
    },
    {
      id: "att-2",
      title: "Property #LP-4821 flagged for review",
      detail: "Price discrepancy detected - listed at N85M vs Avg. Market.",
      kind: "listing",
      status: "pending",
      priority: "high",
      href: "/properties/prop-1",
    },
    {
      id: "att-3",
      title: "REQ-2026-338 - Overdue by 1 Day",
      detail: "Inspection Report for Plot 12B GRA, Enugu. Assigned to Ngozi.",
      kind: "listing",
      status: "under_review",
      priority: "medium",
      href: "/properties/prop-1",
    },
    {
      id: "att-4",
      title: "REQ-2026-338 - Overdue by 1 Day",
      detail: "Inspection Report for Plot 12B GRA, Enugu. Assigned to Ngozi.",
      kind: "listing",
      status: "under_review",
      priority: "medium",
      href: "/support/tck-1",
    },
    {
      id: "att-5",
      title: "Escrow documents — TX-2026-0142",
      detail: "Title pack waiting on admin review.",
      kind: "escrow",
      status: "under_review",
      priority: "medium",
      href: "/escrow/ver-0142",
    },
    {
      id: "att-6",
      title: "Agent verification — Emeka Okafor",
      detail: "CAC certificate uploaded. Awaiting approval.",
      kind: "kyc",
      status: "pending",
      priority: "high",
      href: "/users/user-emeka",
    },
  ],
};

const BASE_USERS: AdminUser[] = [
  {
    id: "user-emeka",
    fullName: "Emeka Okafor",
    email: "emeka.o@email.com",
    phone: "+234 8123 4567 891",
    role: "Agent",
    state: "Lagos",
    status: "active",
    joinedAt: "2026-05-26",
    agentStatus: "approved",
    cacNumber: "RC-1234567",
    company: "Prime Realty Partners",
    trustScore: 92,
    verified: true,
    approvedAt: "2026-05-30",
    approvedBy: "Super Admin",
    bankName: "GT Bank",
    bankAccountMasked: "5321*****34",
    totalCommissionsNgn: 12_084_100,
    documents: [
      {
        id: "doc-gov",
        name: "Government ID",
        url: "#",
        uploadedAt: "2026-03-01",
        verified: true,
      },
      {
        id: "doc-cac",
        name: "CAC Certificate",
        url: "#",
        uploadedAt: "2026-03-01",
        verified: true,
      },
      {
        id: "doc-license",
        name: "Professional License",
        url: "#",
        uploadedAt: "2026-03-01",
        verified: true,
      },
    ],
    listings: [
      {
        id: "LP-1203",
        title: "3-Bedroom Terrace — Lekki Phase 1",
        price: 12_950_000,
        status: "published",
        date: "2026-04-16",
      },
      {
        id: "LP-1204",
        title: "Mini Flat — Ikoyi",
        price: 8_400_000,
        status: "sold",
        date: "2026-03-22",
      },
      {
        id: "LP-1205",
        title: "Plot 23B — Ajah",
        price: 15_200_000,
        status: "pending",
        date: "2026-04-08",
      },
      {
        id: "LP-1206",
        title: "2-Bedroom Apartment — Yaba",
        price: 9_750_000,
        status: "published",
        date: "2026-02-14",
      },
      {
        id: "LP-1207",
        title: "Studio Apartment — VI",
        price: 6_200_000,
        status: "sold",
        date: "2026-01-30",
      },
      {
        id: "LP-1208",
        title: "4-Bedroom Duplex — Magodo",
        price: 18_500_000,
        status: "published",
        date: "2026-04-02",
      },
    ],
    commissions: [
      {
        id: "COM-1201",
        propertyTitle: "Mini Flat — Ikoyi",
        amount: 750_000,
        status: "paid",
        date: "2026-03-24",
      },
      {
        id: "COM-1202",
        propertyTitle: "3-Bedroom Terrace — Lekki Phase 1",
        amount: 1_200_000,
        status: "paid",
        date: "2026-04-18",
      },
      {
        id: "COM-1203",
        propertyTitle: "Plot 23B — Ajah",
        amount: 890_000,
        status: "pending",
        date: "2026-04-10",
      },
      {
        id: "COM-1204",
        propertyTitle: "Studio Apartment — VI",
        amount: 620_000,
        status: "paid",
        date: "2026-02-02",
      },
    ],
  },
  {
    id: "user-ada",
    fullName: "Ada Nwosu",
    email: "ada@example.com",
    phone: "08023456789",
    role: "Home_Seeker",
    state: "Abuja",
    status: "active",
    joinedAt: "2026-01-08",
  },
  {
    id: "user-chioma",
    fullName: "Chioma Eze",
    email: "chioma@example.com",
    phone: "08145551212",
    role: "Home_Seeker",
    state: "Enugu",
    status: "pending",
    joinedAt: "2026-03-22",
  },
  {
    id: "user-ibrahim",
    fullName: "Ibrahim Musa",
    email: "ibrahim@example.com",
    phone: "08056667890",
    role: "Agent",
    state: "Abuja",
    status: "flagged",
    joinedAt: "2026-02-11",
    agentStatus: "pending",
    cacNumber: "RC-220441",
  },
  {
    id: "user-funke",
    fullName: "Funke Adeyemi",
    email: "funke@example.com",
    phone: "07088990011",
    role: "Agent",
    state: "Lagos",
    status: "pending",
    joinedAt: "2026-04-02",
    agentStatus: "under_review",
    cacNumber: "RC-331002",
  },
  {
    id: "user-ngozi",
    fullName: "Ngozi Okeke",
    email: "ngozi@example.com",
    phone: "09012223344",
    role: "Home_Seeker",
    state: "Enugu",
    status: "active",
    joinedAt: "2026-04-18",
  },
  {
    id: "user-tunde",
    fullName: "Tunde Balogun",
    email: "tunde@example.com",
    phone: "08019998877",
    role: "Agent",
    state: "Lagos",
    status: "inactive",
    joinedAt: "2025-11-22",
    agentStatus: "approved",
    cacNumber: "RC-102331",
  },
  {
    id: "user-halima",
    fullName: "Halima Bello",
    email: "halima@example.com",
    phone: "08170004455",
    role: "Landlord",
    state: "Abuja",
    status: "active",
    joinedAt: "2026-03-04",
  },
  {
    id: "user-chinedu",
    fullName: "Chinedu Okonkwo",
    email: "chinedu@example.com",
    phone: "07033322111",
    role: "Home_Seeker",
    state: "Delta",
    status: "active",
    joinedAt: "2026-04-09",
  },
  {
    id: "user-yemi",
    fullName: "Yemi Alabi",
    email: "yemi@example.com",
    phone: "08024446688",
    role: "Developer",
    state: "Lagos",
    status: "pending",
    joinedAt: "2026-02-28",
  },
  {
    id: "user-amaka",
    fullName: "Amaka Ibe",
    email: "amaka@example.com",
    phone: "09087776655",
    role: "Home_Seeker",
    state: "Enugu",
    status: "flagged",
    joinedAt: "2026-01-19",
  },
  {
    id: "user-segun",
    fullName: "Segun Adeleke",
    email: "segun@example.com",
    phone: "08121110099",
    role: "Agent",
    state: "Lagos",
    status: "active",
    joinedAt: "2026-04-21",
    agentStatus: "approved",
    cacNumber: "RC-441990",
  },
];

const LISTING_SEEDS = [
  { title: "3-Bedroom Terrace — Lekki Phase 1", price: 12_950_000, status: "published" as const },
  { title: "Mini Flat — Ikoyi", price: 8_400_000, status: "sold" as const },
  { title: "Plot 23B — Ajah", price: 15_200_000, status: "pending" as const },
  { title: "2-Bedroom Apartment — Yaba", price: 9_750_000, status: "published" as const },
  { title: "Studio Apartment — VI", price: 6_200_000, status: "sold" as const },
  { title: "4-Bedroom Duplex — Magodo", price: 18_500_000, status: "published" as const },
];

const BANKS = ["GT Bank", "Access Bank", "Zenith Bank", "UBA", "First Bank"];

function withUserDetails(user: AdminUser, index: number): AdminUser {
  if (user.listings?.length) return user;

  const seller = user.role !== "Home_Seeker";
  const firstName = user.fullName.split(" ")[0] ?? "User";
  const listings = LISTING_SEEDS.slice(0, seller ? 6 : 2).map((listing, listingIndex) => ({
    id: `LP-${1200 + index * 10 + listingIndex}`,
    title: listing.title,
    price: listing.price,
    status: listing.status,
    date: `2026-0${(listingIndex % 5) + 1}-${String(10 + listingIndex).padStart(2, "0")}`,
  }));
  const commissions = seller
    ? listings.slice(0, 4).map((listing, commissionIndex) => ({
        id: `COM-${1200 + index * 10 + commissionIndex}`,
        propertyTitle: listing.title,
        amount: 400_000 + commissionIndex * 250_000,
        status: (commissionIndex === 2 ? "pending" : "paid") as "paid" | "pending",
        date: listing.date,
      }))
    : [];

  return {
    ...user,
    company:
      user.company ??
      (seller ? `${firstName} Realty Partners` : undefined),
    trustScore: user.trustScore ?? 68 + ((index * 9) % 28),
    verified: user.verified ?? user.status === "active",
    approvedAt: user.approvedAt ?? (seller ? "2026-05-30" : undefined),
    approvedBy: user.approvedBy ?? (seller ? "Super Admin" : undefined),
    bankName: user.bankName ?? (seller ? BANKS[index % BANKS.length] : undefined),
    bankAccountMasked:
      user.bankAccountMasked ?? (seller ? `532${index}*****3${index}` : undefined),
    totalCommissionsNgn:
      user.totalCommissionsNgn ??
      (seller ? commissions.reduce((sum, row) => sum + row.amount, 0) : undefined),
    cacNumber:
      user.cacNumber ?? (seller ? `RC-${100000 + index * 337}` : undefined),
    documents: user.documents ?? [
      {
        id: `${user.id}-gov`,
        name: "Government ID",
        url: "#",
        uploadedAt: "2026-03-01",
        verified: user.status === "active",
      },
      {
        id: `${user.id}-cac`,
        name: seller ? "CAC Certificate" : "Proof of Address",
        url: "#",
        uploadedAt: "2026-03-01",
        verified: user.status === "active",
      },
      {
        id: `${user.id}-license`,
        name: seller ? "Professional License" : "NIN Slip",
        url: "#",
        uploadedAt: "2026-03-01",
        verified: user.status !== "flagged",
      },
    ],
    listings,
    commissions,
  };
}

export const MOCK_USERS: AdminUser[] = BASE_USERS.map(withUserDetails);

export const MOCK_PROPERTIES: AdminProperty[] = [
  {
    id: "prop-1",
    title: "3-bed apartment, Lekki Phase 1",
    type: "Apartment",
    city: "Lekki",
    state: "Lagos",
    price: 85_000_000,
    verificationStatus: "pending",
    isAvailable: true,
    ownerName: "Emeka Okafor",
  },
  {
    id: "prop-2",
    title: "Detached duplex, Magodo",
    type: "Duplex",
    city: "Magodo",
    state: "Lagos",
    price: 210_000_000,
    verificationStatus: "verified",
    isAvailable: true,
    ownerName: "Tunde Balogun",
  },
];

export const MOCK_PAYMENTS: AdminPayment[] = [
  {
    id: "pay-0142",
    reference: "TX-2026-0142",
    propertyTitle: "3-bed apartment, Lekki Phase 1",
    amount: 2_500_000,
    currency: "NGN",
    status: "success",
    paymentFor: "property",
    createdAt: "2026-08-12",
    verificationId: "ver-0142",
  },
  {
    id: "pay-0143",
    reference: "TX-2026-0143",
    propertyTitle: "Inspection — Magodo duplex",
    amount: 15_000,
    currency: "NGN",
    status: "pending",
    paymentFor: "tour",
    createdAt: "2026-08-20",
  },
];

export const MOCK_VERIFICATIONS: AdminVerification[] = [
  {
    id: "ver-0142",
    paymentReference: "TX-2026-0142",
    propertyTitle: "3-bed apartment, Lekki Phase 1",
    buyerName: "Ada Nwosu",
    agentName: "Emeka Okafor",
    amount: 2_500_000,
    status: "documents_under_review",
    fundsReleased: false,
    documents: [
      { id: "d1", name: "Certificate of Occupancy", status: "under_review" },
      { id: "d2", name: "Survey Plan", status: "submitted" },
      { id: "d3", name: "Deed of Assignment", status: "pending" },
    ],
    timeline: [
      {
        id: "t1",
        title: "Funds deposited",
        description: "Paystack confirmed TX-2026-0142",
        status: "done",
        date: "2026-08-12",
      },
      {
        id: "t2",
        title: "Documents under review",
        description: "Title pack submitted by agent",
        status: "current",
        date: "2026-08-14",
      },
      {
        id: "t3",
        title: "Inspection scheduled",
        description: "Site visit not yet booked",
        status: "upcoming",
        date: "",
      },
      {
        id: "t4",
        title: "Payment disbursed",
        description: "Escrow release to agent",
        status: "upcoming",
        date: "",
      },
    ],
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    actor: "Rublist Admin",
    action: "approve",
    resource: "agent",
    summary: "Opened KYC review for Emeka Okafor",
    createdAt: "2026-08-26T10:12:00.000Z",
  },
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tck-1",
    subject: "Payout delayed on TX-2026-0142",
    requester: "Emeka Okafor",
    status: "open",
    createdAt: "2026-08-25",
  },
];

export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "n1",
    title: "47 verifications pending",
    body: "Needs Attention inbox grew since yesterday.",
    createdAt: "2026-08-27T08:00:00.000Z",
    read: false,
  },
];
