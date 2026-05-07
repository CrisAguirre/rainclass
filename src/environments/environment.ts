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
    },
    {
      username: 'juliangr2424@gmail.com',
      password: 'a1234',
      role: 'docente' as const,
      displayName: 'Blanca Selmira Garzón Rodríguez',
      userId: 'docente_002'
    },
    {
      username: 'monoenao71@gmail.com',
      password: 'b1234',
      role: 'docente' as const,
      displayName: 'Wilson Henao Adarbe',
      userId: 'docente_003'
    },
    {
      username: 'luzgranados221@gmail.com',
      password: 'c1234',
      role: 'docente' as const,
      displayName: 'Luz Mary Granados Herrera',
      userId: 'docente_004'
    },
    {
      username: 'marthaasprilla06@gmail.com',
      password: 'd1234',
      role: 'docente' as const,
      displayName: 'Martha Asprilla Cuesta',
      userId: 'docente_005'
    },
    {
      username: 'cesarorlandobarreto82@gmail.com',
      password: 'e1234',
      role: 'docente' as const,
      displayName: 'Cesar Orlando Barreto Ladino',
      userId: 'docente_006'
    },
    {
      username: 'milesmil123@gmail.com',
      password: 'f1234',
      role: 'docente' as const,
      displayName: 'Milena Patricia Garzón Lasprilla',
      userId: 'docente_007'
    },
    {
      username: 'panchita7927@yahoo.com',
      password: 'g1234',
      role: 'docente' as const,
      displayName: 'Eperanza Cruz',
      userId: 'docente_008'
    },
    {
      username: 'alexaamadoralzate7@gmail.com',
      password: 'h1234',
      role: 'docente' as const,
      displayName: 'Alexandra Amador Alzate',
      userId: 'docente_009'
    },
    {
      username: 'mihomo31@gmail.com',
      password: 'j1234',
      role: 'docente' as const,
      displayName: 'Miguel Horacio Morales Ramos',
      userId: 'docente_010'
    },
    {
      username: 'profeluisfelipe@hotmail.com',
      password: 'k1234',
      role: 'docente' as const,
      displayName: 'Luis Felipe Artunduaga',
      userId: 'docente_011'
    },
    {
      username: 'camilosanti2014@gmail.com',
      password: 'm1234',
      role: 'docente' as const,
      displayName: 'Nohora Esperanza Medina Montealegre',
      userId: 'docente_012'
    },
    {
      username: 'Norelvi',
      password: 'n1234',
      role: 'docente' as const,
      displayName: 'Norelvi',
      userId: 'docente_013'
    }
  ]
};
