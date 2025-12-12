import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qikubtfblmpygkmnfeed.supabase.co'
const supabaseAnonKey = 'sb_publishable_Zn1Njt45XW0m66AqsNhkIw_TqgdZM5b'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
