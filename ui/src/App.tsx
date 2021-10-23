import React from 'react';
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

function App() {
    return (
        <Stack>
            <Heading>Zero-Knowladge Proof of Membership</Heading>
            <FormControl id="amount" isRequired>
                <FormLabel>Min USD Balance</FormLabel>
                <NumberInput defaultValue={100} min={0}>
                    <NumberInputField />
                </NumberInput>
            </FormControl>

            <FormControl id="amount">
                <FormLabel>Max USDC Balance</FormLabel>
                <NumberInput min={0}>
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
