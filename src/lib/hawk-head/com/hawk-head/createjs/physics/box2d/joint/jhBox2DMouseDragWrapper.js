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

    var jhBox2DMouseDragWrapper = function( b2wrapper ) { this.initialize( b2wrapper ); };
    jhBox2DMouseDragWrapper.prototype = {

        m_b2: null,
        m_joint: null,
        m_x: 0,
        m_y: 0,
        m_pVec: null,
        m_down: false,

        /**
         * @desc setup method for common app functions
         * @param wrapper class for box2d simulation
         */
        initialize: function( b2wrapper )
        {
            this.m_b2 = b2wrapper;
        },

        /**
         * @desc update - places or updates the mousejoint
         */
        update: function()
        {
            // mouse press
            if( this.m_down && !this.m_joint )
            {
                var body = this.m_b2.GetBodyAtPoint( this.m_x, this.m_y );
                if( body )
                {
                    var md = new b2MouseJointDef();
                    md.bodyA = this.m_b2.m_b2World.GetGroundBody();
                    md.bodyB = body;
                    md.target.Set( this.m_x, this.m_y );
                    md.collideConnected = true;
                    md.maxForce = 300.0 * body.GetMass();
                    this.m_joint = this.m_b2.m_b2World.CreateJoint( md );
                    body.SetAwake(true);
                }
            }
            // mouse release
            if( !this.m_down )
            {
                if( this.m_joint )
                {
                    this.m_b2.m_b2World.DestroyJoint( this.m_joint );
                    this.m_joint = null;
                }
            }
            // mouse move
            if( this.m_joint )
            {
                this.m_joint.SetTarget( new b2Vec2( this.m_x, this.m_y ) );
            }
        },

        /**
         * @desc to - cartesian co-ord
         * @param x
         * @param y
         */
        to: function( x, y )
        {
            this.m_x = x/this.m_b2.m_fScale;
            this.m_y = y/this.m_b2.m_fScale;
        },

        /**
         * @desc drag - engage or disengage drag
         * @param bDrag
         */
        drag: function( b )
        {
            if( typeof(b) == 'undefined' ) b = true;
            this.m_down = b;
        }

    };

    window.jhBox2DMouseDragWrapper = jhBox2DMouseDragWrapper;

}());