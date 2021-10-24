import {
  generateParamsList,
  proveSignatureList,
  verifySignatureList,
} from "../zkp-ecdsa/lib/src/index.js";
import isomCrypto from "node-webcrypto-shim";
import { Wallet, utils } from "ethers";
import { hexStringToArrayBuffer } from "./utils/hex-to-uint8-array.js";

global.crypto = isomCrypto;

async function main() {
  // Message to be signed.
  const msg = new TextEncoder().encode("kilroy was here");
  const msgHash = new Uint8Array(await crypto.subtle.digest("SHA-256", msg));

  const wallet = Wallet.createRandom();

  const secp256k1SigningKey = new utils.SigningKey(wallet.privateKey);
  const sig = secp256k1SigningKey.signDigest(msgHash);
  console.log(`Ethers signed message: ${utils.joinSignature(sig)}`);

  // Sign a message as usual.
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  const rawSig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    keyPair.privateKey,
    msg
  );
  console.log(rawSig);
  const signature = new Uint8Array(rawSig);

  console.log(signature);

  // Add the public key to the list,
  console.log("lkijhg");
  const testPubKey = BigInt(wallet.publicKey);
  const listKeys = [
    testPubKey,
    BigInt(4),
    BigInt(5),
    BigInt(6),
    BigInt(7),
    BigInt(8),
  ];

  // Create a zero-knowledge proof of the signature.
  console.log(`Generating proof ...`);
  const params = generateParamsList();
  console.log(`Proving list ...`);
  console.log("Wallet pubkey: ", wallet.publicKey);
  console.log("Wallet pubkey buffer: : ", Buffer.from(wallet.publicKey, "hex"));

  const proof = await proveSignatureList(
    params,
    msgHash,
    signature,
    hexStringToArrayBuffer(wallet.publicKey),
    0,
    listKeys
  );

  // Verify that zero-knowledge proof is valid.
  console.log(`Veryfing ...`);
  const valid = await verifySignatureList(params, msgHash, listKeys, proof);
  console.log("Is valid", valid);
  console.assert(valid);
}

main();
