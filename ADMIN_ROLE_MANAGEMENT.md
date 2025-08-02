# Admin Role Management API

This document describes the new admin role management functionality added to the user controller.

## Endpoints

### 1. Create Admin Role
**POST** `/api/users/create-admin`

Creates an admin role for an existing user.

**Authorization:** Requires Super Admin privileges

**Request Body:**
```json
{
  "user_id": 123,
  "admin_level": "moderator", // optional, defaults to "moderator"
  "permissions": {            // optional, custom permissions object
    "can_ban_users": true,
    "can_delete_issues": false
  }
}
```

**Valid admin levels:**
- `moderator` - Basic admin privileges
- `admin` - Extended admin privileges
- `super_admin` - Full admin privileges

**Response:**
```json
{
  "success": true,
  "message": "Admin role created successfully",
  "data": {
    "id": 123,
    "user_name": "john_doe",
    "email": "john@example.com",
    "admin_level": "moderator",
    "permissions": {
      "can_ban_users": true,
      "can_delete_issues": false
    },
    "admin_created_at": "2025-08-02T10:30:00Z"
  }
}
```

### 2. Update Admin Role
**PATCH** `/api/users/update-admin-role/:id`

Updates an existing admin role's level, permissions, or active status.

**Authorization:** Requires Super Admin privileges

**Request Body:**
```json
{
  "admin_level": "admin",     // optional
  "permissions": {            // optional
    "can_ban_users": true,
    "can_delete_issues": true
  },
  "is_active": true          // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin role updated successfully",
  "data": {
    "id": 123,
    "user_name": "john_doe",
    "email": "john@example.com",
    "admin_level": "admin",
    "permissions": {
      "can_ban_users": true,
      "can_delete_issues": true
    },
    "is_active": true
  }
}
```

### 3. Remove Admin Role
**DELETE** `/api/users/remove-admin/:id`

Removes admin privileges from a user.

**Authorization:** Requires Super Admin privileges

**Response:**
```json
{
  "success": true,
  "message": "Admin role removed successfully",
  "data": {
    "id": 123,
    "user_name": "john_doe",
    "email": "john@example.com"
  }
}
```

### 4. Check Admin Status
**GET** `/api/users/check-admin-status/:id`

Checks if a user has admin privileges and returns their admin details.

**Authorization:** Requires Admin privileges (any level)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_name": "john_doe",
    "email": "john@example.com",
    "admin_level": "moderator",
    "permissions": {
      "can_ban_users": true,
      "can_delete_issues": false
    },
    "is_active": true,
    "admin_created_at": "2025-08-02T10:30:00Z",
    "is_admin": true
  }
}
```

## Permission Levels

The system uses a hierarchical permission model:

1. **Super Admin** (`super_admin`)
   - Can create, update, and remove admin roles
   - Has all admin privileges
   - Can manage other super admins

2. **Admin** (`admin`)
   - Extended administrative privileges
   - Cannot manage admin roles
   - Can perform most administrative tasks

3. **Moderator** (`moderator`)
   - Basic administrative privileges
   - Limited to content moderation tasks
   - Cannot manage users or other admins

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common error codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient privileges)
- `404` - Not Found (user/admin not found)
- `500` - Internal Server Error

## Usage Examples

### Creating a moderator admin:
```bash
curl -X POST /api/users/create-admin \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 123, "admin_level": "moderator"}'
```

### Promoting a moderator to admin:
```bash
curl -X PATCH /api/users/update-admin-role/1 \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"admin_level": "admin"}'
```

### Checking admin status:
```bash
curl -X GET /api/users/check-admin-status/123 \
  -H "Authorization: Bearer <admin_token>"
```
