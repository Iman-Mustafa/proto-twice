import { createClient } from '@supabase/supabase-js';
import { Prototype } from './types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function savePrototype(prototype: Omit<Prototype, 'id'|'created_at'>) {
  const { data, error } = await supabase
    .from('prototypes')
    .insert(prototype)
    .select();
    
  if (error) throw error;
  return data[0] as Prototype;
}

export async function getUserPrototypes(userId: string) {
  const { data, error } = await supabase
    .from('prototypes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Prototype[];
}