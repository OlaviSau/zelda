const Application = require('spectron').Application
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.

const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Application launch', function () {
  this.timeout(10000)
  let app;

  beforeEach(function () {
    app = new Application({
      path: electronPath,
      args: ['.', '--serve', '--config', 'config.test.json']
    })
    return app.start()
  })

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('shows core elements', function () {
    return Promise.all([
      queryElement("lx-project-tabs").should.eventually.exist,
      queryElement("lx-command-container").should.eventually.exist,
      queryElement("lx-project").should.eventually.exist,
      queryElement("lx-terminal").should.eventually.exist,
      queryElements("lx-project-tabs .tab").should.eventually.lengthOf(2)
    ]);
  })

  const queryElement = selector => app.client.element(selector).then(({value}) => value);

  const queryElements = selector => app.client.elements(selector).then(({value}) => value);
})
