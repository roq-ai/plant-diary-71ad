interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Owner'],
  customerRoles: ['Community Member'],
  tenantRoles: ['Owner'],
  tenantName: 'Company',
  applicationName: 'plant diary',
  addOns: ['chat', 'notifications', 'file'],
};
