-- Applied to the Lovable Cloud project on 2026-11-18.
-- Anonymous participants may invoke the consent-gated insertion RPC, but cannot
-- read, edit, or delete other participant records.
CREATE TABLE IF NOT EXISTS public.yard_usability_submissions (
  id uuid PRIMARY KEY,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  participant_code text,
  missions jsonb NOT NULL,
  accessibility jsonb NOT NULL,
  post_test jsonb NOT NULL,
  CONSTRAINT participant_code_short CHECK (participant_code IS NULL OR char_length(participant_code) <= 40),
  CONSTRAINT missions_is_object CHECK (jsonb_typeof(missions) = 'object'),
  CONSTRAINT accessibility_is_object CHECK (jsonb_typeof(accessibility) = 'object'),
  CONSTRAINT post_test_is_object CHECK (jsonb_typeof(post_test) = 'object')
);

ALTER TABLE public.yard_usability_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.yard_usability_submissions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_yard_usability(
  p_id uuid, p_participant_code text, p_missions jsonb,
  p_accessibility jsonb, p_post_test jsonb, p_consent boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF p_consent IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Consent is required' USING ERRCODE = '22023';
  END IF;
  IF p_id IS NULL OR p_id = '00000000-0000-0000-0000-000000000000'::uuid THEN
    RAISE EXCEPTION 'Invalid submission identifier' USING ERRCODE = '22023';
  END IF;
  IF p_participant_code IS NOT NULL AND char_length(p_participant_code) > 40 THEN
    RAISE EXCEPTION 'Participant code too long' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_missions) IS DISTINCT FROM 'object'
     OR jsonb_typeof(p_accessibility) IS DISTINCT FROM 'object'
     OR jsonb_typeof(p_post_test) IS DISTINCT FROM 'object'
     OR octet_length(p_missions::text) > 12000
     OR octet_length(p_accessibility::text) > 15000
     OR octet_length(p_post_test::text) > 8000 THEN
    RAISE EXCEPTION 'Invalid survey payload' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.yard_usability_submissions
      (id, participant_code, missions, accessibility, post_test)
  VALUES
      (p_id, nullif(btrim(p_participant_code), ''), p_missions, p_accessibility, p_post_test)
  ON CONFLICT (id) DO NOTHING;
  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.submit_yard_usability(uuid,text,jsonb,jsonb,jsonb,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_yard_usability(uuid,text,jsonb,jsonb,jsonb,boolean) TO anon, authenticated;
COMMENT ON TABLE public.yard_usability_submissions IS 'Explicitly consented anonymous usability responses; never grant public SELECT.';
