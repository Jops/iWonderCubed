/*
* Copyright (c) 2012 Jonathan HW Halkett http://www.hawk-head.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

var jhPreloadJS = function(){ this.initialize(); };

jhPreloadJS.FILECOMPLETE                        = 'fileload';
jhPreloadJS.PROGRESS                            = 'progress';
jhPreloadJS.FILEPROGRESS                        = 'fileprogress';
jhPreloadJS.ERROR                               = 'error';
jhPreloadJS.COMPLETE                            = 'complete';
jhPreloadJS.CALLBACKS                           = [];

jhPreloadJS.prototype =
{
    // images
    numImages: 0,
    numLoaded: 0,
    queue: null,
    MANIFEST: null,

    initialize: function()
    {
        this.numImages                           = 0;
        this.numLoaded                           = 0;
        this.MANIFEST                            = [];
        // If there is an open queue, close it.
        if( this.queue !== null ) this.queue.close();
        // create load queue
        this.queue = new createjs.LoadQueue(false);
        this.queue.addEventListener( jhPreloadJS.FILECOMPLETE, this.handleFileLoad );
        this.queue.addEventListener( jhPreloadJS.PROGRESS, this.handleOverallProgress );
        this.queue.addEventListener( jhPreloadJS.FILEPROGRESS, this.handleFileProgress );
        this.queue.addEventListener( jhPreloadJS.ERROR, this.handleFileError );
        this.queue.addEventListener( jhPreloadJS.COMPLETE, this.handleLoadComplete );
        this.queue.setMaxConnections(5);
    },

    loadCollection: function( collection )
    {
        // get num of sources
        for( var src in collection ) ++this.numImages;
        for( src in collection )
        {
            trace('Loading image '+src+': '+collection[src]);
            this.MANIFEST.push( { id:src, src:collection[src] } );
        }
        this.queue.loadManifest( this.MANIFEST );
        this.queue.load();
    },

    stop: function()
    {
        if( this.queue !== null ) this.queue.close();
    },

    loadOne: function( src, tag )
    {
        this.queue.loadFile( { id:tag, src:src } );
    },

    addCallback: function( type, cb, scope )
    {
        jhPreloadJS.CALLBACKS[type] = function() { cb.apply(scope, arguments); };
    },

    getAsset: function( id )
    {
        return this.queue.getResult( id );
    },

    handleLoadComplete: function( event )
    {
        stop();
        var cbFn = jhPreloadJS.CALLBACKS[jhPreloadJS.COMPLETE];
        if( cbFn ) cbFn( event );
        else trace('ALL FILES LOADED');
    },

    // File complete handler
    handleFileLoad: function( event )
    {
        var cbFn = jhPreloadJS.CALLBACKS[jhPreloadJS.FILECOMPLETE];
        if( cbFn ) cbFn( event );
        else trace( "FILE LOADED: "+event.item.src );
    },

    // File progress handler
    handleFileProgress: function( event )
    {
        var cbFn = jhPreloadJS.CALLBACKS[jhPreloadJS.FILEPROGRESS];
        if( cbFn ) cbFn( event );
        else
        {
            var perc = event.target.progress * 100;
            trace('LOAD_FILE_PROGRESS: '+perc);
        }
    },

    // Overall progress handler
    handleOverallProgress: function( event )
    {
        var cbFn = jhPreloadJS.CALLBACKS[jhPreloadJS.PROGRESS];
        if( cbFn ) cbFn( event );
        else
        {
            var perc = event.target.progress * 100;
            trace('LOAD_PROGRESS: '+perc);
        }
    },

    // An error happened on a file
    handleFileError: function( event )
    {
        var cbFn = jhPreloadJS.CALLBACKS[jhPreloadJS.ERROR];
        if( cbFn ) cbFn( event );
        else trace('FILE load error: '+event.item.src);
    }
};