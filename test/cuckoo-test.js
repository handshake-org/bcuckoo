/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('assert');
const {Cuckoo, Miner, Solution} = require('../lib/cuckoo');

function testCuckoo(bits, size, ease, header, nonces) {
  testVerify(bits, size, ease, header, nonces);
  testMiner(bits, size, ease, header, nonces);
}

function testVerify(bits, size, ease, header, nonces) {
  const cycle = new Cuckoo(bits, size, ease, true);

  {
    const sol = Solution.fromArray(nonces);
    assert.deepStrictEqual(sol.toArray(), nonces);

    const code = cycle.verifyHeader(header, sol);
    assert.strictEqual(Cuckoo.code(code), 'POW_OK');
  }

  {
    const key = cycle.sipkey(header);
    const code = cycle.verify(key, nonces);
    assert.strictEqual(Cuckoo.code(code), 'POW_OK');
  }

  {
    const bbits = bits === 32 ? 1 : bits + 1;
    const cycle = new Cuckoo(bbits, size, ease, true);
    const key = cycle.sipkey(header);
    const code = cycle.verify(key, nonces);
    assert.notStrictEqual(Cuckoo.code(code), 'POW_OK');
  }
}

function testMiner(bits, size, ease, header, nonces) {
  const miner = new Miner(bits, size, ease, true);

  {
    let sol = null;
    while (!sol)
      sol = miner.mineHeader(header);
    assert.deepStrictEqual(sol.toArray(), nonces);
  }

  {
    const key = miner.sipkey(header);
    const result = miner.mine(key);

    assert(result);
    assert.deepStrictEqual(result, nonces);
  }
}

function createHeader(nonce = 0, str = '') {
  const data = Buffer.alloc(80, 0);
  data.write(str, 0, 'ascii');
  data.writeUInt32LE(nonce, 76, true);
  return data;
}

describe('Cuckoo', function() {
  it('should verify 24 42 50', () => {
    const expect = new Uint32Array([
      0x00004884,
      0x00004d35,
      0x0000ac5c,
      0x000110d7,
      0x00013f06,
      0x0001aef4,
      0x0001cf47,
      0x000200d5,
      0x0002447a,
      0x000289c8,
      0x0002917e,
      0x0002ce61,
      0x0002fd82,
      0x000315ab,
      0x00032de0,
      0x00032eac,
      0x00035415,
      0x0003a2a4,
      0x0003d62e,
      0x0003e5c2,
      0x00046f97,
      0x00048159,
      0x00048225,
      0x00048406,
      0x000485f5,
      0x0004ddfe,
      0x0004e628,
      0x00050ba8,
      0x00053dbb,
      0x00055ad6,
      0x00059511,
      0x0005fc57,
      0x00060ebd,
      0x00064aaa,
      0x00064eec,
      0x0006afe8,
      0x0006d0c6,
      0x000725a0,
      0x0007bf11,
      0x0007c3b7,
      0x0007cb9a,
      0x0007e999
    ]);

    const header = createHeader(137);

    testCuckoo(20, 42, 50, header, expect);
  });

  it('should verify 15 16 50', () => {
    const expect = new Uint32Array([
      0x000004cc,
      0x0000063b,
      0x00000884,
      0x00000934,
      0x00000b2d,
      0x00000b77,
      0x00000f8d,
      0x00001af9,
      0x00001ce1,
      0x00001f27,
      0x000021f9,
      0x0000251d,
      0x00002945,
      0x00002b8b,
      0x00003082,
      0x00003505
    ]);

    const header = createHeader(0, 'abcdefg');

    testCuckoo(15, 16, 50, header, expect);
  });

  it('should verify 28 42 50', () => {
    const expect = new Uint32Array([
      0x00229c25,
      0x003c5d20,
      0x0046581f,
      0x00525b96,
      0x0060896e,
      0x00609d7f,
      0x009da7eb,
      0x00a5a83d,
      0x00b97d70,
      0x014d5123,
      0x018339ee,
      0x018fa893,
      0x01ee7d02,
      0x01fa38fd,
      0x02241282,
      0x024d0a4b,
      0x0356553f,
      0x03ba571e,
      0x03d66c96,
      0x040c3bb7,
      0x0421487c,
      0x04546368,
      0x0477a2ce,
      0x0486ac4b,
      0x04a19e02,
      0x0500a224,
      0x053c5901,
      0x0551daf2,
      0x0555ed50,
      0x05787c58,
      0x059d1bd9,
      0x05bd25fa,
      0x06153bf2,
      0x06223420,
      0x0652dbbd,
      0x065e2907,
      0x0661cb39,
      0x06a38a3f,
      0x06fb2114,
      0x07480c5b,
      0x076fb0dc,
      0x078acd37
    ]);

    const header = createHeader(160);

    testVerify(28, 42, 50, header, expect);
  });

  it('should verify 30 42 50', () => {
    const expect = new Uint32Array([
      0x0059a89c,
      0x005ce401,
      0x00bb0e33,
      0x01b92464,
      0x0202812e,
      0x023e9429,
      0x02b4451b,
      0x02fa0419,
      0x03c2084b,
      0x052673a3,
      0x078a2ae4,
      0x0834f0e8,
      0x08384dce,
      0x09cf8341,
      0x0a9cc2e1,
      0x0b10ba9f,
      0x0b411b75,
      0x0bb12dfc,
      0x0ca666cc,
      0x0d1c3de5,
      0x0e67279d,
      0x0e86c1d5,
      0x0ec42720,
      0x0fe2fdc5,
      0x116dde6c,
      0x12870bdd,
      0x13254902,
      0x1353ebbd,
      0x137d1f4c,
      0x13d06653,
      0x13f26554,
      0x14363a31,
      0x14802173,
      0x15de6094,
      0x15fc7871,
      0x16bb6f9e,
      0x1704fbe4,
      0x1982c28b,
      0x1a450d27,
      0x1df3b3bf,
      0x1e030fbf,
      0x1e03b1c2
    ]);

    const header = createHeader(25);

    testVerify(30, 42, 50, header, expect);
  });

  it('should verify 30 26 50', () => {
    const expect = new Uint32Array([
      0x0599d6b6,
      0x05fdd608,
      0x0b7a50c8,
      0x0d5ed890,
      0x181a651f,
      0x1b1d6d03,
      0x1c396fa3,
      0x218997a4,
      0x26d37329,
      0x2b88008d,
      0x2b9f9b4e,
      0x3594488c,
      0x37ef4b35,
      0x49bf0d6d,
      0x4be51fdc,
      0x5213d615,
      0x55cc78c0,
      0x5662f316,
      0x60dac124,
      0x610e5f7d,
      0x61a70203,
      0x636fc064,
      0x69580730,
      0x6ef41a21,
      0x79b4be71,
      0x7dbef713
    ]);

    const header = createHeader(0);

    testVerify(32, 26, 50, header, expect);
  });

  it('should verify 18 6 40', () => {
    const expect = new Uint32Array([
      0x00001246,
      0x00004712,
      0x00005891,
      0x0000b43b,
      0x0000d808,
      0x0000daba
    ]);

    const header = createHeader(0, '123');

    testCuckoo(18, 6, 40, header, expect);
  });
});
