import { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
