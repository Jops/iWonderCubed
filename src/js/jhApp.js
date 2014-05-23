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
 * <summary>App Main file, entry point.</summary>
 */

var g_webglName;
var g_canvasName;
var g_debugName;
var g_webglElm;
var g_canvasElm;
var g_debugElm;
var g_stage;
var g_debugContainer;
var g_debugWindow;
var g_assetMap =    {
                        p01z7jn5:"style/images/p01z7jn5.jpg",
                        p01z4kw7:"style/images/p01z4kw7.jpg",
                        p01z25tm:"style/images/p01z25tm.jpg",
                        p01z0gn5:"style/images/p01z0gn5.jpg",
                        p01z0g7x:"style/images/p01z0g7x.jpg",
                        p01yssxs:"style/images/p01yssxs.jpg",
                        p01yssvb:"style/images/p01yssvb.jpg",
                        p01vgmtw:"style/images/p01vgmtw.jpg",
                        p01ydykg:"style/images/p01ydykg.jpg",
                        p01ydtcd:"style/images/p01ydtcd.jpg",
                        p01vmbz6:"style/images/p01vmbz6.jpg",
                        p01yd8ss:"style/images/p01yd8ss.jpg",
                        p01w4lrs:"style/images/p01w4lrs.jpg",
                        p01y4jpw:"style/images/p01y4jpw.jpg",
                        p01w057w:"style/images/p01w057w.jpg",
                        p01y3k01:"style/images/p01y3k01.jpg",
                        p01vglpx:"style/images/p01vglpx.jpg",
                        p01vgnl4:"style/images/p01vgnl4.jpg",
                    };

var g_aSTATES;
var g_stateIndex = 0;
var g_activeState = null;

function main()
{
    initialise();

    g_debugContainer = new createjs.Container();
    // g_debugContainer = g_stage.addChild( g_debugContainer );
    g_debugContainer.x = -g_canvasElm.width/2 + 20;
    g_debugContainer.y = -g_canvasElm.height/2 + 20;
    g_debugWindow = new jhTraceWindow( g_debugContainer );
    trace = function( msg )
            {
                g_debugWindow.trace( msg );
            };

    g_activeState.Begin();
    resize();
}

function initialise()
{
    g_webglName  = config['canvas_webgl_canvas_name'];
    g_canvasName = config['canvas_demo_canvas_name'];
    g_debugName  = config['canvas_debug_canvas_name'];
    g_webglElm   = document.getElementById(g_webglName);
    g_canvasElm  = document.getElementById(g_canvasName);
    g_debugElm   = document.getElementById(g_debugName);
    // createJS stage object
    g_stage           = new createjs.Stage(g_canvasName);

    g_aSTATES       = [
                        new Preloader( g_stage ),
                        new Intro( g_stage ),
                        new Game( g_stage )
                      ];
    g_activeState     = g_aSTATES[ g_stateIndex ];

    window.onresize = resize;
    // create main loop
    createjs.Ticker.addEventListener( "tick", app_tick );
    createjs.Ticker.setFPS( config['ticker_root_framerate'] );
}

function app_tick( event )
{
    g_activeState.DO();
    g_stage.update( event );
}

function resize( event )
{
    // g_canvasElm.width = window.innerWidth;
    // g_canvasElm.height = window.innerHeight;
    g_debugElm.width = window.innerWidth;
    g_debugElm.height = window.innerHeight;
    g_stage.x = g_canvasElm.width/2;
    g_stage.y = g_canvasElm.height/2;
    g_activeState.resize( g_canvasElm.width, g_canvasElm.height );
    // debug window
    g_debugContainer.x = -g_canvasElm.width/2 + 20;
    g_debugContainer.y = -g_canvasElm.height/2 + 20;
}

function progressState()
{
    trace('progressState');
    if( ++g_stateIndex == g_aSTATES.length ) g_stateIndex = 0;
    g_activeState.End();
    g_activeState = g_aSTATES[g_stateIndex];
    g_activeState.Begin();
}

function switchState( nextIndex )
{
    if( g_aSTATES[nextIndex] )
    {
        trace('switchState');
        g_activeState.End();
        g_activeState = g_aSTATES[nextIndex];
        g_activeState.Begin();
    }
}