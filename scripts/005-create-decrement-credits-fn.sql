CREATE OR REPLACE FUNCTION decrement_user_credits(user_id_input uuid, decrement_amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  current_credits integer;
  new_credits integer;
BEGIN
  -- First, get the current credits and lock the row for update
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id_input FOR UPDATE;

  -- Check if the user has enough credits
  IF current_credits < decrement_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Proceed with decrementing credits
  UPDATE public.profiles
  SET credits = credits - decrement_amount
  WHERE id = user_id_input
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$;
