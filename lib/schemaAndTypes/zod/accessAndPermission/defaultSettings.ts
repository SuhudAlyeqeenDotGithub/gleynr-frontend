export type Permission = {
  permission: string;
  label: string;
};

export type TabPermissionSettings = {
  tabKey: string;
  label: string;
  standalonePermissions: Record<string, Permission>;
  recordLevelPermissions: Record<string, Permission>;
  recordSource?: "sites" | "users";
};

export const tabPermissionSettings: Record<string, TabPermissionSettings> = {
  sites: {
    tabKey: "sites",
    label: "sites",
    standalonePermissions: {
      purchase_site_tokens: {
        permission: "purchase_site_tokens",
        label: "Purchase Site Tokens",
      },
      view_site_tokens: {
        permission: "view_site_tokens",
        label: "View Site Tokens",
      },
      create_sites: { permission: "create_sites", label: "Create Sites" },
    },

    recordSource: "sites",
    recordLevelPermissions: {
      view_overview: { permission: "view_overview", label: "View Overview" },
      view_floors_and_areas: {
        permission: "view_floors_and_areas",
        label: "View Floors and Areas",
      },
      manage_floors_and_areas: {
        permission: "manage_floors_and_areas",
        label: "Manage Floors and Areas",
      },
      manage_imports: { permission: "manage_imports", label: "Manage Imports" },
      manage_site_settings: {
        permission: "manage_site_settings",
        label: "Manage Site Settings",
      },
      delete_site: { permission: "delete_site", label: "Delete Site" },
    },
  },

  // User-related permissions tab
  users: {
    tabKey: "users",
    label: "users",
    standalonePermissions: {
      create_users: { permission: "create_users", label: "Create Users" },
      view_user_tokens: {
        permission: "view_user_tokens",
        label: "View User Tokens",
      },
      purchase_user_tokens: {
        permission: "purchase_user_tokens",
        label: "Purchase User Tokens",
      },
    },
    recordSource: "users",
    recordLevelPermissions: {
      view_user: { permission: "view_user", label: "View User" },
      manage_user: { permission: "manage_user", label: "Manage User" },
      delete_user: { permission: "delete_user", label: "Delete User" },
    },
  },
};

export const getDefaultPermissions = (
  permissions: Record<string, Permission>,
) => {
  return Object.values(permissions).map((permission) => ({
    permission: permission.permission,
    label: permission.label,
    hasAccess: false,
  }));
};
