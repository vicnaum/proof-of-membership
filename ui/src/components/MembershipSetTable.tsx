import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';

const MembershipSetTable = ({ users }: any) => {
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
    );
};

export default MembershipSetTable;
