import {
  IOClients,
  ClientsConfig,
  Service,
  ServiceContext,
  InstanceOptions,
  IOContext,
  AppClient,
  LRUCache
} from "@vtex/api";
import { json } from "co-body";
import { join } from "path";

interface GetFileArgs {
  installationId: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

class CourseHubClient extends AppClient {
  private routes = {
    file: () => `/app/coursehub/file`
  };

  constructor(ioContext: IOContext, options?: InstanceOptions) {
    super("vtex.course-hub@0.x", ioContext, { ...options });
  }

  public getFileContent({
    installationId,
    owner,
    repo,
    branch,
    path
  }: GetFileArgs) {
    return this.http.get<string>(this.routes.file(), {
      params: { installationId, owner, repo, branch, path }
    });
  }
}

class Clients extends IOClients {
  public get courseHub() {
    return this.getOrSet("courseHub", CourseHubClient);
  }
}

const TIMEOUT_MS = 10000;

const memoryCache = new LRUCache<string, any>({ max: 5000 });
metrics.trackCache("status", memoryCache);

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS
    }
  }
};

declare global {
  type Context = ServiceContext<Clients>;
}

interface TestResult {
  msg: string;
  success: boolean;
}

/**
 * Resolves the corresponding name for a branch to search the code depending on the step.
 *
 * As of now, we require for it to be equal to the step 'folder'
 */
const getBranchForStep = (step: string) => step;

const correctionHandler = async (ctx: Context) => {
  const { step, owner, repo, installationId } = await json(ctx.req);
  const {
    clients: { courseHub }
  } = ctx;

  let stepModule = null;
  try {
    stepModule = await import(join(__dirname, `./${step}.js`));
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: `There's no step '${step}' on this course.` };
  }

  const suite = stepModule.default;

  const results: TestResult[] = [];
  const testCtx = {
    parseCss: () => {},
    parseJsonc: () => {},
    ramda: {},
    getFile: (path: string) =>
      courseHub.getFileContent({
        installationId,
        owner,
        repo,
        branch: getBranchForStep(step),
        path
      })
  };

  for (const testCase of suite.tests) {
    const { test, description, failMsg } = testCase;
    try {
      const success = await test({
        ctx: testCtx
      });
      results.push({
        success,
        msg: success ? description : failMsg
      });
    } catch (e) {
      results.push({ success: false, msg: e.message || failMsg });
    }
  }

  ctx.status = 200;
  ctx.set("Cache-Control", "no-cache,no-store");
  ctx.body = results;
};

export default new Service<Clients>({
  clients,
  routes: {
    correction: [correctionHandler]
  }
});
