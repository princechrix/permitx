import { render, screen } from '@testing-library/react';
import { IfPermission } from '../src/components/IfPermission';
import { PermissionProvider } from '../src/core/PermissionProvider';
import { User } from '../src/types';

const createWrapper = (resolver: () => User | Promise<User>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <PermissionProvider resolver={resolver}>
      {children}
    </PermissionProvider>
  );
};

describe('IfPermission', () => {
  it('should render children when user has required permission', () => {
    const mockResolver = (): User => ({ permissions: ['read', 'write'] });
    
    render(
      <IfPermission permission="read">
        <div>Read Content</div>
      </IfPermission>,
      { wrapper: createWrapper(mockResolver) }
    );

    expect(screen.getByText('Read Content')).toBeInTheDocument();
  });

  it('should render fallback when user does not have required permission', () => {
    const mockResolver = (): User => ({ permissions: ['read'] });
    
    render(
      <IfPermission permission="write" fallback={<div>No Write Access</div>}>
        <div>Write Content</div>
      </IfPermission>,
      { wrapper: createWrapper(mockResolver) }
    );

    expect(screen.getByText('No Write Access')).toBeInTheDocument();
    expect(screen.queryByText('Write Content')).not.toBeInTheDocument();
  });

  it('should render nothing when loading', () => {
    const mockResolver = (): Promise<User> => new Promise(() => {});
    
    render(
      <IfPermission permission="read">
        <div>Read Content</div>
      </IfPermission>,
      { wrapper: createWrapper(mockResolver) }
    );

    expect(screen.queryByText('Read Content')).not.toBeInTheDocument();
  });
});
