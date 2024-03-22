'use client';

import { addUserToOrganization } from '@/actions/organization';
import { Button } from '@/components/ui/button';

function ManageTeam() {
  const addMember = async () => {
    const { data, error } = await addUserToOrganization(
      'clu1f0p0500005ftbr5113ilg'
    );

    console.log(error);
  };

  return (
    <div>
      <Button onClick={addMember}>Add member</Button>
    </div>
  );
}

export default ManageTeam;
