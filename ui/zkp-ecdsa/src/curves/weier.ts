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

/* eslint no-use-before-define: ['error', { classes: false }] */

import { fromBytes, invMod, posMod, serdeBigInt, toBytes, verifyPosRange } from '../bignum/big.js'
import { jsonMember, jsonObject, toJson } from 'typedjson'

import { Group } from './group.js'

@toJson
export class WeierstrassGroup extends Group {
    readonly _brandWeierstrassGroup = ''
    constructor(
        public readonly name: string,
        public readonly p: bigint, // prime modulus.
        public readonly a: bigint, // the a parameter, fixed to a=-3.
        public readonly b: bigint, // the b parameter.
        public readonly order: bigint, // the order of the group.
        public readonly gen: [bigint, bigint] // generator of the group.
    ) {
        super(name, p, order)
        verifyPosRange(a, p)
        verifyPosRange(b, p)
        verifyPosRange(gen[0], p)
        verifyPosRange(gen[1], p)

        // if (posMod(a, p) !== p - BigInt(3)) {
        //     throw new Error('only supports a=-3')
        // }

        const generator = this.generator()
        if (!this.isOnGroup(generator)) {
            throw new Error('generator not on group')
        }
    }
    identity(): WeierstrassPoint {
        return new WeierstrassPoint(this, BigInt(0), BigInt(1), BigInt(0))
    }
    generator(): WeierstrassPoint {
        return new WeierstrassPoint(this, this.gen[0], this.gen[1], BigInt(1))
    }
    isOnGroup(pt: WeierstrassPoint): boolean {
        // E: Y^2*Z = X^3 + a*X*Z^2 + b*Z^3
        const { p, a, b } = this,
            { x, y, z } = pt,
            y2 = (y * y) % p,
            y2z = (y2 * z) % p,
            x3 = (x * x * x) % p,
            ax = (a * x) % p,
            z2 = (z * z) % p,
            axz2 = (ax * z2) % p,
            z3 = (z2 * z) % p,
            bz3 = (b * z3) % p,
            t5 = posMod(y2z - (x3 + axz2 + bz3), p)
        return this.eq(pt.group) && t5 === BigInt(0)
    }
    sizePointBytes(): number {
        return 1 + 2 * this.sizeFieldBytes() // uncompressed points
    }
    deserializePoint(a: Uint8Array): WeierstrassPoint {
        if (a.length === 1 && a[0] === 0) {
            return this.identity()
        } else if (a.length === this.sizePointBytes() && a[0] === 0x04) {
            const coordSize = this.sizeFieldBytes(),
                x = fromBytes(a.slice(1, 1 + coordSize)),
                y = fromBytes(a.slice(1 + coordSize)),
                p = new WeierstrassPoint(this, x, y)
            if (!this.isOnGroup(p)) {
                throw new Error('point not in group')
            }
            return p
        } else {
            throw new Error('error deserializing Point')
        }
    }
}

@jsonObject({
    beforeSerialization: 'toAffine',
    onDeserialized: 'afterJson',
})
@toJson
export class WeierstrassPoint extends Group.Point {
    readonly _brandWeierstrassPoint = ''
    @jsonMember({ constructor: Group, isRequired: true }) readonly group: WeierstrassGroup
    @jsonMember(serdeBigInt) public x: bigint
    @jsonMember(serdeBigInt) public y: bigint
    public z: bigint
    constructor(g: WeierstrassGroup, x: bigint, y: bigint, z?: bigint) {
        super()
        this.group = g
        this.x = x
        this.y = y
        this.z = typeof z !== 'undefined' ? z : BigInt(1)
    }
    toString(): string {
        return Group.Point.toStringCoords([
            { name: 'x', value: this.x },
            { name: 'y', value: this.y },
            { name: 'z', value: this.z },
        ])
    }
    isIdentity(): boolean {
        return this.x === BigInt(0) && this.y !== BigInt(0) && this.z === BigInt(0)
    }
    eq(pt: this): boolean {
        const { group: g0, x: x0, y: y0, z: z0 } = this,
            { group: g1, x: x1, y: y1, z: z1 } = pt,
            x0z1 = (x0 * z1) % g0.p,
            x1z0 = (x1 * z0) % g0.p,
            y0z1 = (y0 * z1) % g0.p,
            y1z0 = (y1 * z0) % g0.p
        return g0.eq(g1) && x0z1 === x1z0 && y0z1 === y1z0
    }
    neg(): this {
        const y = posMod(-this.y, this.group.p)
        return new WeierstrassPoint(this.group, this.x, y, this.z) as this
    }
    dbl(): this {
        return this.add(this)
    }
    add(pt: this): this {
        this.isCompatPoint(pt)
        const { x: x1, y: y1, z: z1 } = this,
            { x: x2, y: y2, z: z2 } = pt,
            { p, a, b } = this.group
        let x3: bigint, y3: bigint, z3: bigint
        let t0: bigint, t1: bigint, t2: bigint, t3: bigint, t4: bigint, t5: bigint
        const b3 = BigInt(3)*b

        t0 = (x1*x2)%p
        t1 = (y1*y2)%p
        t2 = (z1*z2)%p
        t3 = (x1+y1)%p
        t4 = (x2+y2)%p
        t3 = (t3*t4)%p
        t4 = (t0+t1)%p
        t3 = (t3-t4)%p
        t4 = (x1+z1)%p
        t5 = (x2+z2)%p
        t4 = (t4*t5)%p
        t5 = (t0+t2)%p
        t4 = (t4-t5)%p
        t5 = (y1+z1)%p
        x3 = (y2+z2)%p
        t5 = (t5*x3)%p
        x3 = (t1+t2)%p
        t5 = (t5-x3)%p
        z3 = (a*t4)%p
        x3 = (b3*t2)%p
        z3 = (x3+z3)%p
        x3 = (t1-z3)%p
        z3 = (t1+z3)%p
        y3 = (x3*z3)%p
        t1 = (t0+t0)%p
        t1 = (t1+t0)%p
        t2 = (a*t2)%p
        t4 = (b3*t4)%p
        t1 = (t1+t2)%p
        t2 = (t0-t2)%p
        t2 = (a*t2)%p
        t4 = (t4+t2)%p
        t0 = (t1*t4)%p
        y3 = (y3+t0)%p
        t0 = (t5*t4)%p
        x3 = (t3*x3)%p
        x3 = (x3-t0)%p
        t0 = (t3*t1)%p
        z3 = (t5*z3)%p
        z3 = (z3+t0)%p

        x3 = posMod(x3, p)
        y3 = posMod(y3, p)
        z3 = posMod(z3, p)
        return new WeierstrassPoint(this.group, x3, y3, z3) as this
    }
    toAffine(): { x: bigint; y: bigint } | false {
        if (this.isIdentity()) {
            this.y = BigInt(1)
            return false
        }
        const zInv = invMod(this.z, this.group.p),
            x = posMod(this.x * zInv, this.group.p),
            y = posMod(this.y * zInv, this.group.p)
        this.x = x
        this.y = y
        this.z = BigInt(1)
        return { x, y }
    }
    toBytes(): Uint8Array {
        const coord = this.toAffine()
        if (!coord) {
            return new Uint8Array(1)
        }
        const coordSize = this.group.sizeFieldBytes(),
            ret = new Uint8Array(this.group.sizePointBytes())
        ret[0] = 0x04
        ret.set(toBytes(coord.x, coordSize), 1)
        ret.set(toBytes(coord.y, coordSize), 1 + coordSize)
        return ret
    }
    protected afterJson(): void {
        if (!this.group.isOnGroup(this)) {
            throw new Error(`point not on Weierstrass group: ${this.group.name}`)
        }
    }
}

jsonObject({ knownTypes: [WeierstrassGroup] })(Group)
jsonObject({ knownTypes: [WeierstrassPoint] })(Group.Point)
