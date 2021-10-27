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

import { ExpProof, proveExp, verifyExp } from '../../src/exp/exp.js'
import { secp256k1, tomEdwards256 } from '../../src/curves/instances.js'

import { generatePedersenParams } from '../../src/commit/pedersen.js'
import { rnd } from '../../src/bignum/big.js'
import { serdeTest } from '../serde.test.js'
import { WeierstrassGroup } from '../../src/curves/weier.js'

export async function testExp(curve: WeierstrassGroup = secp256k1): Promise<boolean> {
    const s = rnd(curve.order),
        P = curve.generator().mul(curve.randomScalar()),
        Q = P.mul(curve.newScalar(s)),
        coordQ = Q.toAffine()
    if (!coordQ) {
        throw new Error('Q is at infinity')
    }
    const secLevel = 80,
        { x, y } = coordQ,
        paramsTom = generatePedersenParams(tomEdwards256),
        Cx = paramsTom.commit(x),
        Cy = paramsTom.commit(y),
        paramsNIST = generatePedersenParams(curve, P),
        Cs = paramsNIST.commit(s),
        proof = await proveExp(paramsNIST, paramsTom, s, Cs, Q, Cx, Cy, secLevel),
        res = await verifyExp(paramsNIST, paramsTom, Cs.p, Cx.p, Cy.p, proof, secLevel)
    if (!res) {
        return false
    }

    for (const p of proof) {
        if (!serdeTest(ExpProof, p)) {
            return false
        }
    }

    return true
}
