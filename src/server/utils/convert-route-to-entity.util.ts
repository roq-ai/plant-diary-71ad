const mapping: Record<string, string> = {
  companies: 'company',
  journals: 'journal',
  materials: 'material',
  plantings: 'planting',
  tasks: 'task',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
