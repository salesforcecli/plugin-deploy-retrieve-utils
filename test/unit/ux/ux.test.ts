/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { ux as coreUx } from '@oclif/core';
import { Ux } from '../../../src/ux/ux.js';

describe('Ux', () => {
  let sandbox: sinon.SinonSandbox;
  let stdoutStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stdoutStub = sandbox.stub(coreUx, 'stdout').callsFake(() => {});
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('table', () => {
    it('should log a table', () => {
      const ux = new Ux();
      ux.table([{ key: 'foo', value: 'bar' }], { key: {}, value: {} });
      expect(stdoutStub.args).to.deep.equal([
        ['\u001b[1m Key Value \u001b[22m'],
        ['\u001b[1m ─── ───── \u001b[22m'],
        [' foo bar   '],
      ]);
    });

    it('should not log anything if output is not enabled', () => {
      const ux = new Ux({ jsonEnabled: true });
      ux.table([{ key: 'foo', value: 'bar' }], { key: {}, value: {} });
      expect(stdoutStub.callCount).to.equal(0);
    });
  });

  describe('url', () => {
    it('should log a url', () => {
      const ux = new Ux();
      ux.url('Salesforce', 'https://developer.salesforce.com/');
      expect(stdoutStub.firstCall.args).to.deep.equal(['https://developer.salesforce.com/']);
    });

    it('should not log anything if output is not enabled', () => {
      const ux = new Ux({ jsonEnabled: true });
      ux.url('Salesforce', 'https://developer.salesforce.com/');
      expect(stdoutStub.callCount).to.equal(0);
    });
  });

  describe('styledJSON', () => {
    it('should log stylized json', () => {
      const ux = new Ux();
      ux.styledJSON({ foo: 'bar' });
      expect(stdoutStub.firstCall.args).to.deep.equal(['{\n  \u001b[94m"foo"\u001b[39m: \u001b[92m"bar"\u001b[39m\n}']);
    });

    it('should not log anything if output is not enabled', () => {
      const ux = new Ux({ jsonEnabled: true });
      ux.styledJSON({ foo: 'bar' });
      expect(stdoutStub.callCount).to.equal(0);
    });
  });

  describe('styledObject', () => {
    it('should log stylized object', () => {
      const ux = new Ux();
      ux.styledObject({ foo: 'bar' });
      expect(stdoutStub.firstCall.args).to.deep.equal(['\u001b[34mfoo\u001b[39m: bar']);
    });

    it('should not log anything if output is not enabled', () => {
      const ux = new Ux({ jsonEnabled: true });
      ux.styledObject({ foo: 'bar' });
      expect(stdoutStub.callCount).to.equal(0);
    });
  });

  describe('styledHeader', () => {
    it('should log stylized header', () => {
      const ux = new Ux();
      ux.styledHeader('A Stylized Header');
      expect(stdoutStub.firstCall.args).to.deep.equal([
        '\u001b[2m=== \u001b[22m\u001b[1mA Stylized Header\u001b[22m\n',
      ]);
    });

    it('should not log anything if output is not enabled', () => {
      const ux = new Ux({ jsonEnabled: true });
      ux.styledHeader('A Stylized Header');
      expect(stdoutStub.callCount).to.equal(0);
    });
  });
});
