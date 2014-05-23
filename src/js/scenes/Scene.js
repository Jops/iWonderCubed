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
 * <summary>Base scene object.</summary>
 */

(function() {

    var jhScene = function( stage ) { this.initialize( stage ); };
    jhScene.prototype =
    {
        centre: { x:0, y:0 },

        // keys
        KEYS:         [],
        key_code:     0,
        KEY_SHIFT:    16,
        KEY_CTRL:     17,
        KEY_ALT:      18,
        KEY_SPACE:    32,
        KEY_UP:       38,
        KEY_DOWN:     40,
        KEY_LEFT:     37,
        KEY_RIGHT:    39,

        // mouse
        stageX: 0,
        stageY: 0,
        mouseDown: false,

        Begin: function()
        {
            this.$CreateScene.Begin.apply( this, arguments );

            // global events
            this.stage.addEventListener( 'stagemousedown', Object.createHandler( this, this.mouseDownHandler ) );
            this.stage.addEventListener( 'stagemouseup', Object.createHandler( this, this.mouseUpHandler ) );
            this.stage.addEventListener( 'stagemousemove', Object.createHandler( this, this.mouseMoveHandler ) );
            // keyboard events
            document.onkeydown = Object.createHandler( this, this.keyPressHandler );
            document.onkeyup = Object.createHandler( this, this.keyReleaseHandler );

            this.centre.x = this.stage.canvas.width/2;
            this.centre.y = this.stage.canvas.height/2;
        },

        stateWait: function()
        {},

        keyPressHandler: function( e )
        {
            this.key_code = ( window.event ) ? event.keyCode : e.keyCode;
            this.KEYS[this.key_code] = true;
        },
        keyReleaseHandler: function( e )
        {
            this.key_code = ( window.event ) ? event.keyCode : e.keyCode;
            this.KEYS[this.key_code] = false;
        },

        mouseDownHandler: function( e ) { this.mouseDown = true; },
        mouseUpHandler: function( e ) { this.mouseDown = false; },
        mouseMoveHandler: function( e )
        {
            this.stageX = e.stageX;
            this.stageY = e.stageY;
        },

        resize: function( w, h )
        {
            this.centre = { x:w/2, y:h/2 };
        },

        cleanup: function()
        {
            // global events
            this.stage.removeAllEventListeners( 'stagemousedown' );
            this.stage.removeAllEventListeners( 'stagemouseup' );
            this.stage.removeAllEventListeners( 'stagemousemove' );
            // keyboard events
            document.onkeydown = null;
            document.onkeyup = null;
        },

        End: function()
        {
            this.$CreateScene.End.apply( this, arguments );
            this.cleanup();
        }
    };
    Object.extend(jhScene, jhCreateJSScene, '$CreateScene');

    window.Scene = jhScene;

}());