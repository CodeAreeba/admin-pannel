// Config/Permission.js

export const CREATE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:create",
  Products: "product:create",
  Roles: "role:create",
};

export const VIEW_PERMISSION_BY_TABLE = {
  Users: "user:read",        // Changed from user:view
  Categories: "category:read", // Changed from category:view
  Products: "product:read",   // Changed from product:view
  Roles: "role:read",         // Changed from role:view
};

export const UPDATE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",      // admin:manage covers user updates
  Categories: "category:update",
  Products: "product:update",
  Roles: "role:update",
};

export const DELETE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:delete",
  Products: "product:delete",
  Roles: "role:delete",
};