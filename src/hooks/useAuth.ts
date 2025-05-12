import {supabase} from '@/lib/supabase';
import {useEffect, useState} from 'react';

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    getUser();
  }, []);

  return {userId};
};
