import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getAddressSet } from '../lib/getAddressSet';
import { useParams } from 'react-router-dom';

type ProofParam = {
    proofHash: string
}

const ProofSet = () => {
    let { proofHash } = useParams<ProofParam>()    
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        console.log('proofHash', proofHash)
        const getAddress = async () => {
            let data = await getAddressSet(proofHash)
            setUsers(data)
        }
        getAddress()
    },[proofHash])

    return (
        users && (
            <Table variant="simple" mt={20} colorScheme={'orange'}>
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th>Balance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map((user: any) => (
                        <Tr>
                            <Th>{user.address}</Th>
                            <Th>{user.balance}</Th>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        )
    )
}

export default ProofSet;
