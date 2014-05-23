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
 * <summary>Scene object where the actual product is run.</summary>
 */

(function() {

    var jhGame = function( stage ) { this.initialize( stage ); };
    jhGame.prototype =
    {
        iWonderDemoWrapper: null,

        Begin: function()
        {
            this.$Scene.Begin.apply( this, arguments );

            this.activeState = this.stateInitScene;
        },

        stateInitScene: function()
        {
            this.iWonderDemoWrapper = new iWonderDemoWrapper( this.container, this.centre.x*2, this.centre.y*2 );
            // wait while a connection is established
            this.activeState = this.stateAnimate;
        },

        stateAnimate: function()
        {
            this.iWonderDemoWrapper.DO();
        },

        keyPressHandler: function( e )
        {
            this.$Scene.keyPressHandler.apply( this, arguments );
            if( this.iWonderDemoWrapper ) this.iWonderDemoWrapper.keyPress( this.KEYS );
        },

        mouseMoveHandler: function( e )
        {
            this.$Scene.mouseMoveHandler.apply( this, arguments );
            if( this.iWonderDemoWrapper ) this.iWonderDemoWrapper.mousePosition( this.stageX, this.stageY, this.mouseDown );
        },

        resize: function( w, h )
        {
            this.$Scene.resize.apply( this, arguments );
            this.iWonderDemoWrapper.setDimensions( w, h );
        },

        End: function()
        {
            this.$Scene.End.apply( this, arguments );
        }
    };
    Object.extend(jhGame, Scene, '$Scene');

    window.Game = jhGame;

}());