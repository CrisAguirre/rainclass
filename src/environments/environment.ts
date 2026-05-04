export const environment = {
  production: false,
  apiUrl: 'https://rainclassbkn-production.up.railway.app/api',
  // Las credenciales de usuarios se definen aquí en desarrollo.
  // En producción, reemplaza estos valores por variables de entorno del servidor
  // o utiliza un sistema de autenticación centralizado (ej. Firebase Auth, Auth0).
  users: [
    {
      username: 'adminrainclass',
      password: 'r@inClass2620',
      role: 'admin' as const,
      displayName: 'Administrador',
      userId: 'admin_001'
    },
    {
      username: 'Docente',
      password: 'RAInClA$$2026',
      role: 'docente' as const,
      displayName: 'Docente',
      userId: 'docente_001'
    }
  ]
};
