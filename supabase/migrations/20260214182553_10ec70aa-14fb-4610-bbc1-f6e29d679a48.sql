ALTER TABLE public.profile_settings 
ADD COLUMN what_i_do jsonb DEFAULT '[]'::jsonb;