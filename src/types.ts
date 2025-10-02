export type Role = string;

export type Permission = string;

export type User = {
  role?: Role | undefined;
  permissions?: Permission[] | undefined;
};

export type Resolver = () => User | Promise<User>;
