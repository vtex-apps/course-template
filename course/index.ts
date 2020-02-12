import { IOClients, Service, ServiceContext } from "@vtex/api";
import { join } from 'path'

declare global {
  type Context = ServiceContext<IOClients, {}>;
}

const correctionHandler = async (ctx: Context) => {
  const step = ctx.query.step;

  const stepModule = await import(join(__dirname, `./${step}.js`));
  const suite = stepModule.default;

  const results = await Promise.all(
    suite.tests.map(async ({ test, description, failMsg }: any) => {
      try {
        const pass = await test({
          files: [],
          getFile: (name: string) => new Promise(resolve => resolve(name)),
          lib: { }
        });
        return {
          pass,
          ...{
            failMsg: pass ? undefined : failMsg,
            successMsg: description
          }
        };
      } catch (e) {
        return { pass: false, failMsg: e.message || failMsg };
      }
    })
  );

  // Add cache header here, please Mr.
  ctx.status = 200;
  ctx.body = results;
};

export default new Service<any, any>({
  routes: {
    correction: [correctionHandler]
  }
});
