DROP POLICY IF EXISTS "Users can view members of their groups" ON group_members;
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;

-- Create a security definer function to break the infinite recursion loop
CREATE OR REPLACE FUNCTION get_my_group_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM group_members WHERE user_id = auth.uid();
$$;

-- Replace groups policy
CREATE POLICY "Users can view groups they are members of" 
ON groups FOR SELECT 
USING (
  id IN (SELECT get_my_group_ids())
);

-- Replace group_members policy
CREATE POLICY "Users can view members of their groups" 
ON group_members FOR SELECT 
USING (
  group_id IN (SELECT get_my_group_ids())
);
