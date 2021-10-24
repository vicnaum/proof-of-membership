import { utils } from "ethers";

async function main() {
  const a = {
    blockHash:
      "0xc3eebf6c752620094907ba3345e01c83073df634e37d8e7a10fd3c5ad8ade6da",
    blockNumber: "0x73fe59",
    from: "0xccac7e2d137ca59d7de3c60970f03d56c09c44db",
    gas: "0x5208",
    gasPrice: "0x12a05f200",
    hash: "0x0a7de924e6027b35f0c3a8bbf88a921a32cc16be2a212cc9274d77c7c9662841",
    input: "0x",
    nonce: "0x3b",
    to: "0x00cab46a7561cad055a8ac9b3b328806ea3c4aeb",
    transactionIndex: "0x88",
    value: "0x16345785d8a0000",
    type: "0x0",
    v: "0x25",
    r: "0xf6df878e11ac580268f9254beb1bba685e7e6fb4f7ff2faf89cda4abb5db9c13",
    s: "0x2923cf66fb9195ac09e93330af68cfb6e04aaf21d10b81559f6fcb6fd075759b",
  };

  const signature = utils.joinSignature({ v: a.v, r: a.r, s: a.s });
  const signer = utils.recoverPublicKey(a.hash, signature);
  
  console.log(signer);
}

main();
