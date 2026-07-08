'use client';

import { useAuth } from './useAuth';

export type SupportedLanguage = 'English' | 'Spanish' | 'Arabic' | 'Portuguese';

export const i18nDictionaries = {
  English: {
    title: 'AEGIS StadiumOS',
    subtitle: 'Event Governance & Security Operations',
    signIn: 'Access Command Center',
    signUp: 'Register Profile',
    email: 'Security Email Address',
    password: 'Security Password',
    role: 'Development Role Assignment',
    authorize: 'Authorize Access',
    logout: 'Logout',
    clearance: 'Clearance',
    profileSettings: 'Account Configurations',
    displayName: 'Operator Name',
    saveProfile: 'Save Configurations',
    activeSessions: 'Active Security Sessions',
    activeDevices: 'Connected Command Units',
    revocationLabel: 'Bypass MFA Tokens & Logs',
    revokeAll: 'Revoke All Sessions',
    liveTelemetry: 'Real-Time Telemetry',
    analytics: 'Analytics Charts',
    diagnostics: 'System Diagnostics',
    activeIncidents: 'Live Incidents',
    severity: 'Severity Level',
    location: 'Location',
    status: 'Status',
    dispatchBtn: 'Authorize Dispatch',
    resolveBtn: 'Resolve Threat',
    aiPlanBtn: 'Generate AI Plan',
    aiTitle: 'AI Incident Resolution plan',
  },
  Spanish: {
    title: 'AEGIS StadiumOS',
    subtitle: 'Gobernanza de Eventos y Operaciones de Seguridad',
    signIn: 'Acceder al Centro de Mando',
    signUp: 'Registrar Perfil',
    email: 'Correo Electrónico de Seguridad',
    password: 'Contraseña de Seguridad',
    role: 'Asignación de Rol de Desarrollo',
    authorize: 'Autorizar Acceso',
    logout: 'Cerrar Sesión',
    clearance: 'Autorización',
    profileSettings: 'Configuraciones de Cuenta',
    displayName: 'Nombre del Operador',
    saveProfile: 'Guardar Configuraciones',
    activeSessions: 'Sesiones de Seguridad Activas',
    activeDevices: 'Unidades de Mando Conectadas',
    revocationLabel: 'Bypasear Tokens MFA y Registros',
    revokeAll: 'Revocar Todas las Sesiones',
    liveTelemetry: 'Telemetría en Tiempo Real',
    analytics: 'Gráficos de Análisis',
    diagnostics: 'Diagnósticos del Sistema',
    activeIncidents: 'Incidentes en Vivo',
    severity: 'Nivel de Gravedad',
    location: 'Ubicación',
    status: 'Estado',
    dispatchBtn: 'Autorizar Despacho',
    resolveBtn: 'Resolver Amenaza',
    aiPlanBtn: 'Generar Plan de IA',
    aiTitle: 'Plan de resolución de incidentes de IA',
  },
  Arabic: {
    title: 'إيجيس StadiumOS',
    subtitle: 'حوكمة الفعاليات وعمليات الأمن',
    signIn: 'دخول مركز القيادة',
    signUp: 'تسجيل الملف الشخصي',
    email: 'البريد الإلكتروني الأمني',
    password: 'كلمة المرور الأمنية',
    role: 'تعيين دور التطوير',
    authorize: 'تفويض الوصول',
    logout: 'تسجيل الخروج',
    clearance: 'التصريح الأمني',
    profileSettings: 'إعدادات الحساب',
    displayName: 'اسم المشغل',
    saveProfile: 'حفظ الإعدادات',
    activeSessions: 'جلسات الأمن النشطة',
    activeDevices: 'وحدات القيادة المتصلة',
    revocationLabel: 'تجاوز رموز MFA والسجلات',
    revokeAll: 'إلغاء جميع الجلسات',
    liveTelemetry: 'القياس عن بعد في الوقت الفعلي',
    analytics: 'رسوم بيانية تحليلية',
    diagnostics: 'تشخيص النظام',
    activeIncidents: 'الحوادث المباشرة',
    severity: 'مستوى الخطورة',
    location: 'الموقع',
    status: 'الحالة',
    dispatchBtn: 'تفويض الإرسال',
    resolveBtn: 'حل التهديد',
    aiPlanBtn: 'إنشاء خطة الذكاء الاصطناعي',
    aiTitle: 'خطة حل الحوادث بالذكاء الاصطناعي',
  },
  Portuguese: {
    title: 'AEGIS StadiumOS',
    subtitle: 'Governança de Eventos e Operações de Segurança',
    signIn: 'Acessar Centro de Comando',
    signUp: 'Registrar Perfil',
    email: 'E-mail de Segurança',
    password: 'Senha de Segurança',
    role: 'Atribuição de Função de Desenvolvimento',
    authorize: 'Autorizar Acesso',
    logout: 'Sair',
    clearance: 'Autorização',
    profileSettings: 'Configurações de Conta',
    displayName: 'Nome do Operador',
    saveProfile: 'Salvar Configurações',
    activeSessions: 'Sessões de Segurança Ativas',
    activeDevices: 'Unidades de Comando Conectadas',
    revocationLabel: 'Ignorar Tokens MFA e Registros',
    revokeAll: 'Revogar Todas as Sessões',
    liveTelemetry: 'Telemetria em Tempo Real',
    analytics: 'Gráficos de Análise',
    diagnostics: 'Diagnósticos do Sistema',
    activeIncidents: 'Incidentes Ativos',
    severity: 'Nível de Gravidade',
    location: 'Localização',
    status: 'Status',
    dispatchBtn: 'Autorizar Despacho',
    resolveBtn: 'Resolver Ameaça',
    aiPlanBtn: 'Gerar Plano de IA',
    aiTitle: 'Plano de resolução de incidentes de IA',
  },
};

export function useI18n() {
  const { user } = useAuth();
  
  // Default to English if no user context is loaded or preferredLanguage is invalid
  const activeLanguage: SupportedLanguage =
    user?.preferredLanguage && user.preferredLanguage in i18nDictionaries
      ? (user.preferredLanguage as SupportedLanguage)
      : 'English';

  const t = (key: keyof typeof i18nDictionaries['English']) => {
    return i18nDictionaries[activeLanguage][key] || i18nDictionaries['English'][key];
  };

  return {
    t,
    activeLanguage,
  };
}
