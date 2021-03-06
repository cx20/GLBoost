import GLBoost from '../../globals';
import GLBoostMiddleContext from '../core/GLBoostMiddleContext';
import Vector3 from '../../low_level/math/Vector3';
import Vector4 from '../../low_level/math/Vector4';

if (typeof phina !== 'undefined') {



phina.namespace(function() {

  /**
   * @class
   */
  phina.define('phina.display.GLBoostLayer', {
    superClass: 'phina.display.Layer',

    scene: null,
    expression: null,
    camera: null,
    light: null,
    glBoostContext: null,
    renderer: null,
    canvas: null,

    /** rendering child by self CanvasRenderer or not */
    renderChildBySelf: true,

    init: function(params) {
      this.superInit(params);
      this.originX = 0;
      this.originY = 0;

      this.canvas = document.createElement("canvas");
      this.canvas.id = 'glboost_world';
      this.canvas.width = params.width;
      this.canvas.height = params.height;
      var bodyElm = document.getElementsByTagName("body").item(0);
      bodyElm.appendChild(this.canvas);
      this.canvas.style.display = "none";

      this.glBoostContext = new GLBoostMiddleContext(this.canvas);
      // create renderer
      this.renderer = this.glBoostContext.createRenderer({clearColor: {red:1, green:1, blue:1, alpha:1}});
      this.scene = this.glBoostContext.createScene();
      this.expression = this.glBoostContext.createExpressionAndRenderPasses(1);
      this.expression.renderPasses[0].scene = this.scene;

      this.on('enterframe', function() {
        if (this.scene) {
          this.renderer.clearCanvas();
          this.renderer.draw(this.expression);
        }
      });

      this.domElement = this.canvas;
    }
  });

  phina.define("phina.display.OffScreenLayer", {
    superClass: 'phina.display.Layer',

    /**
     * rendering child by self CanvasRenderer or not
     */
    renderChildBySelf: true,

    /** For drawing child attribute canvas */
    canvas2d: null,
    /** To drawing canvas2d renderer */
    renderer2d: null,

    width: 0,
    height: 0,

    init: function (params) {
      this.superInit();

      this.width = params.width;
      this.height = params.height;

      if (params.fillStyle instanceof Vector3) {
        this.fillStyle = `rgb(${params.fillStyle.x * 255},${params.fillStyle.y * 255},${params.fillStyle.z * 255},1)`;
      } else if (params.fillStyle instanceof Vector4) {
        this.fillStyle = `rgba(${params.fillStyle.x * 255},${params.fillStyle.y * 255},${params.fillStyle.z * 255},${params.fillStyle.w})`;
      } else {
        this.fillStyle = params.fillStyle;
      }

      this.canvas2d = phina.graphics.Canvas();
      this.canvas2d.setSize(this.width, this.height);

      this.renderer2d = phina.display.CanvasRenderer(this.canvas2d);

    },

    reset: function() {
      this.canvas2d.clearColor('white', 0, 0, this.width, this.height);
      this.canvas2d.clearColor(this.fillStyle, 0, 0, this.width, this.height);
      // this.canvas2d.clear(0, 0, this.width, this.height);
      /*
       this.canvas2d.init();
       this.canvas2d.setSize(this.width, this.height);
       this.renderer2d = phina.display.CanvasRenderer(this.canvas2d);
       */
    },

    renderObject: function(obj) {
      var layer = DisplayElement();
      obj.flare('enterframe');
      obj.addChildTo(layer);
      this.renderer2d.renderObject(layer);
    },

    getImageDataURL: function() {
      return this.canvas2d.domElement.toDataURL('image/png');
    }
  });

});
}

export default GLBoost;
