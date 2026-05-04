export const environment = {
  production: true,
  apiUrl: 'https://rainclassbkn-production.up.railway.app/api',
  // En producción las credenciales deben gestionarse desde el backend.
  // Este array es un fallback; se recomienda migrar a autenticación por API.
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
