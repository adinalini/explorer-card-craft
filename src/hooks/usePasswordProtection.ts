import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PASSWORD_AUTH_KEY = 'password_auth';
const AUTH_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

interface PasswordAuth {
  authenticated: boolean;
  timestamp: number;
}

export const usePasswordProtection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored auth that's still valid
    const stored = localStorage.getItem(PASSWORD_AUTH_KEY);
    if (stored) {
      try {
        const auth: PasswordAuth = JSON.parse(stored);
        const now = Date.now();
        if (auth.authenticated && (now - auth.timestamp) < AUTH_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Auth expired
          localStorage.removeItem(PASSWORD_AUTH_KEY);
        }
      } catch (e) {
        localStorage.removeItem(PASSWORD_AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'site_password')
        .single();

      if (error || !data) {
        return false;
      }

      if (data.setting_value === password) {
        const auth: PasswordAuth = {
          authenticated: true,
          timestamp: Date.now()
        };
        localStorage.setItem(PASSWORD_AUTH_KEY, JSON.stringify(auth));
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return { isAuthenticated, isLoading, verifyPassword };
};
