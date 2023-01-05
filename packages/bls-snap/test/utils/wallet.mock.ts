/* eslint-disable import/no-named-as-default-member */
import sinon from 'sinon';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Wallet {
  registerRpcMessageHandler: (fn) => unknown;
  request(options: {
    method: string;
    params?: { [key: string]: unknown } | unknown[];
  }): unknown;
}

export class WalletMock implements Wallet {
  public readonly registerRpcMessageHandler = sinon.stub();

  public readonly requestStub = sinon.stub();

  public readonly rpcStubs = {
    snap_confirm: sinon.stub(),
    snap_manageState: sinon.stub(),
  };

  public request(args: {
    method: string;
    params: { [key: string]: unknown } | unknown[];
  }): unknown {
    const { method, params } = args;
    if (Object.hasOwnProperty.call(this.rpcStubs, method)) {
      if (Array.isArray(params)) {
        return this.rpcStubs[method](...params);
      }
      return this.rpcStubs[method](params);
    }
    return this.requestStub(args);
  }

  public reset(): void {
    this.registerRpcMessageHandler.reset();
    this.requestStub.reset();
    Object.values(this.rpcStubs).forEach(
      (stub: ReturnType<typeof sinon.stub>) => stub.reset(),
    );
  }
}
