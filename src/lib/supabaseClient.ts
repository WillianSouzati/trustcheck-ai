import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Cliente Supabase compartilhado pela aplicação.
 * Utiliza exclusivamente variáveis públicas (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Configuração do Supabase ausente. Defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar a análise.'
    );
  }
  return supabase;
}

/**
 * Garante uma sessão Supabase válida para chamadas autenticadas com JWT na Edge Function.
 * Caso não exista sessão ativa, realiza login anônimo via `supabase.auth.signInAnonymously()`.
 */
export async function ensureAnonymousSession(): Promise<Session> {
  const client = getSupabaseClient();

  const {
    data: { session: currentSession },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) {
    throw new Error(
      `Não foi possível verificar a sessão de autenticação: ${sessionError.message}`
    );
  }

  if (currentSession?.access_token) {
    return currentSession;
  }

  const { data: anonData, error: anonError } = await client.auth.signInAnonymously();

  if (anonError) {
    const normalized = anonError.message.toLowerCase();
    if (normalized.includes('anonymous') && normalized.includes('disabled')) {
      throw new Error(
        'A autenticação anônima está desativada no projeto Supabase. Ative "Anonymous Sign-Ins" nas configurações de Authentication do Supabase.'
      );
    }
    throw new Error(`Falha ao iniciar sessão anônima no Supabase: ${anonError.message}`);
  }

  if (!anonData.session?.access_token) {
    throw new Error(
      'Sessão anônima iniciada, mas o token de acesso JWT não foi retornado pelo Supabase.'
    );
  }

  return anonData.session;
}
