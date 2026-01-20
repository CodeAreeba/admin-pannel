// Config/Permission.js

export const CREATE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:create",
  Products: "product:create",
  Roles: "role:create",
  Subcategory: "subcategory:create",
};

export const VIEW_PERMISSION_BY_TABLE = {
  Users: "user:read",
  Categories: "category:read",
  Products: "product:read",
  Roles: "role:read",
  Subcategory: "subcategory:read",
};

export const UPDATE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:update",
  Products: "product:update",
  Roles: "role:update",
  Subcategory: "subcategory:update",
};

export const DELETE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:delete",
  Products: "product:delete",
  Roles: "role:delete",
  Subcategory: "subcategory:delete",
};