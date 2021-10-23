import React, { useState } from 'react';
import './App.css';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    FormControl,
    FormLabel,
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
    Image,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { CopyIcon } from '@chakra-ui/icons';
import Certificate from './Certificate';

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
    const [showCertificate, setShowCertificate] = useState(false);

    const { data } = useQuery(QUERY, {
        variables: { balance_gt: minBalance, balance_lt: maxBalance },
    });

    // const { loading, error, data } = useQuery(QUERY);

    // console.log(loading);
    console.log(data);

    return (
        <Stack>
            <img src="./logo.svg" alt="" />

            <FormControl id="min" isRequired>
                <FormLabel mt={10}>
                    Minimum USDC Balance {setMinBalance}
                </FormLabel>
                <NumberInput
                    defaultValue={100}
                    min={0}
                    color={'tomato'}
                    variant="filled"
                    onChange={(e: any) => setMinBalance(e)}
                >
                    <NumberInputField style={{ fontWeight: 'bold' }} />
                </NumberInput>
            </FormControl>

            <FormControl id="max">
                <FormLabel>Maximum USDC Balance</FormLabel>
                <NumberInput
                    color={'tomato'}
                    variant="filled"
                    min={0}
                    onChange={(e: any) => setMaxBalance(e)}
                >
                    <NumberInputField style={{ fontWeight: 'bold' }} />
                </NumberInput>
            </FormControl>

            <FormControl id="address">
                <FormLabel>Size of Address Set</FormLabel>
                <NumberInput
                    color={'tomato'}
                    variant="filled"
                    defaultValue={200}
                    min={1}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl id="amount">
                <FormLabel>Your address</FormLabel>
                <NumberInput min={0} mb={10}>
                    <Input
                        color={'tomato'}
                        variant="filled"
                        placeholder="0xBc11295936Aa79d594139de1B2e12629414F3BDB"
                        style={{ fontWeight: 'bold' }}
                    />
                </NumberInput>
            </FormControl>

            <SimpleGrid columns={2} spacing={5}>
                <Button
                    variant="solid"
                    colorScheme="orange"
                    onClick={() => setShowProof(true)}
                >
                    Generate Proof
                </Button>

                <Button
                    disabled={!showProof}
                    onClick={() => setShowCertificate(true)}
                >
                    Mint certificate
                </Button>
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
            <Certificate
                isOpen={showCertificate}
                isClose={() => setShowCertificate(false)}
            />
        </Stack>
    );
}

export default App;
