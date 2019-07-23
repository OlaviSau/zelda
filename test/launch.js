const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application({
      path: electronPath,
      args: ['.', '--serve', '--config', 'config.test.json']
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows core elements', function () {
    return Promise.all([
      this.app.client.element("lx-project-tabs").should.eventually.exist,
      this.app.client.element("lx-command-container").should.eventually.exist,
      this.app.client.element("lx-project").should.eventually.exist,
      this.app.client.element("lx-terminal").should.eventually.exist
    ]);
  })
})
