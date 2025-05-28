export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface GroupedPermission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export interface PermissionGroup {
  name: string;
  permissions: GroupedPermission[];
}
