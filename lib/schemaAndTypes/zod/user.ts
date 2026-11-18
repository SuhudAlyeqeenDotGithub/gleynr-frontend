import { z } from "zod";
import { tabPermissionSettings } from "./accessAndPermission/defaultSettings";

export const userTypeSchema = z.enum(["Internal User", "External User"]);
export type UserType = z.infer<typeof userTypeSchema>;

// permission schema and type
export const permissionObject = z.object({
  permission: z.string(),
  hasAccess: z.boolean(),
});

export type Permission = z.infer<typeof permissionObject>;

export const recordPermissionSchema = z.object({
  tab: z.enum(Object.keys(tabPermissionSettings)),
  recordId: z.string(),
  permissions: z.array(permissionObject),
});

export type RecordPermission = z.infer<typeof recordPermissionSchema>;

// tab schema and type
export const tabSchema = z.object({
  displayText: z.string().optional(),
  tab: z.enum(Object.keys(tabPermissionSettings)),
  hasAccess: z.boolean(),
  standalonePermissions: z.array(permissionObject),
});
export type Tab = z.infer<typeof tabSchema>;

// user schema and type
export const userSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  email: z.email(),
  uid: z.string().optional(),
  username: z.string().optional(),
  accountStatus: z.enum(["Active", "Inactive"]),
  accountType: z.enum(["Internal User", "External User"]),
  tabPermissions: z.array(tabSchema),
  recordLevelPermissions: z.array(recordPermissionSchema),
  createdAt: z.date(),
  invitationStatus: z.enum(["Not invited", "Pending", "Accepted"]),
});
export type User = z.infer<typeof userSchema>;
