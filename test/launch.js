const Application = require('spectron').Application
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.

const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Application launch', function () {
  this.timeout(60000)
  let app;

  beforeEach(function () {
    app = new Application({
      path: electronPath,
      env: {
        ELECTRON_ENABLE_STACK_DUMPING: true,
        ELECTRON_ENABLE_LOGGING: true
      },
      args: ['.', '--serve', '--config', 'config.test.json']
    })
    return app.start().then(refresh).then(wait(5000))
  })

  afterEach(() => app && app.isRunning() ? app.stop() : undefined);

  it('shows core elements', () => Promise.all([
      queryElement("lx-project-tabs").should.eventually.exist,
      queryElement("lx-command-container").should.eventually.exist,
      queryElement("lx-project").should.eventually.exist,
      queryElement("lx-terminal").should.eventually.exist,
      queryElements("lx-project-tabs .tab").should.eventually.lengthOf(2),
      queryElement("lx-project > lx-complex-dependency").should.eventually.exist,
      queryElement("lx-project > lx-package-dependency").should.eventually.exist
    ])
  )

  const wait = time => () => new Promise(resolve => setTimeout(resolve, time));

  const queryElement = selector => app.client.element(selector).then(({value}) => value);

  const queryElements = selector => app.client.elements(selector).then(({value}) => value);

  const refresh = () => app.client.refresh();
})
