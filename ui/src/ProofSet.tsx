import MembershipSetTable from './MembershipSetTable';
import { useEffect, useState } from 'react';
import { getAddressSet } from './getAddressSet';
import { useParams } from 'react-router-dom';

const ProofSet = () => {
    let { proofHash } = useParams<any>();
    const [users, setUsers] = useState<any[]>([]);
    console.log('proofHash', proofHash);
    useEffect(() => {
        getAddressSet(proofHash).then((data: any) => {
            setUsers(data.record.addressSet.data.users);
        });
    }, []);

    return <MembershipSetTable users={users} />;
};

export default ProofSet;
