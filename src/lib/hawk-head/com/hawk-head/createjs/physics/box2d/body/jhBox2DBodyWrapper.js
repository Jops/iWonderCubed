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

    var jhBox2DBodyWrapper = function( b2wrapper ) { this.initialize( b2wrapper ); };
    jhBox2DBodyWrapper.prototype = {

        m_b2: null,
        m_b2ParentBody: null,
        m_b2Body: null,
        m_oUserData: null,
        m_x: 0.0,
        m_y: 0.0,
        m_fRestitution: 0.2,
        m_fFriction: 0.2,
        m_fDensity: 1.0,
        m_bFixed: false,
        m_fScale: 0,

        /**
         * @desc setup method for common app functions
         * @param wrapper class for box2d simulation
         */
        initialize: function( b2wrapper )
        {
            this.m_b2 = b2wrapper;
            this.m_fScale = b2wrapper.m_fScale;
            this.m_oUserData = { name: 'body_'+parseInt(Math.random()*10000000, 16), fixtures: {} };
        },

        /**
         * @desc appends properties to the box2d object data pointer
         * @param user defined object
         */
        withUserData: function( userData )
        {
            // adds or replaces properties on the default body data object
            for( var item in userData ) this.m_oUserData[item] = userData[item];
            return this;
        },

        /**
         * @desc at - cartesian co-ord
         * @param x
         * @param y
         */
        at: function( x, y )
        {
            this.m_x = x;
            this.m_y = y;
            return this;
        },

        /**
         * @desc ofDensity - effectively mass
         * @param density
         */
        ofDensity: function( density )
        {
            this.m_fDensity = density;
            return this;
        },

        /**
         * @desc withFriction - contact energy reduction
         * @param friction
         */
        withFriction: function( friction )
        {
            this.m_fFriction = friction;
            return this;
        },

        /**
         * @desc withRestitution - contact energy transfer/loss
         * @param restitution
         */
        withRestitution: function( restitution )
        {
            this.m_fRestitution = restitution;
            return this;
        },

        /**
         * @desc isStatic - part of world fixed geometry
         * @param bStatic
         */
        isStatic: function( bStatic )
        {
            this.m_bFixed = bStatic;
            return this;
        },

        /**
         * @desc destroySelf - destroyes this body
         */
        destroySelf: function()
        {
            this.m_b2.destroyBody(this.m_b2Body);
        }

    };

    window.jhBox2DBodyWrapper = jhBox2DBodyWrapper;

}());