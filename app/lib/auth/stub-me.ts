import type { AuthMe } from "~/services/api/types";

export const STUB_ADMIN: AuthMe = {
  user: {
    id: "admin-1",
    email: "admin@rurblist.com",
    fullName: "Rublist Admin",
    type: "admin",
  },
  roles: [{ id: "role-admin", name: "Admin" }],
  permissions: [{ action: "manage", resource: "all" }],
  rules: [{ action: "manage", subject: "all" }],
};
