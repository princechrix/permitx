import { render, screen } from '@testing-library/react';
import { PermissionProvider, usePermissionResolver } from '../src/core/PermissionProvider';
import { User } from '../src/types';

const TestComponent = () => {
  const resolver = usePermissionResolver();
  const user = resolver();
  // Handle both sync and async resolvers
  if (user instanceof Promise) {
    return <div>Loading...</div>;
  }
  return <div>{user.role || 'no-role'}</div>;
};

describe('PermissionProvider', () => {
  it('should provide resolver to children', () => {
    const mockResolver = (): User => ({ role: 'admin' });
    
    render(
      <PermissionProvider resolver={mockResolver}>
        <TestComponent />
      </PermissionProvider>
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePermissionResolver must be used within PermissionProvider');
    
    consoleSpy.mockRestore();
  });
});
