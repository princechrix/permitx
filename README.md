# PermitX

A lightweight React permission management library with role-based access control (RBAC) and permission-based access control. Built with TypeScript and designed for modern React applications.

## Features

- 🎯 **Role-based Access Control (RBAC)** - Manage access based on user roles
- 🔐 **Permission-based Access Control** - Fine-grained permission management
- ⚛️ **React Components** - Conditional rendering based on permissions
- 🚀 **Next.js SSR Support** - Server-side route protection
- 📦 **TypeScript First** - Full type safety and IntelliSense
- 🪶 **Lightweight** - Minimal bundle size with zero dependencies
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install permit-x
```

## Quick Start

### 1. Setup Permission Provider

Wrap your app with the `PermissionProvider`:

```tsx
import { PermissionProvider } from 'permit-x';

function App() {
  const userResolver = () => ({
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  });

  return (
    <PermissionProvider resolver={userResolver}>
      {children}
    </PermissionProvider>
  );
}
```

### 2. Use Permission Hook

```tsx
import { usePermission } from 'permit-x';

function MyComponent() {
  const { user, hasRole, hasPermission, loading } = usePermission();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {user?.role}!</p>
      {hasPermission('write') && <button>Edit</button>}
      {hasRole('admin') && <button>Delete</button>}
    </div>
  );
}
```

### 3. Conditional Rendering Components

```tsx
import { IfRole, IfPermission } from 'permit-x';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <IfRole role="admin">
        <AdminPanel />
      </IfRole>
      
      <IfPermission permission="write">
        <EditButton />
      </IfPermission>
      
      <IfRole role="user" fallback={<div>Access denied</div>}>
        <UserContent />
      </IfRole>
    </div>
  );
}
```

## API Reference

### PermissionProvider

The context provider that manages permission state.

```tsx
interface PermissionProviderProps {
  resolver: Resolver;
  children: React.ReactNode;
}
```

**Props:**
- `resolver`: Function that returns user data or a promise of user data
- `children`: React children

### usePermission

Hook to access permission state and functions.

```tsx
const { user, hasRole, hasPermission, loading } = usePermission();
```

**Returns:**
- `user`: Current user object with role and permissions
- `hasRole(role)`: Function to check if user has specific role
- `hasPermission(permission)`: Function to check if user has specific permission
- `loading`: Boolean indicating if user data is being loaded

### IfRole

Component for conditional rendering based on user role.

```tsx
interface IfRoleProps {
  role: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

### IfPermission

Component for conditional rendering based on user permission.

```tsx
interface IfPermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

### getServerSidePropsGuard

Next.js helper for server-side route protection.

```tsx
import { getServerSidePropsGuard } from 'permit-x';

export const getServerSideProps = getServerSidePropsGuard(
  (context) => {
    // Your user resolver logic
    return { role: 'admin', permissions: ['read'] };
  },
  {
    requiredRole: 'admin',
    requiredPermissions: ['read'],
    redirectTo: '/login'
  }
);
```

## Types

```tsx
type Role = string;
type Permission = string;

type User = {
  role?: Role;
  permissions?: Permission[];
};

type Resolver = () => User | Promise<User>;
```

## Advanced Usage

### Async User Resolution

```tsx
const asyncResolver = async () => {
  const response = await fetch('/api/user');
  return response.json();
};

<PermissionProvider resolver={asyncResolver}>
  <App />
</PermissionProvider>
```

### Multiple Permission Checks

```tsx
function ComplexComponent() {
  const { hasPermission } = usePermission();
  
  const canEdit = hasPermission('write');
  const canDelete = hasPermission('delete');
  const canPublish = hasPermission('publish');
  
  return (
    <div>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
      {canPublish && <PublishButton />}
    </div>
  );
}
```

### Custom Fallback Components

```tsx
<IfRole 
  role="admin" 
  fallback={<AccessDenied message="Admin access required" />}
>
  <AdminPanel />
</IfRole>
```

## Next.js Integration

### Route Protection

```tsx
// pages/admin.tsx
import { getServerSidePropsGuard } from 'permit-x';

export const getServerSideProps = getServerSidePropsGuard(
  async (context) => {
    // Get user from session, JWT, etc.
    const user = await getUserFromSession(context.req);
    return user;
  },
  {
    requiredRole: 'admin',
    redirectTo: '/unauthorized'
  }
);

export default function AdminPage() {
  return <div>Admin content</div>;
}
```

## Testing

```tsx
import { render, screen } from '@testing-library/react';
import { PermissionProvider } from 'permit-x';

const createWrapper = (resolver) => {
  return ({ children }) => (
    <PermissionProvider resolver={resolver}>
      {children}
    </PermissionProvider>
  );
};

test('renders content for admin role', () => {
  const mockResolver = () => ({ role: 'admin' });
  
  render(
    <IfRole role="admin">Admin Content</IfRole>,
    { wrapper: createWrapper(mockResolver) }
  );
  
  expect(screen.getByText('Admin Content')).toBeInTheDocument();
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Prince Chrix

## Changelog

### 1.0.0
- Initial release
- Role-based access control
- Permission-based access control
- React components for conditional rendering
- Next.js SSR support
- TypeScript definitions
