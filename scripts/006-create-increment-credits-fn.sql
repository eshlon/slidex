CREATE OR REPLACE FUNCTION increment_user_credits(user_id_input uuid, increment_amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_credits integer;
BEGIN
  UPDATE profiles
  SET credits = credits + increment_amount
  WHERE id = user_id_input
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$;
