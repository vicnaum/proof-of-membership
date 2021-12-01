import { utils } from 'ethers'

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

    await Promise.all(promisess)
    // const responses = await Promise.all(promisess);
    // const accountPubKey = new Map<string, string>();
    // @ts-ignore
    return [...accountTx.keys()].map((acc) => {
        return accountTx.get(acc)!;
    });
}

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
}

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
}

const getPublicKeys = async (wallets: any): Promise<any> => {
    const walletsTransactionsHashes = await retrieveTxnsHash(wallets)
    console.log('walletsTransactionsHashes:', walletsTransactionsHashes)

    const walletTransactions = await getWalletsTxns(walletsTransactionsHashes)
    console.log('walletTransactions:', walletTransactions)

    const walletsPublicKeys = getWalletsPublicKeys(walletTransactions)
    console.log('walletsPublicKeys:', walletsPublicKeys)

    return walletsPublicKeys
}

export default getPublicKeys