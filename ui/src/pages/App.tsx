import { ChangeEvent, useEffect, useState } from 'react';
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
import Certificate from '../components/Certificate';
import { postAddressSet, postAddressSetBody } from '../lib/postAddressSet';
import { utils } from 'ethers';
import {
    generateParamsList,
    proveSignatureList,
} from '@zkp-ecdsa/lib/src/index.js';
import { hexStringToArrayBuffer } from '@zkp-ecdsa/utils/hex-to-uint8-array';
import getPublicKeys from '../lib/getPublicKeys'
import Web3 from 'web3'

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
    const [isConnecting, setIsConnecting] = useState<boolean>(false)
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false)
    const [accountConnected, setAccountConnected] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [minBalance, setMinBalance] = useState<number>(0)
    const [maxBalance, setMaxBalance] = useState<number>(0)
    const [size, setSize] = useState<number>(1)
    const [showProof, setShowProof] = useState<boolean>(false)
    const [showCertificate, setShowCertificate] = useState<boolean>(false)
    const [membershipProof, setMembershipProof] = useState<string>('')
    const [isConstructProof, setConstructProof] = useState<boolean>(false)

    const [getUsers, { data: walletsMeetingConditions, loading }] =
        useLazyQuery(QUERY, {
            fetchPolicy: 'network-only',
            onCompleted: () => constructProof()
        });

    useEffect(() => {
        let connectedAccounts = async () => {
            const { ethereum } = window
            if (ethereum && ethereum.isMetaMask) {
                let web3 = new Web3(ethereum)
                let accounts = await web3.eth.getAccounts()
                if (accounts.length > 0) setAccountConnected(accounts[0])
            }
        }
        connectedAccounts()
    })

    useEffect(() => {
        const { ethereum } = window
        if (ethereum && ethereum.isMetaMask) {
            setIsMetaMaskInstalled(true)
            ethereum.on('chainChanged', () => window.location.reload())
            ethereum.on('accountsChanged', (accounts: string[]) => {
                accounts.length > 0 ? setAccountConnected(accounts[0]) : setAccountConnected('')
            })
        }

        const removeListeners = (ethereum: any) => {
            ethereum.removeListener('chainChanged', () => console.log('chainChanged Listener Removed'))
            ethereum.removeListener('accountsChanged', () => console.log('accountsChanged Listener Removed'))
        }

        return () => removeListeners(ethereum)
    }, [])

    const connectMetamask = async (): Promise<void> => {
        if (isMetaMaskInstalled) {
            setIsConnecting(true)
            const { ethereum } = window
            let accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setAccountConnected(accounts[0])
            console.log('connected account: ', accounts[0])
            setIsConnecting(false)
        } else {
            window.open('https://metamask.io/', '_blank')
        }
    }

    const constructProof = async (): Promise<void> => {
        setConstructProof(true)
        console.log('walletsMeetingConditions:', walletsMeetingConditions)

        const walletsPublicKeys = await getPublicKeys(walletsMeetingConditions)
        console.log('walletsPublicKeys', walletsPublicKeys)

        const userPubKey = (await getPublicKeys({ users: [{ address: accountConnected }] }))[0]
        console.log('userPubKey:', userPubKey)

        const userSig = await getUserSignature(message)
        console.log('userSig:', userSig)

        if (walletsPublicKeys.indexOf(userPubKey) < 0) {
            walletsPublicKeys.push(userPubKey)
            console.log('adding user to the list')
        }

        // TODO Check, since both works.
        // console.log('utils.toUtf8Bytes(userSig):', utils.toUtf8Bytes(userSig))
        // console.log('Uint8Array.from(userSig):', Uint8Array.from(userSig))

        const proofsParamsList = generateParamsList()
        const proofObj = await proveSignatureList(
            proofsParamsList,
            hexStringToArrayBuffer(utils.keccak256(utils.toUtf8Bytes(message))),
            utils.toUtf8Bytes(userSig), // look at comment above
            // Uint8Array.from(userSig),
            hexStringToArrayBuffer(userPubKey),
            walletsPublicKeys.indexOf(userPubKey) as number,
            walletsPublicKeys.map((pubkey: any) => BigInt(pubkey)),
        )

        const proof = JSON.stringify(proofObj)
        console.log('proof length:', proof.length)

        const proofHash = utils.keccak256(utils.toUtf8Bytes(proof))
        console.log('proofHash:', proofHash)
        setMembershipProof(proofHash)


        const set: postAddressSetBody = {
            proofHash,
            minUsdc: minBalance,
            maxUsdc: maxBalance,
            setSize: size,
            addressSet: { walletsPublicKeys },
            proof, // Free users cannot create a record over 500kb
        }

        let isPostSuccess = await postAddressSet(set)
        if (isPostSuccess) setShowProof(true)

        setConstructProof(false)
        console.log('Done')
    }

    const getUserSignature = async (message: string): Promise<any> => {
        console.log('Signing message:', message)
        try {
            const { ethereum } = window

            // let sig = await ethereum.request({
            //     method: 'eth_sign',
            //     params: [accountConnected, utils.keccak256(utils.toUtf8Bytes(message))],
            //     // params: [accountConnected, message],
            // })

            let sig = await ethereum.request({
                method: 'personal_sign',
                params: [accountConnected, message],
            })

            console.log('User Signature:', sig)
            return sig
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Stack>
            <FormControl id="min" isRequired>
                <FormLabel mt={10}>Message</FormLabel>
                <Input
                    isDisabled={isConstructProof}
                    min={0}
                    color={'tomato'}
                    variant="filled"
                    placeholder="Alice proofs Bob that she owns 100 USDC"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                    style={{ fontWeight: 'bold' }}
                />
            </FormControl>

            <FormControl id="min" isRequired>
                <FormLabel>Minimum USDC Balance</FormLabel>
                <NumberInput
                    isDisabled={isConstructProof}
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
                    isDisabled={isConstructProof}
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
                    isDisabled={isConstructProof}
                    color={'tomato'}
                    variant="filled"
                    min={1}
                    max={5}
                    onChange={(e: string) => setSize(parseInt(e))}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl id="yourAddress" isRequired>
                <FormLabel>Your address</FormLabel>
                <Input
                    isDisabled={true}
                    color={'tomato'}
                    variant="filled"
                    placeholder={accountConnected ? accountConnected : 'Connect Metamask'}
                    style={{ fontWeight: 'bold' }}
                />
            </FormControl>

            <Button
                variant="solid"
                disabled={isConnecting || !!accountConnected}
                colorScheme="orange"
                isLoading={isConnecting}
                onClick={() => connectMetamask()}
            >
                {isMetaMaskInstalled ? 'Connect' : 'Install'} Metamask
            </Button>

            <SimpleGrid columns={2} spacing={5}>
                <Button
                    variant="solid"
                    disabled={
                        isConstructProof ||
                        accountConnected.length === 0 ||
                        message.length === 0 ||
                        !minBalance ||
                        !maxBalance ||
                        !size
                    }
                    colorScheme="orange"
                    isLoading={isConstructProof || loading}
                    onClick={() => {
                        getUsers({
                            variables: {
                                balance_gt: minBalance,
                                balance_lt: maxBalance,
                                size: size,
                            }
                        })
                    }}
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
                        {membershipProof}
                        <IconButton
                            aria-label="copy"
                            colorScheme={'green'}
                            size={'xs'}
                            variant="outline"
                            icon={<CopyIcon />}
                            onClick={() => navigator.clipboard.writeText(membershipProof)}
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
