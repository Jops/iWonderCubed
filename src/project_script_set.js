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
 * <summary>initial script loader and base javascript file.</summary>
 */

Object.extend = function( child, parent, superStr )
{
    var p = {};
    p.prototype = {};
    var property;
    for( property in parent.prototype )
        p.prototype[property] = parent.prototype[property];
    for( property in child.prototype )
        p.prototype[property] = child.prototype[property];
    child.prototype             = p.prototype;
    child.prototype[superStr]   = parent.prototype;
    // for( var property in parentSrc )
    // {
    //     if( property.indexOf("parent_") !== -1 ) continue;
    //     if( destination.hasOwnProperty(property) && typeof destination[property] == 'function' )
    //         destination["parent_"+property] = destination[property];
    //     destination[property] = parentSrc[property];
    // }
};

Object.createHandler = function( scope, handler )
{
    return function() { handler.apply(scope, arguments); };
};

var g_queue = new createjs.LoadQueue(false);

// hawk-head lib scripts
var g_hawkheadEnginePrefix = '../../Dropbox/html5_Canvas/';
// var g_hawkheadEnginePrefix = 'src/lib/';
g_queue.loadManifest( [
                        // utils
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/debug/jhTraceWindow.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/js/utils/jhDictionary.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/js/utils/math/jhMathUtils.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/js/utils/math/jhVec2.js",
                        // scenes
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/js/scenes/jhBaseScene.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/scenes/jhCreateJSScene.js",
                        // box2d
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/jhBox2D.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/jhBox2DWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/collision/jhCollisionListener.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/destruction/jhDestructionListener.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/body/jhBox2DBodyWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/body/jhBox2DBoxWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/body/jhBox2DBallWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/body/jhBox2DPolygonWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/body/jhBox2DEdgeWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/body/jhBox2DCompoundWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/raycast/jhBox2DRayCastWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/joint/jhBox2DMouseDragWrapper.js",
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/physics/box2d/resources/jhJsonParser.js",
                        // loading
                        g_hawkheadEnginePrefix+"hawk-head/com/hawk-head/createjs/preload/jhPreloadJS.js",
                    ] );
g_queue.addEventListener( 'complete', hawkhead_files_load );
g_queue.load();

function hawkhead_files_load()
{
    g_queue.removeEventListener( 'complete', hawkhead_files_load );
    g_queue.loadFile( "src/js/config/config.js" );
    g_queue.loadFile( "src/js/scenes/Scene.js" );
    g_queue.loadFile( "src/js/scenes/Preloader.js" );
    g_queue.loadFile( "src/js/scenes/Intro.js" );
    g_queue.loadFile( "src/js/scenes/Demo.js" );
    g_queue.loadFile( "src/js/demo/iWonderDemoWrapper.js" );
    g_queue.addEventListener( 'complete', project_includes_loaded );
    g_queue.load();
}

function project_includes_loaded()
{
    g_queue.removeEventListener( 'complete', project_includes_loaded );
    g_queue.loadFile( "src/js/jhApp.js" );
    g_queue.addEventListener( 'complete', app_loaded );
    g_queue.load();
}

function app_loaded() // note: app_run() seems to be taken??
{
    g_queue.removeEventListener( 'complete', app_loaded );
    window.onload = function()
    {
        main();
    };
}