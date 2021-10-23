import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
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

const QUERY = gql`
    query GetUsers {
        users(first: 200, where: { balance_gt: 100, balance_lt: 500 }) {
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
    const [setMinBalance, minBalance] = useState();
    const [setMaxBalance, maxBalance] = useState();

    // const [searchPosts, { data }] = useLazyQuery(SEARCH_POSTS, {
    //     variables: { balance_gt: minBalance, balance_lt: maxBalance },
    // });

    const { loading, error, data } = useQuery(QUERY);

    console.log(loading);
    console.log(data);

    return (
        <Stack>
            <Heading>Zero-Knowladge Proof of Membership</Heading>
            <FormControl id="amount" isRequired>
                <FormLabel>Min USD Balance {setMinBalance}</FormLabel>
                <NumberInput
                    defaultValue={100}
                    min={0}
                    onChange={(e: any) => minBalance(e)}
                >
                    <NumberInputField />
                </NumberInput>
            </FormControl>

            <FormControl id="amount">
                <FormLabel>Max USDC Balance</FormLabel>
                <NumberInput min={0} onChange={(e: any) => maxBalance(e)}>
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
                <FormLabel>Max USDC Balance</FormLabel>
                <NumberInput min={0}>
                    <Input placeholder="0xBc11295936Aa79d594139de1B2e12629414F3BDB" />
                </NumberInput>
            </FormControl>

            <SimpleGrid columns={2} spacing={5}>
                <Button disabled>Generate Proof</Button>

                <Button disabled>Download certificate</Button>
            </SimpleGrid>
        </Stack>
    );
}

export default App;
