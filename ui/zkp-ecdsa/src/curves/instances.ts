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

import { Group } from './group.js'
import { WeierstrassGroup } from './weier.js'
import { jsonObject } from 'typedjson'

export const secp256k1 = new WeierstrassGroup(
    'secp256k1',
    BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'),
    BigInt('0x0000000000000000000000000000000000000000000000000000000000000000'),
    BigInt('0x0000000000000000000000000000000000000000000000000000000000000007'),
    BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141'),
    [
        BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'),
        BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8'),
    ]
)

// tomEdwards256: ax^2+y^2 = 1 + dx^2y^2
export const tomEdwards256 = new WeierstrassGroup(
    'tomEdwards256',
    BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494337'),
    BigInt('0'),
    BigInt('7'),
    BigInt('115792089237316195423570985008687907853269984665640564039457584007908834671663'),
    [
        BigInt('78026902008297824509709579663571890787184771476327813915676535855501198592151'),
        BigInt('48326479491039320890938009910231643833588253676904532147209089159274188120223'),
    ]
)

export const ALL_GROUPS: Array<Group> = [tomEdwards256, secp256k1]

jsonObject({
    initializer: (src: WeierstrassGroup, _raw: WeierstrassGroup): WeierstrassGroup => {
        switch (src.name) {
            case secp256k1.name:
                return secp256k1
            case tomEdwards256.name:
                return tomEdwards256
            default:
                throw new Error(`invalid group name: ${src.name}`)
        }
    },
})(WeierstrassGroup)