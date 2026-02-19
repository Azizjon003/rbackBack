const Paths = {
  _: '/api',
  Users: {
    _: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Auth: {
    _: '/auth',
    Login: '/login',
    Register: '/register',
    Me: '/me',
  },
} as const;

export default Paths;
