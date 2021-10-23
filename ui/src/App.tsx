import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    SimpleGrid,
    Stack,
} from '@chakra-ui/react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { CopyIcon } from '@chakra-ui/icons';

// const QUERY = gql`
//     query GetGreeting($language: String!) {
//         greeting(language: $language) {
//             message
//         }
//     }
// `;
//
// const QUERY = gql`
//     query GetUsers($language: String!) {
//         users(first: 200, where: {balance_gt: $balance_gt, balance_lt: $balance_lt}) {
//             address
//             balance
//         }
//     }
// `;

// const QUERY = gql`
//     query GetUsers {
//         users(first: 200, where: { balance_gt: 100, balance_lt: 500 }) {
//             address
//             balance
//         }
//     }
// `;

const QUERY = gql`
    query GetUsers($balance_gt: String!, $balance_lt: String!) {
        users(
            first: 200
            where: { balance_gt: $balance_gt, balance_lt: $balance_lt }
        ) {
            address
            balance
        }
    }
`;

// {
//     users(first: 200, where: {balance_gt: 100, balance_lt: 500}) {
//     address
//     balance
// }
// }

function App() {
    const [minBalance, setMinBalance] = useState();
    const [maxBalance, setMaxBalance] = useState();
    const [showProof, setShowProof] = useState(false);

    const { data } = useQuery(QUERY, {
        variables: { balance_gt: minBalance, balance_lt: maxBalance },
    });

    // const { loading, error, data } = useQuery(QUERY);

    // console.log(loading);
    console.log(data);

    return (
        <Stack>
            <Heading>Zero-Knowladge Proof of Membership</Heading>
            <FormControl id="amount" isRequired>
                <FormLabel>Min USD Balance {setMinBalance}</FormLabel>
                <NumberInput
                    defaultValue={100}
                    min={0}
                    onChange={(e: any) => setMinBalance(e)}
                >
                    <NumberInputField />
                </NumberInput>
            </FormControl>

            <FormControl id="amount">
                <FormLabel>Max USDC Balance</FormLabel>
                <NumberInput min={0} onChange={(e: any) => setMaxBalance(e)}>
                    <NumberInputField />
                </NumberInput>
            </FormControl>

            <FormControl id="amount">
                <FormLabel>Address Set Size</FormLabel>
                <NumberInput defaultValue={200} min={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl id="amount">
                <FormLabel>Your address</FormLabel>
                <NumberInput min={0}>
                    <Input placeholder="0xBc11295936Aa79d594139de1B2e12629414F3BDB" />
                </NumberInput>
            </FormControl>

            <SimpleGrid columns={2} spacing={5}>
                <Button onClick={() => setShowProof(true)}>
                    Generate Proof
                </Button>

                <Button disabled={!showProof}>Mint certificate</Button>
            </SimpleGrid>

            {showProof && (
                <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Proof generated!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        5dsdf436sfg346s34sgf43{' '}
                        <IconButton
                            aria-label="copy"
                            colorScheme={'green'}
                            size={'xs'}
                            variant="outline"
                            icon={<CopyIcon />}
                        />
                    </AlertDescription>
                </Alert>
            )}
        </Stack>
    );
}

export default App;
