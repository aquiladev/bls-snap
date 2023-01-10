import chai from 'chai';
// eslint-disable-next-line import/no-unassigned-import, import/extensions
import 'chai/register-expect.js';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(sinonChai);
chai.use(chaiAsPromised);

export const mochaHooks = {
  async afterEach() {
    sinon.restore();
  },
};
