/* 
* @Author: Mike Reich
* @Date:   2015-12-06 07:20:10
* @Last Modified 2016-04-16
*/

'use strict';

import Templater from '../src/'

import TestApp from '@nxus/core/lib/test/support/TestApp';

describe("Templater", () => {
  var templater;
  var app = new TestApp();
 
  beforeEach(() => {
    app = new TestApp();
    templater = new Templater(app);
  });
  
  describe("Load", () => {
    it("should not be null", () => Templater.should.not.be.null)

    it("should be instantiated", () => {
      templater.should.not.be.null;
    });
  });

  describe("Init", () => {
    it("should have _templates after load", () => {
      return app.emit('load').then(() => {
        templater.should.have.property('_templates');
      });
    });

    it("should register a gather for templates", () => {
      return app.emit('load').then(() => {
        app.get.calledWith('templater').should.be.true;
        app.get().gather.calledWith('template').should.be.true;
      });
    })

    it("should register a gather for templateFile", () => {
      return app.emit('load').then(() => {
        app.get.calledWith('templater').should.be.true;
        app.get().gather.calledWith('templateFunction').should.be.true;
      });
    })
    
    it("should register a gather for templateDirs", () => {
      return app.emit('load').then(() => {
        app.get.calledWith('templater').should.be.true;
        app.get().gather.calledWith('templateDir').should.be.true;
      });
    })

    it("should register a provider for render", () => {
      return app.emit('load').then(() => {
        app.get().respond.calledWith('render').should.be.true;
      });
    })
  });

  describe("_mergeArgs", () => {
    it("should handle null and single-length", () => {
      let r = templater._mergeArgs({})
      r.should.eql({})
      r = templater._mergeArgs({}, {})
      r.should.eql({})
    })
    it("should merge objects", () => {
      let r = templater._mergeArgs({a: 1}, {b: 2})
      r.should.have.property("a", 1)
      r.should.have.property("b", 2)
    })
    it("should merge array of objects", () => {
      let r = templater._mergeArgs({a: 1}, [{b: 2}, {c: 3}])
      r.should.have.property("a", 1)
      r.should.have.property("b", 2)
      r.should.have.property("c", 3)
    })
    it("should concat for array values", () => {
      let r = templater._mergeArgs({a: [1]}, {a: [2, 3]})
      r.should.have.property("a")
      r.a.should.eql([1, 2, 3])
    })
    it("should uniq for array values", () => {
      let r = templater._mergeArgs({a: [1]}, {a: [1, 3]})
      r.should.have.property("a")
      r.a.should.eql([1, 3])
    })
  })
  
  describe("Register Renderer", () => {
    it("should register a renderer with the specified type", (done) => {
      templater.template('test', () => {})
      app.emit('load').then(() => {
        chai.should().exist(templater._templates['test'])
        done()
      })
    })
  })

  describe("Registering templates with template()", () => {
    it("should accept just a filename", () => {
      templater.template("path/to/filename.ejs")
      templater._templates.should.have.property("filename")
      templater._templates.filename.filename.should.eql('path/to/filename.ejs')
    })
    it("should accept just a name and filename", () => {
      templater.template("path/to/filename.ejs", 'default')
      templater._templates.should.have.property("filename")
      templater._templates.filename.filename.should.eql('path/to/filename.ejs')
      templater._templates.filename.wrapper.should.eql('default')
    })
  })
});
