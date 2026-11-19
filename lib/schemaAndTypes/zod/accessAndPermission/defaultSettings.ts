export type Permission = {
  permission: string;
  label: string;
};

export type TabPermissionSettings = {
  tab: string;
  label: string;
  standalonePermissions: Permission[];
  recordLevelPermissions: Permission[];
  recordSource?: "sites" | "users";
};

export const tabPermissionSettings: TabPermissionSettings[] = [
  {
    tab: "sites",
    label: "Sites",
    standalonePermissions: [
      {
        permission: "purchase_site_tokens",
        label: "Purchase Site Tokens",
      },
      {
        permission: "view_site_tokens",
        label: "View Site Tokens",
      },
      {
        permission: "create_sites",
        label: "Create Sites",
      },
    ],
    recordLevelPermissions: [
      { permission: "view_overview", label: "View Overview" },
      { permission: "view_floors_and_areas", label: "View Floors and Areas" },
      {
        permission: "manage_floors_and_areas",
        label: "Manage Floors and Areas",
      },
      { permission: "manage_imports", label: "Manage Imports" },
      { permission: "manage_site_settings", label: "Manage Site Settings" },
      { permission: "delete_site", label: "Delete Site" },
    ],
  },

  // User-related permissions tab
  {
    tab: "users",
    label: "Users",
    standalonePermissions: [
      {
        permission: "create_users",
        label: "Create Users",
      },
      {
        permission: "view_user_tokens",
        label: "View User Tokens",
      },
      {
        permission: "purchase_user_tokens",
        label: "Purchase User Tokens",
      },
    ],
    recordLevelPermissions: [
      { permission: "view_user", label: "View User" },
      { permission: "manage_user", label: "Manage User" },
      { permission: "delete_user", label: "Delete User" },
    ],
  },
];

export const getDefaultPermissions = (permissions: Permission[]) => {
  return permissions.map((permission) => ({
    permission: permission.permission,
    label: permission.label,
    hasAccess: false,
  }));
};
