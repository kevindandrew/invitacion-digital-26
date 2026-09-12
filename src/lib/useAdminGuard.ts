import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useAdminGuard(): boolean | null {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (!data.session) {
        window.location.href = '/admin';
        return;
      }
      setAuthorized(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/admin';
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return authorized;
}
