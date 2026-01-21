

const pagePermissions = {
 
  "/dashboard": null, 
  "/products": "product:read",
  "/orders": "order:read",
  "/customers": "user:read",
  "/inventory": "inventory:read",
  "/categories": "category:read",
  "/reports": "report:read",


  "/users": "admin:manage",
  "/settings": "admin:manage",
};

export default pagePermissions;
