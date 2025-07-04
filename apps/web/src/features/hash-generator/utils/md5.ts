export function md5(input: string): string {
	const rotateLeft = (lValue: number, iShiftBits: number): number => {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	const addUnsigned = (lX: number, lY: number): number => {
		let lResult = (lX & 0xffffffff) + (lY & 0xffffffff);
		if (lResult > 0xffffffff) {
			lResult &= 0xffffffff;
		}
		return lResult;
	};

	const f = (x: number, y: number, z: number): number => {
		return (x & y) | (~x & z);
	};
	const g = (x: number, y: number, z: number): number => {
		return (x & z) | (y & ~z);
	};
	const h = (x: number, y: number, z: number): number => {
		return x ^ y ^ z;
	};
	const i = (x: number, y: number, z: number): number => {
		return y ^ (x | ~z);
	};

	const ff = (
		inputA: number,
		b: number,
		c: number,
		d: number,
		x: number,
		s: number,
		ac: number,
	): number => {
		const resultA = addUnsigned(
			inputA,
			addUnsigned(addUnsigned(f(b, c, d), x), ac),
		);
		return addUnsigned(rotateLeft(resultA, s), b);
	};

	const gg = (
		inputA: number,
		b: number,
		c: number,
		d: number,
		x: number,
		s: number,
		ac: number,
	): number => {
		const resultA = addUnsigned(
			inputA,
			addUnsigned(addUnsigned(g(b, c, d), x), ac),
		);
		return addUnsigned(rotateLeft(resultA, s), b);
	};

	const hh = (
		inputA: number,
		b: number,
		c: number,
		d: number,
		x: number,
		s: number,
		ac: number,
	): number => {
		const resultA = addUnsigned(
			inputA,
			addUnsigned(addUnsigned(h(b, c, d), x), ac),
		);
		return addUnsigned(rotateLeft(resultA, s), b);
	};

	const ii = (
		inputA: number,
		b: number,
		c: number,
		d: number,
		x: number,
		s: number,
		ac: number,
	): number => {
		const resultA = addUnsigned(
			inputA,
			addUnsigned(addUnsigned(i(b, c, d), x), ac),
		);
		return addUnsigned(rotateLeft(resultA, s), b);
	};

	const convertToWordArray = (str: string): number[] => {
		const lMessage: number[] = [];
		const nblk = ((str.length + 8) >> 6) + 1;
		const nlen = nblk * 16;

		for (let idx = 0; idx < nlen; idx++) {
			lMessage.push(0);
		}

		for (let idx = 0; idx < str.length; idx += 4) {
			lMessage[idx >> 2] |=
				(str.charCodeAt(idx) & 0xff) |
				(((str.charCodeAt(idx + 1) || 0) & 0xff) << 8) |
				(((str.charCodeAt(idx + 2) || 0) & 0xff) << 16) |
				(((str.charCodeAt(idx + 3) || 0) & 0xff) << 24);
		}

		const byteLen = str.length;
		const bitLen = byteLen * 8;

		lMessage[byteLen >> 2] |= 0x80 << ((byteLen % 4) * 8);

		lMessage[nlen - 2] = bitLen;
		lMessage[nlen - 1] = Math.floor(bitLen / 2 ** 32);

		return lMessage;
	};

	const wordToHex = (lValue: number): string => {
		let wordToHexValue = "";
		const wordToHexConstant = 0xf;
		for (let lCount = 0; lCount <= 3; lCount++) {
			const lByte: number = (lValue >>> (lCount * 8)) & wordToHexConstant;
			wordToHexValue +=
				"0123456789abcdef".charAt(lByte >> 4) +
				"0123456789abcdef".charAt(lByte & wordToHexConstant);
		}
		return wordToHexValue;
	};

	const x = convertToWordArray(input);
	let a = 0x67452301;
	let b = 0xefcdab89;
	let c = 0x98badcfe;
	let d = 0x10325476;

	for (let k = 0; k < x.length; k += 16) {
		const aa = a;
		const bb = b;
		const cc = c;
		const dd = d;

		a = ff(a, b, c, d, x[k + 0], 7, 0xd76aa478);
		d = ff(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
		c = ff(c, d, a, b, x[k + 2], 17, 0x242070db);
		b = ff(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
		a = ff(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
		d = ff(d, a, b, c, x[k + 5], 12, 0x4787c62a);
		c = ff(c, d, a, b, x[k + 6], 17, 0xa8304613);
		b = ff(b, c, d, a, x[k + 7], 22, 0xfd469501);
		a = ff(a, b, c, d, x[k + 8], 7, 0x698098d8);
		d = ff(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
		c = ff(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
		b = ff(b, c, d, a, x[k + 11], 22, 0x895cd7be);
		a = ff(a, b, c, d, x[k + 12], 7, 0x6b901122);
		d = ff(d, a, b, c, x[k + 13], 12, 0xfd987193);
		c = ff(c, d, a, b, x[k + 14], 17, 0xa679438e);
		b = ff(b, c, d, a, x[k + 15], 22, 0x49b40821);

		a = gg(a, b, c, d, x[k + 1], 5, 0xf61e2562);
		d = gg(d, a, b, c, x[k + 6], 9, 0xc040b340);
		c = gg(c, d, a, b, x[k + 11], 14, 0x265e5a51);
		b = gg(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
		a = gg(a, b, c, d, x[k + 5], 5, 0xd62f105d);
		d = gg(d, a, b, c, x[k + 10], 9, 0x02441453);
		c = gg(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
		b = gg(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
		a = gg(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
		d = gg(d, a, b, c, x[k + 14], 9, 0xc33707d6);
		c = gg(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
		b = gg(b, c, d, a, x[k + 8], 20, 0x455a14ed);
		a = gg(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
		d = gg(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
		c = gg(c, d, a, b, x[k + 7], 14, 0x676f02d9);
		b = gg(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

		a = hh(a, b, c, d, x[k + 5], 4, 0xfffa3942);
		d = hh(d, a, b, c, x[k + 8], 11, 0x8771f681);
		c = hh(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
		b = hh(b, c, d, a, x[k + 14], 23, 0xfde5380c);
		a = hh(a, b, c, d, x[k + 1], 4, 0xa4beea44);
		d = hh(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
		c = hh(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
		b = hh(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
		a = hh(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
		d = hh(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
		c = hh(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
		b = hh(b, c, d, a, x[k + 6], 23, 0x04881d05);
		a = hh(a, b, c, d, x[k + 9], 4, 0xd9d40240);
		d = hh(d, a, b, c, x[k + 12], 11, 0xed9a7c3e);
		c = hh(c, d, a, b, x[k + 15], 16, 0x431c5563);
		b = hh(b, c, d, a, x[k + 2], 23, 0x550c7dc3);

		a = ii(a, b, c, d, x[k + 0], 6, 0xf61e2562 - 0x289b7ec6);
		d = ii(d, a, b, c, x[k + 7], 10, 0xf4292244);
		c = ii(c, d, a, b, x[k + 14], 15, 0x432aff97);
		b = ii(b, c, d, a, x[k + 5], 21, 0xab9423a7);
		a = ii(a, b, c, d, x[k + 12], 6, 0xfc93a039);
		d = ii(d, a, b, c, x[k + 3], 10, 0x655b59c3);
		c = ii(c, d, a, b, x[k + 10], 15, 0x8f0ccc92);
		b = ii(b, c, d, a, x[k + 1], 21, 0xffeff47d);
		a = ii(a, b, c, d, x[k + 8], 6, 0x85845dd1);
		d = ii(d, a, b, c, x[k + 15], 10, 0x6fa87e4f);
		c = ii(c, d, a, b, x[k + 6], 15, 0xfe2ce6e0);
		b = ii(b, c, d, a, x[k + 13], 21, 0xa3014314);
		a = ii(a, b, c, d, x[k + 4], 6, 0x4e0811a1);
		d = ii(d, a, b, c, x[k + 11], 10, 0xf7537e82);
		c = ii(c, d, a, b, x[k + 2], 15, 0xbd3af235);
		b = ii(b, c, d, a, x[k + 9], 21, 0x2ad7d2bb);

		a = addUnsigned(a, aa);
		b = addUnsigned(b, bb);
		c = addUnsigned(c, cc);
		d = addUnsigned(d, dd);
	}

	const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
	return temp.toLowerCase();
}
