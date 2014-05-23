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
 * <summary>Introduction scene plays after main product load has finished.</summary>
 */

(function() {

    var jhIntro = function( stage ) { this.initialize( stage ); };
    jhIntro.prototype =
    {
        displayText: null,

        Begin: function()
        {
            this.$Scene.Begin.apply( this, arguments );

            this.activeState = this.stateBegin;
        },

        stateBegin: function()
        {
            this.displayText = this.container.addChild(new createjs.Text("STARTING", "36px visitor1", "#230012"));
            this.displayText.x = -this.displayText.getMeasuredWidth()/2;
            this.displayText.y = -this.displayText.getMeasuredHeight();
            this.activeState = this.stateEnd;
        },

        stateEnd: function()
        {
            this.container.removeChild( this.displayText );
            progressState();
        },

        resize: function( w, h )
        {
        },

        End: function()
        {
            this.$Scene.End.apply( this, arguments );
        }
    };
    Object.extend(jhIntro, Scene, '$Scene');

    window.Intro = jhIntro;

}());