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
 * <summary>Animation scene for preloading sequence.</summary>
 */

(function() {

    var jhPreloader = function( stage ) { this.initialize( stage ); };
    jhPreloader.prototype =
    {
        loader: null,
        displayText: null,
        loadBar: null,
        loadBarContainer: null,

        scale: 1,

        Begin: function()
        {
            this.$Scene.Begin.apply( this, arguments );

            this.loader = new jhPreloadJS();
            this.loader.addCallback( jhPreloadJS.PROGRESS, this.handleLoadProgress, this );
            this.loader.addCallback( jhPreloadJS.COMPLETE, this.handleLoadComplete, this );
            this.loader.loadCollection( g_assetMap );

            this.activeState = this.stateBegin;
        },

        stateBegin: function()
        {
            this.displayText = this.container.addChild(new createjs.Text("LOADING...", "36px visitor1", "#230012"));
            this.displayText.x = -this.displayText.getMeasuredWidth()/2;
            this.displayText.y = -this.displayText.getMeasuredHeight();
            this.displayText.y = 20;
            this.loadBarContainer = this.container.addChild( new createjs.Shape() );
            this.loadBarContainer.graphics.beginStroke("#000").drawRect(-5, -8, 410, 11);
            this.loadBarContainer.x = -200;
            this.loadBar = this.container.addChild( new createjs.Shape() );
            this.loadBar.graphics.beginStroke("#F00").beginFill("red").drawRect(0, -5, 400, 5);
            this.loadBar.x = -200;
        },

        stateEnd: function()
        {
            this.container.removeChild( this.displayText );
            this.container.removeChild( this.loadBarContainer );
            this.container.removeChild( this.loadBar );
            progressState();
        },

        handleLoadProgress: function( event )
        {
            var perc = event.target.progress * 100;
            trace('Preloader:LOAD_PROGRESS: '+perc);
            if( this.loadBar ) this.loadBar.scaleX = 1-event.target.progress;
        },

        handleLoadComplete: function( event )
        {
            trace('Preloader:ALL FILES LOADED');
            this.fixCrossOriginIssue();
            g_assetMap = this.loader;
            this.activeState = this.stateEnd;
        },

        fixCrossOriginIssue: function()
        {
            // ensure all images have cross domain changed e.g. img.crossOrigin="Anonymous";
            for( var key in g_assetMap )
                if( g_assetMap[ key ].indexOf('.png') != -1 ||
                    g_assetMap[ key ].indexOf('.jpg') != -1 )
                    this.loader.getAsset(key).crossOrigin = "Anonymous";
        },

        resize: function( w, h )
        {
        },

        End: function()
        {
            this.$Scene.End.apply( this, arguments );
        }
    };
    Object.extend(jhPreloader, Scene, '$Scene');

    window.Preloader = jhPreloader;

}());