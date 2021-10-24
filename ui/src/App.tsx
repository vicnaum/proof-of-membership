import React, { useEffect, useState } from 'react';
import './App.css';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    FormControl,
    FormLabel,
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
import { gql, useLazyQuery } from '@apollo/client';
import { CopyIcon } from '@chakra-ui/icons';
import Certificate from './Certificate';
import { postAddressSet, postAddressSetBody } from './postAddressSet';
import { ethers, utils } from 'ethers';

const QUERY = gql`
    query GetUsers($balance_gt: Int!, $balance_lt: Int!, $size: Int!) {
        users(
            first: $size
            where: { balance_gt: $balance_gt, balance_lt: $balance_lt }
        ) {
            address
            balance
        }
    }
`;

const App = () => {
    const [minBalance, setMinBalance] = useState<number>(100);
    const [maxBalance, setMaxBalance] = useState<number>(200);
    const [size, setSize] = useState<number>(200);
    const [showProof, setShowProof] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [membershipProof, setMembershipProof] = useState('345345tsdfga');
    const [proofElements, setProofElements] = useState<
        postAddressSetBody | any
    >({});

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner();
    // @ts-ignore
    const accounts = window?.ethereum
        ?.request({
            method: 'eth_requestAccounts',
        })
        .then(() => {
            console.log('accounts', accounts[0]);
            if (accounts.length && typeof accounts[0] === 'string') {
                // return accounts[0];
            }
        });

    const [getUsers, { data, loading }] = useLazyQuery(QUERY, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        console.log('data', data);
        if (data) {
            const set: postAddressSetBody = {
                proofHash: 'dfsdf',
                minUsdc: minBalance,
                maxUsdc: maxBalance,
                setSize: size,
                addressSet: { data },
            };

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            console.log('data', data);
            const accountTx = new Map<string, string>();
            const txAccount = new Map<string, string>();
            const retrieveTxnsPromises: Promise<any>[] = data.users.map(
                (row: any) =>
                    fetch(
                        `https://api.etherscan.io/api?module=account&action=txlist&address=${row.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=9SQ26N4VERJTXBWXQ4H94X4X98UZ4VFPHB`,
                        requestOptions,
                    ).then(async (response) => {
                        const res = await response.json();
                        accountTx.set(row.address, res.result[0].hash);
                        txAccount.set(res.result[0].hash, row.address);
                    }),
            );
            // {"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x773b94e1e2381f0c1f0b366245145a31369a7311e53778e4b085a203c64f19a3"],"id":0}
            (async () => {
                const responses = await Promise.all(retrieveTxnsPromises);
                const accountPubKey = new Map<string, string>();
                // @ts-ignore
                const txHashesNeeded = [...accountTx.keys()].map((acc) => {
                    return accountTx.get(acc)!;
                });

                const jsonRpcRequests = txHashesNeeded.map((hash, id) => {
                    return `{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["${hash}"],"id":${id}}`;
                });

                console.log('[' + jsonRpcRequests + ']');

                // @ts-ignore
                const rpcResponse = fetch(
                    'https://eth-mainnet.alchemyapi.io/v2/wCzaTDAfLI6S5Mdc2suiOXcpf7Xzlk_w',
                    {
                        method: 'POST',
                        body: '[' + jsonRpcRequests + ']',
                    },
                )
                    .then((res: any) => res.json())
                    .then((data: any) => {
                        console.log(data);

                        data.map((entity: any) => {
                            const signature = utils.joinSignature({
                                v: entity.result.v,
                                r: entity.result.r,
                                s: entity.result.s,
                            });
                            const signer = utils.recoverPublicKey(
                                entity.result.hash,
                                signature,
                            );
                            console.log(signer);
                        });
                    });
            })();

            // const txToAccount = responses.map((res) => ({
            //     account: res.data.account,
            //     txHash: res.data.txns[0].hash,
            // }));

            postAddressSet(set).then((r: any) => {
                console.log(r);
                setMembershipProof(r.metadata.id);
                setShowProof(true);
            });
        }
    }, [data]);

    return (
        <Stack>
            <FormControl id="min" isRequired>
                <FormLabel mt={10}>Minimum USDC Balance</FormLabel>
                <NumberInput
                    min={0}
                    color={'tomato'}
                    variant="filled"
                    onChange={(e: string) => setMinBalance(parseInt(e))}
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
                    onChange={(e: string) => setMaxBalance(parseInt(e))}
                >
                    <NumberInputField style={{ fontWeight: 'bold' }} />
                </NumberInput>
            </FormControl>

            <FormControl id="address">
                <FormLabel>Size of Address Set</FormLabel>
                <NumberInput
                    color={'tomato'}
                    variant="filled"
                    min={1}
                    max={5}
                    onChange={(e: string) => {
                        setSize(parseInt(e));
                        console.log(size);
                    }}
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
                <NumberInput
                    min={0}
                    mb={10}
                    onChange={(e: string) => {
                        // setSize(parseInt(e));
                        console.log(e);
                    }}
                >
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
                    isLoading={loading}
                    onClick={() =>
                        getUsers({
                            variables: {
                                balance_gt: minBalance,
                                balance_lt: maxBalance,
                                size: size,
                            },
                        })
                    }
                >
                    Generate Proof
                </Button>

                <Button
                    disabled={!showProof}
                    onClick={() => {
                        setProofElements({
                            minBalance: minBalance,
                            maxBalance: maxBalance,
                            size: size,
                        });
                        setShowCertificate(true);
                    }}
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
                        {membershipProof} {console.log(proofElements)}
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
                membershipProof={membershipProof}
            />
        </Stack>
    );
};

export default App;
