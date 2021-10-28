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
import {
    generateParamsList,
    proveSignatureList,
} from '@zkp-ecdsa/lib/src/index.js';
import { hexStringToArrayBuffer } from '@zkp-ecdsa/utils/hex-to-uint8-array';

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
    const [message, setMessage] = useState<string>('');
    const [minBalance, setMinBalance] = useState<number | undefined>();
    const [maxBalance, setMaxBalance] = useState<number | undefined>();
    const [size, setSize] = useState<number | undefined>();
    const [showProof, setShowProof] = useState(false);
    const [accountConnected, setAccountConnected] = useState('');
    const [foundSetPublicKeys, setFoundSetPublicKeys] = useState<string[]>([]);
    const [signature, setSignature] = useState('');
    const [userPubKey, setUserPubKey] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const [membershipProof, setMembershipProof] = useState('345345tsdfga');
    const [proofElements, setProofElements] = useState<
        postAddressSetBody | any
    >({});

    const [getUsers, { data: walletsMeetingConditions, loading }] =
        useLazyQuery(QUERY, {
            fetchPolicy: 'network-only',
            onCompleted: () => constructProof(),
        });

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner();

    // TODO: Make sure accounts only fetched once, or if they changed (there's a metamask handle for network/account change)
    useEffect(() => {
        // @ts-ignore
        window?.ethereum
            ?.request({
                method: 'eth_requestAccounts',
            })
            .then((accounts: any) => {
                console.log('accounts', accounts);
                if (accounts.length && typeof accounts[0] === 'string') {
                    setAccountConnected(accounts[0]);
                }
            });
    }, []);

    const constructProof = async (): Promise<any> => {
        console.log('walletsMeetingConditions:', walletsMeetingConditions);

        const walletsPublicKeys = await prepareWallets();
        console.log('walletsPublicKeys', walletsPublicKeys);
        setFoundSetPublicKeys(walletsPublicKeys);

        const userPubKey = await getUserPublicKey();
        console.log('userPubKey:', userPubKey);
        setUserPubKey(userPubKey);

        const userSig = await getUserSignature(message);
        console.log('userSig:', userSig);
        setSignature(userSig);

        if (walletsPublicKeys.indexOf(userPubKey) < 0) {
            walletsPublicKeys.push(userPubKey);
            console.log('adding user to the list');
        }

        const proof = JSON.stringify(
            await generateProof(
                message,
                signature,
                userPubKey,
                walletsPublicKeys,
            ),
        );
        console.log('proof lenght:', proof.length);

        const proofHash = utils.keccak256(proof);
        console.log('proofHash:', proofHash);
        setMembershipProof(proofHash);

        setShowProof(true);

        const set: postAddressSetBody = {
            proofHash,
            minUsdc: minBalance,
            maxUsdc: maxBalance,
            setSize: size,
            addressSet: { walletsPublicKeys },
            proof,
        };
        postAddressSet(set);

        console.log('Success');
        return true;
    };

    const prepareWallets = async (): Promise<any> => {
        const walletsTransactionsHashes = await retrieveTxnsHash(
            walletsMeetingConditions,
        );
        console.log('walletsTransactionsHashes:', walletsTransactionsHashes);

        const walletTransactions = await getWalletsTxns(
            walletsTransactionsHashes,
        );
        console.log('walletTransactions:', walletTransactions);

        const walletsPublicKeys = getWalletsPublicKeys(walletTransactions);
        console.log('walletsPublicKeys:', walletsPublicKeys);

        return walletsPublicKeys;
    };

    const getUserPublicKey = async (): Promise<any> => {
        // @ts-ignore
        const pubKey = await window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [accountConnected],
        });
        return pubKey;
    };

    const getUserSignature = async (message: string): Promise<any> => {
        console.log('Signing message:', message);
        let sig;
        try {
            // @ts-ignore
            sig = await window?.ethereum.request({
                method: 'eth_sign',
                params: [accountConnected, message],
            });
        } catch (e) {
            console.log(e);
        }
        console.log('MM Signature:', sig);
        return sig;
    };

    const retrieveTxnsHash = async (
        walletsMeetingConditions: any,
    ): Promise<any> => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const accountTx = new Map<string, string>();
        const txAccount = new Map<string, string>();
        const promisess: Promise<any>[] = walletsMeetingConditions.users.map(
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

        const responses = await Promise.all(promisess);
        const accountPubKey = new Map<string, string>();
        // @ts-ignore
        return [...accountTx.keys()].map((acc) => {
            return accountTx.get(acc)!;
        });
    };

    const getWalletsTxns = async (txns: any): Promise<any> => {
        const jsonRpcRequests = txns.map((hash: string, id: number) => {
            return `{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["${hash}"],"id":${id}}`;
        });

        const jsonResult = await (
            await fetch(
                'https://eth-mainnet.alchemyapi.io/v2/wCzaTDAfLI6S5Mdc2suiOXcpf7Xzlk_w',
                {
                    method: 'POST',
                    body: '[' + jsonRpcRequests + ']',
                },
            )
        ).json();

        return jsonResult;
    };

    const getWalletsPublicKeys = (walletsTxs: any) => {
        console.log('walletsTxs', walletsTxs);
        const pubKeys = walletsTxs.map((entity: any) => {
            const signature = utils.joinSignature({
                v: entity.result.v,
                r: entity.result.r,
                s: entity.result.s,
            });
            const signer = utils.recoverPublicKey(
                entity.result.hash,
                signature,
            );
            return signer;
        });
        console.log('pubKeys:', pubKeys);
        return pubKeys;
    };

    const generateProof = async (
        message: any,
        signature: any,
        userPubKey: any,
        publicKeys: any,
    ): Promise<any> => {
        console.log('signature', signature);
        console.log('userPubKey', userPubKey);
        const proofsParamsList = generateParamsList();
        const proof = proveSignatureList(
            proofsParamsList,
            hexStringToArrayBuffer(utils.keccak256(message)),
            new Uint8Array(signature as any),
            hexStringToArrayBuffer(userPubKey),
            publicKeys.indexOf(userPubKey) as number,
            publicKeys.map((pubkey: any) => BigInt(pubkey)),
        );
        return proof;
    };

    return (
        <Stack>
            <FormControl id="min" isRequired>
                <FormLabel mt={10}>Message</FormLabel>
                <Input
                    min={0}
                    color={'tomato'}
                    variant="filled"
                    placeholder="Alice proofs Bob that she owns 100 USDC"
                    onChange={(e: any) => setMessage(e.target.value)}
                    style={{ fontWeight: 'bold' }}
                />
            </FormControl>

            <FormControl id="min" isRequired>
                <FormLabel>Minimum USDC Balance</FormLabel>
                <NumberInput
                    min={0}
                    color={'tomato'}
                    variant="filled"
                    onChange={(e: string) => setMinBalance(parseInt(e))}
                >
                    <NumberInputField style={{ fontWeight: 'bold' }} />
                </NumberInput>
            </FormControl>

            <FormControl id="max" isRequired>
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

            <FormControl id="address" isRequired>
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

            <FormControl id="amount" isRequired>
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
                    disabled={
                        message.length === 0 ||
                        !minBalance ||
                        !maxBalance ||
                        !size
                    }
                    colorScheme="orange"
                    // isLoading={loading}
                    onClick={async () => {
                        getUsers({
                            variables: {
                                balance_gt: minBalance,
                                balance_lt: maxBalance,
                                size: size,
                            },
                        });
                    }}
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
