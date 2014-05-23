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

    var jhBox2DWrapper = function() { this.initialize(); };

    jhBox2DWrapper.BOX      = 'box',
    jhBox2DWrapper.BALL     = 'ball',
    jhBox2DWrapper.POLYGON  = 'polygon',
    jhBox2DWrapper.EDGE     = 'edge',
    jhBox2DWrapper.COMPOUND = 'compound',

    jhBox2DWrapper.prototype =
    {

        m_aBODYLIST: [],
        m_mouseDrag: null,

        /**
         * @desc setup method for common app functions
         */
        initialize: function()
        {
            this.$Box2D.initialize.apply( this, arguments );
        },

        /**
         * @desc create
         */
        create: function()
        {
            this.createWorld();
            return this;
        },

        /**
         * @desc withDebugView - adds a debug view to the simulator
         * @param canvasElm - debug view canvas element
         */
        withDebugView: function( canvasElm )
        {
            this.enableDebugView( canvasElm );
            return this;
        },

        /**
         * @desc usingScale - sets simulation scale
         * @param scale - float
         */
        usingScale: function( scale )
        {
            this.m_fScale = scale;
            return this;
        },

        /**
         * @desc withBorders - default canvas rect borders
         */
        withBorders: function()
        {
            // floor
            this.createStaticEdge( this.m_b2World, 0, g_canvasElm.height, g_canvasElm.width, g_canvasElm.height );
            // ceiling
            this.createStaticEdge( this.m_b2World, 0, 0, g_canvasElm.width, 0 );
            // left wall
            this.createStaticEdge( this.m_b2World, 0, 0, 0, g_canvasElm.height );
            // right wall
            this.createStaticEdge( this.m_b2World, g_canvasElm.width, 0, g_canvasElm.width, g_canvasElm.height );

            return this;
        },

        /**
         * @desc withSceneBorders - specified scene borders
         * @param width
         * @param height
         */
        withSceneBorders: function( width, height )
        {
            // floor
            this.createStaticEdge( this.m_b2World, 0, height, width, height );
            // ceiling
            this.createStaticEdge( this.m_b2World, 0, 0, width, 0 );
            // left wall
            this.createStaticEdge( this.m_b2World, 0, 0, 0, height );
            // right wall
            this.createStaticEdge( this.m_b2World, width, 0, width, height );

            return this;
        },

        /**
         * @desc withSceneFloor - floor border
         * @param width
         * @param yOffset
         */
        withSceneFloor: function( width, yOffset )
        {
            this.createStaticEdge( this.m_b2World, 0, g_canvasElm.height+yOffset, width, g_canvasElm.height+yOffset );
            return this;
        },

        /**
         * @desc withSceneCeiling - ceiling border
         * @param width
         * @param yOffset
         */
        withSceneCeiling: function( width, yOffset )
        {
            this.createStaticEdge( this.m_b2World, 0, yOffset, width, yOffset );
            return this;
        },

        /**
         * @desc withSceneBorderLeft - left wall border
         * @param height
         * @param xOffset
         */
        withSceneBorderLeft: function( height, xOffset )
        {
            this.createStaticEdge( this.m_b2World, xOffset, 0, xOffset, height );
            return this;
        },

        /**
         * @desc withSceneBorderRight - right wall border
         * @param height
         * @param xOffset
         */
        withSceneBorderRight: function( height, xOffset )
        {
            this.createStaticEdge( this.m_b2World, g_canvasElm.width+xOffset, 0, g_canvasElm.width+xOffset, height );
            return this;
        },

        /**
         * @desc withGravity - changes sim gravity vector
         * @param x
         * @param y
         */
        withGravity: function( x, y )
        {
            this.m_b2World.m_gravity = new b2Vec2( x, y );
            return this;
        },

        /**
         * @desc isSleeping - changes sim allow sleep flag
         * @param bSleep
         */
        isSleeping: function( b )
        {
            if( typeof(b) == 'undefined' ) b = true;
            this.m_b2World.m_allowSleep = b;
            return this;
        },

        /**
         * @desc adds collision listener relay to simulator
         * @param callback object with each desired collision test
         * @param if unset scope is taken as this box2d wrapper
         */
        withCollisionListener: function( callbacks, scope )
        {
            if( typeof(scope) == 'undefined' ) scope = this;
            this.m_b2World.SetContactListener( new jhCollisionListener( callbacks, scope ) );
            return this;
        },

        /**
         * @desc adds destruction listener relay to simulator for cleanup of
         *      references to child fixtures and joints destroyed.
         * @param callback object with each desired collision test
         * @param if unset scope is taken as this box2d wrapper
         */
        withDestructionListener: function( callbacks, scope )
        {
            if( typeof(scope) == 'undefined' ) scope = this;
            this.m_b2World.SetDestructionListener( new jhDestructionListener( callbacks, scope ) );
            return this;
        },

        /**
         * @desc sets a default fluid area to the simulator
         * @param height offset from top
         */
        withBuoyancyController: function( height )
        {
            this.setBuoyancyController( height, { x:0, y:-1 }, 2.0, 5, 2 );
            return this;
        },

        /**
         * @desc withMouseDrag - enables a mouse joint
         * @param bDrag
         */
        withMouseDrag: function( b )
        {
            if( typeof(b) == 'undefined' ) b = true;
            if( b )
            {
                if( this.m_mouseDrag === null ) this.m_mouseDrag = new jhBox2DMouseDragWrapper( this );
                var func = this.m_mouseDrag.update;
                var scope = this.m_mouseDrag;
                this.mouseUpdate = function(){ func.apply(scope, arguments); };
            }
            else this.mouseUpdate = null;
            return this;
        },

        /**
         * @desc mouseDragAt - updates mouse drag target
         * @param x
         * @param y
         * @param down - mouse down
         */
        mouseDragAt: function( x, y, down )
        {
            if( this.m_mouseDrag !== null )
            {
                this.m_mouseDrag.to( x, y );
                this.m_mouseDrag.drag( down );
            }
        },

        /**
         * @desc addBody - adds a rigid body object to the simulation returning a fluent wrapper
         * @param type - box|ball
         */
        addBody: function( type )
        {
            return this.addToBody( this.m_b2World, type );
        },

        /**
         * @desc addToBody - adds a rigid body object to the simulation returning a fluent wrapper
         * @param parentBody
         * @param type - box|ball
         */
        addToBody: function( parentBody, type )
        {
            var body = null;
            switch( type )
            {
                case jhBox2DWrapper.BOX: body = new jhBox2DBoxWrapper( this, parentBody );
                break;
                case jhBox2DWrapper.BALL: body = new jhBox2DBallWrapper( this, parentBody );
                break;
                case jhBox2DWrapper.POLYGON: body = new jhBox2DPolygonWrapper( this, parentBody );
                break;
                case jhBox2DWrapper.EDGE: body = new jhBox2DEdgeWrapper( this, parentBody );
                break;
                case jhBox2DWrapper.COMPOUND: body = new jhBox2DCompoundWrapper( this, parentBody );
                break;
            }
            if( body ) this.m_aBODYLIST.push( body );
            return body;
        },

        /**
         * @desc obtainRayCaster - defines a ray caster against this simulator
         */
        obtainRayCaster: function()
        {
            return new jhBox2DRayCastWrapper( this ).onWorld( this.m_b2World );
        }
    };
    Object.extend(jhBox2DWrapper, jhBox2D, '$Box2D');

    window.jhBox2DWrapper = jhBox2DWrapper;

}());