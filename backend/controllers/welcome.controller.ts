import { WelcomeServer } from '#/welcome.protocol'
import { RpcController } from '@nailyjs/rpc'

@RpcController(WelcomeServer)
export class WelcomeController implements WelcomeServer {
  toggle: boolean = false

  sayHello() {
    this.toggle = !this.toggle
    return this.toggle
      ? 'Hello, world! Click me to refetch~?'
      : 'Hello, vitesse! Click me to refetch.~'
  }
}
