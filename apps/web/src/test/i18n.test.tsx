import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../hooks/useAuth';
import { useAiCoPilot } from '../hooks/useAiCoPilot';

describe('i18n Translation & Internationalization Tests', () => {
  beforeEach(() => {
    // Clear user state before each test
    useAuth.setState({ user: null, error: null, isLoading: false });
  });

  it('should default to English translations if user is not logged in', () => {
    const { result } = renderHookHelper();
    expect(result.activeLanguage).toBe('English');
    expect(result.t('logout')).toBe('Logout');
    expect(result.t('activeIncidents')).toBe('Live Incidents');
  });

  it('should map Spanish dictionary keys correctly', () => {
    useAuth.setState({
      user: {
        id: 'usr-es',
        email: 'miguel@stadium.org',
        displayName: 'Miguel S',
        role: 'Organizer',
        preferredLanguage: 'Spanish',
        theme: 'system',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    const { result } = renderHookHelper();
    expect(result.activeLanguage).toBe('Spanish');
    expect(result.t('logout')).toBe('Cerrar Sesión');
    expect(result.t('liveTelemetry')).toBe('Telemetría en Tiempo Real');
  });

  it('should map Portuguese dictionary keys correctly', () => {
    useAuth.setState({
      user: {
        id: 'usr-pt',
        email: 'joao@stadium.org',
        displayName: 'Joao P',
        role: 'Organizer',
        preferredLanguage: 'Portuguese',
        theme: 'system',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    const { result } = renderHookHelper();
    expect(result.activeLanguage).toBe('Portuguese');
    expect(result.t('logout')).toBe('Sair');
    expect(result.t('activeIncidents')).toBe('Incidentes Ativos');
  });

  it('should map Arabic dictionary keys correctly', () => {
    useAuth.setState({
      user: {
        id: 'usr-ar',
        email: 'tarek@stadium.org',
        displayName: 'Tarek A',
        role: 'Organizer',
        preferredLanguage: 'Arabic',
        theme: 'system',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    const { result } = renderHookHelper();
    expect(result.activeLanguage).toBe('Arabic');
    expect(result.t('diagnostics')).toBe('تشخيص النظام');
  });

  it('should translate AI Co-Pilot recommendations based on active language', async () => {
    useAuth.setState({
      user: {
        id: 'usr-es-ai',
        email: 'miguel@stadium.org',
        displayName: 'Miguel S',
        role: 'Organizer',
        preferredLanguage: 'Spanish',
        theme: 'system',
        timezone: 'UTC',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    // Render AiCoPilot hook
    let aiResult: any = null;
    function AiComponent() {
      aiResult = useAiCoPilot();
      return null;
    }
    render(<AiComponent />);

    let finalChunk = '';
    act(() => {
      (aiResult as any).getIncidentRecommendationStream(
        {
          id: 'inc-1',
          category: 'Medical',
          severity: 4,
          status: 'Reported',
          location: 'Gate A',
          description: 'Medical call',
          reportTime: new Date().toISOString(),
          assignedTeamIds: [],
        },
        (chunk: string) => {
          finalChunk = chunk;
        },
        () => {}
      );
    });

    // Wait for the async streaming interval to complete
    await waitFor(() => {
      expect(finalChunk).toContain('[COMANDO DE DESPACHO MÉDICO');
      expect(finalChunk).toContain('ACCIÓN RECOMENDADA');
    }, { timeout: 5000 });
  });
});

// Reusable testing helper for Client hooks
function renderHookHelper() {
  let result: any = null;
  function TestComponent() {
    result = useI18n();
    return null;
  }
  render(<TestComponent />);
  return { result: result as ReturnType<typeof useI18n> };
}
