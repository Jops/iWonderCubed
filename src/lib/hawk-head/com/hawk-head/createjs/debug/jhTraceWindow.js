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

var jhTraceWindow = function( debugContainer ) { this.initialize( debugContainer ); };
jhTraceWindow.prototype = {

    text: null,
    aTRACES: null,
    lineLimit: 10,
    lnNum: 0,

    /**
     * @desc adds a new convas to a specified container for drawing debug data
     * @param debugContainer - createJS object to attach debug window
     */
    initialize: function( debugContainer )
    {
        this.aTRACES = [];
        this.text = debugContainer.addChild( new createjs.Text(":: Debug Window ::", "bold 8px Arial", "#663333") );
        this.text.lineHeight = 15;
        this.text.textBaseline = "top";
    },

    /**
     * @desc outputs text message to debug window
     * @param msg - text to add to debug display
     */
    trace: function( msg )
    {
        msg = 'DEBUG '+(++this.lnNum)+' :: '+msg;
        this.aTRACES.unshift( msg );
        this.aTRACES.length = this.lineLimit;
        if( window.console && window.console.log )
            window.console.log(msg);
        this.renderTraces();
    },

    /**
     * @desc updates debug text for display
     */
    renderTraces: function()
    {
        var msg = "";
        [].forEach.call(this.aTRACES, function(item) {
            msg = item + "\n" + msg;
        });
        this.text.text = msg;
    }
};