import { createClient } from '@supabase/supabase-js';
import config from '$lib/config';

export const supabase = createClient(config.db.url, config.db.key);
