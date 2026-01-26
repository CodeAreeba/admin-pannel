// Config/Permission.js

import Orders from "../Pages/Orders/Orders";

export const CREATE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:create",
  Products: "product:create",
  Variants: "variant:create",
  Subcategory: "subcategory:create",
};

export const VIEW_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:read",
  Products: "product:read",
  Variants: "variant:read",
  Subcategory: "subcategory:read",
  Customers: "customer:read",
  Orders: "order:read",
  Inventory: "inventory:read",
};

export const UPDATE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:update",
  Products: "product:update",
  Variants: "variant:update",
  Subcategory: "subcategory:update",
};

export const DELETE_PERMISSION_BY_TABLE = {
  Users: "admin:manage",
  Categories: "category:delete",
  Products: "product:delete",
  Variants: "variant:delete",
  Subcategory: "subcategory:delete",
};