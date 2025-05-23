// Маппинг appId в понятные названия приложений
export const APP_NAMES = {
  'weather': 'Погода',
  'notes': 'Заметки',
  'tasks': 'Задачи',
  'calendar': 'Календарь',
  'chat': 'Чат',
  'file-storage': 'Файловое хранилище',
  'analytics': 'Аналитика',
  'invoices': 'Счета',
  'crm': 'CRM',
  'shop': 'Магазин'
};

export function getAppName(appId) {
  return APP_NAMES[appId] || appId;
}

export function getAllApps() {
  return Object.entries(APP_NAMES).map(([id, name]) => ({ id, name }));
}