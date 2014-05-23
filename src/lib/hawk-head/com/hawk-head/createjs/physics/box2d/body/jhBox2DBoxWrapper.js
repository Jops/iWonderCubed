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

(function() {

    var jhBox2DBoxWrapper = function( b2wrapper, parentBody ) { this.initialize( b2wrapper, parentBody ); };
    jhBox2DBoxWrapper.prototype =
    {

        m_fWidth: 1.0,
        m_fHeight: 1.0,

        /**
         * @desc setup method for common app functions
         * @param wrapper class for box2d simulation
         * @param parentBody - the rigidBody to attach the new body to
         */
        initialize: function( b2wrapper, parentBody )
        {
            this.$Body.initialize.apply( this, arguments );
            this.m_b2ParentBody = parentBody;
        },

        /**
         * @desc withSize - dimensions across
         * @param width
         * @param height
         */
        withSize: function( width, height )
        {
            this.m_fWidth = width;
            this.m_fHeight = height;
            return this;
        },

        /**
         * @desc build
         */
        build: function()
        {
            this.m_b2Body = this.m_b2.createBox(    this.m_b2ParentBody,
                                                    this.m_x, this.m_y,
                                                    this.m_fWidth, this.m_fHeight,
                                                    this.m_fRestitution,
                                                    this.m_fFriction,
                                                    this.m_fDensity,
                                                    this.m_bFixed   );
            this.m_b2.registerBody( this.m_b2Body, this.m_oUserData );
            return this.m_b2Body;
        }

    };
    Object.extend(jhBox2DBoxWrapper, jhBox2DBodyWrapper, '$Body');

    window.jhBox2DBoxWrapper = jhBox2DBoxWrapper;

}());