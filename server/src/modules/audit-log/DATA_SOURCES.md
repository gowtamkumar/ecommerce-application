# Understanding Your Audit Logs - Data Sources

## 📊 Where Each Field Comes From

When you create/update/delete something, here's what gets logged:

### 1. User Information
```typescript
userId: req?.id  // From JWT token (set by AuthGuard middleware)
userName: req?.name  // From JWT token payload
userEmail: req?.email  // From JWT token payload  
userRole: req?.role  // From JWT token payload (Admin, User, etc.)
```
**Source:** Your `auth.middleware.ts` - When user logs in, these are stored in the JWT token

### 2. Action Type
```typescript
action: 'CREATE' | 'UPDATE' | 'DELETE'
```
**Source:** HTTP method
- POST → CREATE
- PUT → UPDATE  
- DELETE → DELETE

### 3. Resource Information
```typescript
resourceType: 'Categories' | 'Products' | 'Orders' | etc.
resourceId: '123' | '456' | etc.
resourceName: 'Electronics' | 'iPhone 15' | etc.
```

**Source:** URL path breakdown
- URL: `/api/v1/categories/123`
- pathParts: `['api', 'v1', 'categories', '123']`
- resourceType: `pathParts[2]` → `'categories'` → `'Categories'` (capitalized)
- resourceId: `pathParts[3]` or `req.params.id` → `'123'`
- resourceName: Response body `data.name` or Request body `name`

### 4. Changes Tracked
```typescript
newValues: { name: 'New Category', slug: 'new-category' }  // What was created/updated
oldValues: undefined  // (not captured yet - would need pre-fetch)
```
**Source:** Request body (`req.body`)

### 5. Metadata
```typescript
metadata: {
  ip: '192.168.1.1',  // User's IP address
  userAgent: 'Mozilla/5.0...',  // Browser/device info
  method: 'POST',  // HTTP method
  path: '/api/v1/categories'  // API endpoint
}
```
**Source:** 
- IP: `req.ip` or `req.headers['x-forwarded-for']`
- User Agent: `req.headers['user-agent']`
- Method: `req.method`
- Path: `req.path`

## 🔍 Example: Creating a Category

**When you do:**
```
POST /api/v1/categories
Body: { "name": "Electronics", "description": "Electronic items" }
```

**What gets logged:**
```json
{
  "id": "uuid-here",
  "userId": "user-123",  // From req.id (JWT)
  "userName": "John Doe",  // From req.name (JWT)  
  "userEmail": "john@example.com",  // From req.email (JWT)
  "userRole": "Admin",  // From req.role (JWT)
  "action": "CREATE",  // From POST method
  "resourceType": "Categories",  // From URL pathParts[2]
  "resourceId": "cat-456",  // From response.data.id or pathParts[3]
  "resourceName": "Electronics",  // From response.data.name or req.body.name
  "newValues": { "name": "Electronics", "description": "Electronic items" },  // From req.body
  "oldValues": null,  // Not applicable for CREATE
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "method": "POST",
    "path": "/api/v1/categories"
  },
  "createdAt": "2025-12-11T17:58:00.000Z"
}
```

## 🧪 Testing - What to Check

### Check pathParts console.log:
When you create a category, you'll see:
```
pathParts ['api', 'v1', 'categories']
```

When you update a category:
```
pathParts ['api', 'v1', 'categories', '123']
```

### Check Audit Logs Dashboard:
1. Go to `/dashboard/audit-logs`
2. You should see:
   - ✅ Your name in "User" column (from JWT)
   - ✅ Action badge (CREATE/UPDATE/DELETE)
   - ✅ Resource type (Categories, Products, etc.)
   - ✅ Timestamp
3. Click "View" to see full details including IP and changes

## ⚠️ Common Issues

**If userName shows "Unknown":**
- JWT token doesn't have `name` field
- Solution: Already fixed! You added it to auth.middleware.ts

**If resourceType shows "Unknown":**
- URL doesn't match `/api/v1/[resource]` pattern
- Check `pathParts` console.log

**If resourceName is empty:**
- Response doesn't have `data.name` field
- Request body doesn't have `name` field
- Normal for some resources (like login/logout)

## 🎯 Summary

**Data Flow:**
1. User logs in → JWT created with user info (id, name, email, role)
2. User makes request → AuthGuard decodes JWT → Sets req.id, req.name, req.email, req.role
3. Request goes through audit middleware → Captures everything
4. Saved to audit_logs table
5. Visible in dashboard at `/dashboard/audit-logs`

Now you can track **exactly** who did what, when, and what changed! 🎉
