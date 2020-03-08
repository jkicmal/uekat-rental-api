import { Service, Container, Inject } from 'typedi';
import { createExpressServer, useContainer } from 'routing-controllers';
import { CustomErrorHandlerMiddleware } from './middlewares';
import { ConfigToken } from './common/tokens';
import { Config } from './common/interfaces';
import { RoutingControllerUtils } from './common/utils/routing-controllers.utils';
import { MorganToken, Morgan } from './common/tokens';

@Service()
export class Server {
  constructor(
    @Inject(ConfigToken) private config: Config,
    private routingControllersUtils: RoutingControllerUtils,
    @Inject(MorganToken) private morgan: Morgan
  ) {
    useContainer(Container);
  }

  public async init() {
    const app = createExpressServer({
      authorizationChecker: this.routingControllersUtils.authorizationChecker,
      currentUserChecker: this.routingControllersUtils.currentUserChecker,
      cors: true,
      defaultErrorHandler: false,
      controllers: [__dirname + '/controllers/*.controller.ts'],
      middlewares: [CustomErrorHandlerMiddleware]
    });

    app.use(this.morgan('common'));

    return app.listen(this.config.server.port);
  }
}
