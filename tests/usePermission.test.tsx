import { renderHook, act } from '@testing-library/react';
import { usePermission } from '../src/core/usePermission';
import { PermissionProvider } from '../src/core/PermissionProvider';
import { User } from '../src/types';

const createWrapper = (resolver: () => User | Promise<User>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <PermissionProvider resolver={resolver}>
      {children}
    </PermissionProvider>
  );
};

describe('usePermission', () => {
  it('should return user data and permission functions', () => {
    const mockUser: User = { role: 'admin', permissions: ['read', 'write'] };
    const mockResolver = () => mockUser;

    const { result } = renderHook(() => usePermission(), {
      wrapper: createWrapper(mockResolver)
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('user')).toBe(false);
    expect(result.current.hasPermission('read')).toBe(true);
    expect(result.current.hasPermission('delete')).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should handle async resolver', async () => {
    const mockUser: User = { role: 'user', permissions: ['read'] };
    const mockResolver = () => Promise.resolve(mockUser);

    const { result } = renderHook(() => usePermission(), {
      wrapper: createWrapper(mockResolver)
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });
});
