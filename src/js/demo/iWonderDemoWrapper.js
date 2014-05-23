/**
 * <copyright>
 * Copyright (c) 2014 All Rights Reserved http: *hawk-head.com
 *
 * THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
 * KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
 * PARTICULAR PURPOSE.
 * </copyright>
 * <author>Jonathan HW Halkett</author>
 * <email>Jops.Hawkhead@gmail.com</email>
 * <date>01-03-2014</date>
 * <summary>Three.js wrapper for this Demo.</summary>
 */

(function() {

    var jhiWonderDemoWrapper = function( _container, _width, _height ) { this.init( _container, _width, _height ); };
    jhiWonderDemoWrapper.prototype =
    {
        container: null,
        width: 0,
        height: 0,
        centre: null,

        mouseX: 0,
        mouseY: 0,
        mouseDown: false,

        KEYS:         [],
        KEY_SHIFT:    16,
        KEY_CTRL:     17,
        KEY_ALT:      18,
        KEY_SPACE:    32,
        KEY_UP:       38,
        KEY_DOWN:     40,
        KEY_LEFT:     37,
        KEY_RIGHT:    39,
        KEY_R:        82,
        KEY_N:        78,

        imageSet: null,

        // physics
        b2_width: config['box2d_scene_width'],
        b2_height: config['box2d_scene_height'],
        b2_Box2dSim: null,
        b2_scale: config['box2d_simulation_scale'],
        aBOX: null,
        b2_cubeSize: config['box2d_cube_size'],

        // Three.js
        THREE_camera: null,
        THREE_scene: null,
        THREE_renderer: null,
        THREE_aCUBES: null,
        THREE_cubeSize: config['three_cube_size'],

        init: function( _container, _width, _height )
        {
            this.container = _container;
            this.width     = _width;
            this.height    = _height;
            this.centre = { x: _width/2, y: _height/2 };

            this.initPhysics();
            this.initThree();

            // load set
            this.imageSet = image_config();
            var totalToPull = Math.floor(config['demo_initial_cube_drop_total']);
            for( var i = 0; i < totalToPull; i++ )
            {
                this.popImage();
            }

            // set load more button binding
            var btn = document.getElementById(config['demo_load_more_button_id']);
            var self = this;
            btn.onclick = function() { self.popImage(); };
        },

        popImage: function()
        {
            if( !this.imageSet.length ) return;
            var image = this.imageSet.pop();
            // add box
            this.addCube(   Math.random()*this.b2_width,
                            (Math.random()*100),
                            this.b2_cubeSize,
                            this.b2_cubeSize,
                            g_assetMap.getAsset(image.id),
                            this.b2_cubeSize*2 );
        },

        initPhysics: function()
        {
            this.aBOX = [];
            // instance simulator
            this.b2_Box2dSim = new jhBox2DWrapper();
            this.b2_Box2dSim.create()
                            .usingScale( this.b2_scale )
                            .withDebugView( g_debugElm )
                            // .withSceneBorders( this.width, this.height )
                            .withSceneFloor( this.b2_width, -(this.height-this.b2_height) )
                            .withSceneBorderLeft( this.b2_height, 0 )
                            .withSceneBorderRight( this.b2_height, -(this.width-this.b2_width) )
                            .withMouseDrag( true )
                            .withBuoyancyController( window.innerHeight-100 );
        },

        addCube: function( _x, _y, _w, _h, image, size )
        {
            this.aBOX.push( this.addBox2dCube( _x, _y, _w, _h ) );
            this.THREE_aCUBES.push( this.addCubeMesh( image, size ) );
        },

        addBox2dCube: function( _x, _y, _w, _h )
        {
            var bod = this.b2_Box2dSim.addBody( jhBox2DWrapper.BOX )
                                    .withUserData( {} )
                                    .at( _x, _y )
                                    .withSize( _w, _h )
                                    .build();
            return bod;
        },

        initThree: function()
        {
            this.THREE_aCUBES = [];

            this.THREE_renderer = new THREE.WebGLRenderer( { canvas: g_webglElm } );
            this.THREE_renderer.setSize( this.width, this.height );
            this.THREE_renderer.setClearColor(0xf1f1ee, 1);

            this.THREE_camera = new THREE.PerspectiveCamera( 50, this.width/this.height, 1, 2000 );
            this.THREE_camera.rotation.x = jhMath_degreesToRadians(-35);
            // this.THREE_camera.position.x = this.b2_width/2;
            this.THREE_camera.position.z = 500;

            this.THREE_scene = new THREE.Scene();
        },

        addCubeMesh: function( image, size )
        {
            var geometry = new THREE.BoxGeometry( size, size, size );

            var texture = new THREE.Texture( image );
            texture.needsUpdate = true;
            texture.anisotropy = this.THREE_renderer.getMaxAnisotropy();

            var material = new THREE.MeshBasicMaterial( { map: texture } );

            var cubeMesh = new THREE.Mesh( geometry, material );
            this.THREE_scene.add( cubeMesh );

            cubeMesh.position.z = (Math.random()*50)-25;
            cubeMesh.rotation.y = (Math.random()*10)-5;

            return cubeMesh;
        },

        DO: function()
        {
            this.stepPhysics();
            this.mapActors();
            this.render3D();
        },

        stepPhysics: function()
        {
            this.b2_Box2dSim.mouseDragAt( this.mouseX, this.mouseY, this.mouseDown );
            this.b2_Box2dSim.Step( true );
        },

        render3D: function()
        {
            this.THREE_renderer.render( this.THREE_scene, this.THREE_camera );
        },

        keyPress: function( KEYS )
        {
            this.KEYS = KEYS;
            if( this.KEYS[this.KEY_N] ) this.popImage();
        },

        mousePosition: function( _x, _y, _down )
        {
            this.mouseX    = _x;
            this.mouseY    = _y;
            this.mouseDown = _down;
        },

        setDimensions: function( _w, _h )
        {
            this.width  = _w;
            this.height = _h;
            this.centre = { x: _w/2, y: _h/2 };

            this.THREE_camera.aspect = _w/_h;
            this.THREE_camera.updateProjectionMatrix();

            this.THREE_renderer.setSize( _w, _h );
        },

        mapActors: function()
        {
            for( var i = 0; i < this.aBOX.length; i++ )
                this.mapActor( this.aBOX[i], this.THREE_aCUBES[i] );
        },

        mapActor: function( b2cube, THREEcube )
        {
            // collect data from physics body
            var pos = b2cube.GetPosition();
            var posX = ( pos.x * this.b2_scale );
            var posY = ( pos.y * this.b2_scale );

            THREEcube.position.x = /*this.width/2 + */(posX - this.b2_width/2);
            THREEcube.position.y = -(this.height/2 + (posY - this.b2_height/2));
            THREEcube.rotation.z = -b2cube.GetTransform().GetAngle();
        }
    };

    window.iWonderDemoWrapper = jhiWonderDemoWrapper;

}());