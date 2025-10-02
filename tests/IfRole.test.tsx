import { render, screen } from '@testing-library/react';
import { IfRole } from '../src/components/IfRole';
import { PermissionProvider } from '../src/core/PermissionProvider';
import { User } from '../src/types';

const createWrapper = (resolver: () => User | Promise<User>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <PermissionProvider resolver={resolver}>
      {children}
    </PermissionProvider>
  );
};

describe('IfRole', () => {
  it('should render children when user has required role', () => {
    const mockResolver = (): User => ({ role: 'admin' });
    
    render(
      <IfRole role="admin">
        <div>Admin Content</div>
      </IfRole>,
      { wrapper: createWrapper(mockResolver) }
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should render fallback when user does not have required role', () => {
    const mockResolver = (): User => ({ role: 'user' });
    
    render(
      <IfRole role="admin" fallback={<div>Access Denied</div>}>
        <div>Admin Content</div>
      </IfRole>,
      { wrapper: createWrapper(mockResolver) }
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should render nothing when loading', () => {
    const mockResolver = (): Promise<User> => new Promise(() => {});
    
    render(
      <IfRole role="admin">
        <div>Admin Content</div>
      </IfRole>,
      { wrapper: createWrapper(mockResolver) }
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
