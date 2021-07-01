import { grpc } from '@improbable-eng/grpc-web';
import { SignUpInClient } from 'services/gen-proto/signUpIn_pb_service';
import { StudentAppClient } from 'services/gen-proto/student_pb_service';
import { WebsocketTransport } from './websocket';

class _RpcClient<T extends StudentAppClient | SignUpInClient, K> {
  client: T | undefined;

  constructor(
    cls: new (serviceHost: string, options?: grpc.RpcOptions) => T,
    services: K
  ) {
    if (process.env.NODE_ENV !== 'production') {
      this.client = new cls('http://localhost:8888', {
        transport: WebsocketTransport(),
      });
    } else {
      this.client = new cls('https://posture-study.gtdev.org/api', {
        transport: WebsocketTransport(),
      });
    }

    Object.keys(services).forEach(func => {
      //@ts-ignore
      RpcClient.prototype[func] = function (...args: any) {
        return new Promise((resolve, reject) => {
          //@ts-ignore
          this.client[func](...args, (err: any, resp: any) => {
            if (err) {
              reject(err);
            }
            resolve(resp);
          });
        });
      };
    });
  }
}

export const RpcClient = _RpcClient as {
  new <T extends StudentAppClient | SignUpInClient, K>(
    cls: new (serviceHost: string, options?: grpc.RpcOptions) => T,
    services: K
  ): _RpcClient<T, K> & K;
};
