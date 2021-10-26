/**
 * Copyright 2021 Cloudflare Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    SignatureProofList,
    SystemParametersList,
    generateParamsList,
    keyToIntFromEthers,
    proveSignatureList,
    verifySignatureList,
} from '../src/zkpAttestList.js'

import { Wallet, utils } from "ethers";

import { serdeTest } from './serde.test.js'

export async function testZKP(): Promise<boolean> {
    const msg = new TextEncoder().encode("kilroy was here");
    const msgHash = new Uint8Array(await crypto.subtle.digest("SHA-256", msg));
  
    const wallet = Wallet.createRandom();
  
    const secp256k1SigningKey = new utils.SigningKey(wallet.privateKey);
    const sig = secp256k1SigningKey.signDigest(msgHash);
    const signature = hexStringToArrayBuffer(utils.joinSignature(sig));

    const testKey = await keyToIntFromEthers(wallet.publicKey)

    const testArray = [testKey, BigInt(4), BigInt(5), BigInt(6), BigInt(7), BigInt(8)]
    const params = generateParamsList()
    const pkBytes = hexStringToArrayBuffer(wallet.publicKey);

    const proof = await proveSignatureList(params, msgHash, signature, pkBytes, 0, testArray)
    const res = await verifySignatureList(params, msgHash, testArray, proof)
    if (!res) {
        return false
    }

    if (!serdeTest(SignatureProofList, proof)) {
        return false
    }

    if (!serdeTest(SystemParametersList, params)) {
        return false
    }

    return true
}

export function hexStringToArrayBuffer(hexString) {
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, "");
  
    // ensure even number of characters
    if (hexString.length % 2 != 0) {
      console.log(
        "WARNING: expecting an even number of characters in the hexString"
      );
    }
  
    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
      console.log("WARNING: found non-hex characters", bad);
    }
  
    // split the string into pairs of octets
    var pairs = hexString.match(/[\dA-F]{2}/gi);
  
    // convert the octets to integers
    var integers = pairs.map(function (s) {
      return parseInt(s, 16);
    });
  
    var array = new Uint8Array(integers);
  
    return array;
  }
  