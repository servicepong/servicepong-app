export const route = {
  // project
  projectPongs: (projectId: string) => `/project/${projectId}/pongs`,
  projectPongDetails: (projectId: string, pongId: string) =>
    `/project/${projectId}/pongs/${pongId}`,
  projectIntegrations: (projectId: string) =>
    `/project/${projectId}/integrations`,
  projectSettings: (projectId: string) => `/project/${projectId}/settings`,

  // user
  dashboard: () => '/',
  account: () => `/account`,
  accountBilling: () => `/account/billing`,
  register: () => '/register',
  login: () => '/login',

  // website
  pricing: () => `${process.env.NEXT_PUBLIC_WEB_URL}/pricing`,
};
