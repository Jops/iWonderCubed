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

var g_canvasName;
var g_canvasElm;
var g_debugElm;
var g_stage;
var g_debugContainer;
var g_debugWindow;
var g_assetMap =    {
                        beatle_flight:"style/images/beatle_flight.png",
                        beatle_spawn:"style/images/beatle_spawn.png",
                        hearts:"style/images/hearts_blue.png",
                        drone:"style/images/drone.png",
                        title:"style/images/title.png"
                    };
var g_spriteSheets = {};

var g_aSTATES;
var g_stateIndex = 0;
var g_activeState = null;

function main()
{
    initialise();

    g_debugContainer = g_stage.addChild( new createjs.Container() );
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
    g_canvasName    = 'demoCanvas';
    g_debugName     = 'debugCanvas';
    g_canvasElm     = document.getElementById(g_canvasName);
    g_debugElm      = document.getElementById(g_debugName);
    // createJS stage object
    g_stage         = new createjs.Stage(g_canvasName);

    g_aSTATES         = [
                        new Preloader( g_stage ),
                        new Intro( g_stage ),
                        new Game( g_stage )
                      ];
    g_activeState     = g_aSTATES[g_stateIndex];

    window.onresize = resize;
    // create main loop
    createjs.Ticker.addEventListener("tick", app_tick);
}

function app_tick( event )
{
    g_activeState.DO();
    g_stage.update( event );
}

function resize( event )
{
    g_canvasElm.width = window.innerWidth;
    g_canvasElm.height = window.innerHeight;
    g_debugElm.width = window.innerWidth;
    g_debugElm.height = window.innerHeight;
    g_stage.x = g_canvasElm.width/2;
    g_stage.y = g_canvasElm.height/2;
    g_activeState.resize( window.innerWidth, window.innerHeight );
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