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

// Box2d vars
var b2AABB               = Box2D.Collision.b2AABB;
var b2Vec2               = Box2D.Common.Math.b2Vec2;
var b2BodyDef            = Box2D.Dynamics.b2BodyDef;
var b2Body               = Box2D.Dynamics.b2Body;
var b2FixtureDef         = Box2D.Dynamics.b2FixtureDef;
var b2Fixture            = Box2D.Dynamics.b2Fixture;
var b2MouseJointDef      = Box2D.Dynamics.Joints.b2MouseJointDef;
var b2RevoluteJointDef   = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2DistanceJointDef   = Box2D.Dynamics.Joints.b2DistanceJointDef;
var b2PrismaticJointDef  = Box2D.Dynamics.Joints.b2PrismaticJointDef;
var b2GearJointDef       = Box2D.Dynamics.Joints.b2GearJointDef;
var b2PulleyJointDef     = Box2D.Dynamics.Joints.b2PulleyJointDef;
var b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController;
var b2World              = Box2D.Dynamics.b2World;
var b2Shape              = Box2D.Collision.Shapes.b2Shape;
var b2PolygonShape       = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape        = Box2D.Collision.Shapes.b2CircleShape;
var b2EdgeChainDef       = Box2D.Collision.Shapes.b2EdgeChainDef;
var b2DebugDraw          = Box2D.Dynamics.b2DebugDraw;

(function() {

    var jhBox2D = function() { this.initialize(); };
    jhBox2D.prototype =
    {
        m_oCanvasElm: null,
        m_oCanvasContext: null,
        m_oDebugDraw: null,
        m_b2World: null,
        m_b2Ground: null,
        m_fScale: 32,
        m_fStep: 20,
        m_fTimeStep: 1.0/20,
        m_fVelocityIterations: 8,
        m_fPositionIterations: 3,
        m_ctrlBuoyancy: null,

        // working vars
        i: 0, dt: 0, now: 0, func: null,
        fixedTimestepAccumulator: 0,
        lastTimestamp: 0, _o: null,
        vec: null,

        bodyMap: {},
        fixtureMap: {},
        jointMap: {},
        jointThresholdMap: {},
        bodiesToRemove: [],
        fixturesToRemove: [],
        jointsToRemove: [],

        // mouse interaction
        mouseUpdate: null,

        /**
         * @desc setup method for common app functions
         */
        initialize: function()
        {
            this.init();
        },

        /**
         * @desc setup method for common app functions
         */
        init: function()
        {
            this.m_fTimeStep       = 1.0/this.m_fStep;
            this.vec               = new b2Vec2();
            this.bodyMap           = {};
            this.fixtureMap        = {};
            this.jointMap          = {};
            this.jointThresholdMap = {};
            this.bodiesToRemove    = [];
            this.fixturesToRemove  = [];
            this.jointsToRemove    = [];
        },

        /**
         * @desc responsive method to resize the sim canvas
         * @param w - resize dimension
         * @param h - resize dimension
         */
        resize: function( w, h )
        {
            this.m_oCanvasElm.width = w; //max width
            this.m_oCanvasElm.height = h; //max height
        },

        /**
         * @desc removes every body from the world
         */
        clearWorld: function()
        {
            var key;
            // remove fixtures before world timestep
            for( key in this.fixtureMap ) this.clearFixture( key );
            // remove bodies before world timestep
            for( key in this.bodyMap ) this.clearBody( key );
            // remove joints before world timestep
            for( key in this.jointMap ) this.clearJoint( key );
        },
        clearBody: function( key )
        {
            var _o = this.bodyMap[key];
            var item;
            for( item in _o.GetUserData().fixtures )
                this.clearFixture( item );
            this.bodyMap[key] = null;
            delete this.bodyMap[key];
            this.m_b2World.DestroyBody(_o);
        },
        clearFixture: function( key )
        {
            var _o = this.fixtureMap[key];
            this.fixtureMap[key] = null;
            delete this.fixtureMap[key];
            _o.GetBody().GetUserData().fixtures[key] = null;
            delete _o.GetBody().GetUserData().fixtures[key];
            _o.GetBody().DestroyFixture(_o);
        },
        clearJoint: function( key )
        {
            var _o = this.jointMap[key];
            this.jointMap[key] = null;
            delete this.jointMap[key];
            this.m_b2World.DestroyJoint(_o);
        },

        /**
         * @desc Step method to update the simulation
         * @param draw flag for debug imagery
         */
        Step: function( bDraw )
        {
            // remove fixtures before world timestep
            while( this.fixturesToRemove.length )
            {
                this._o = this.fixturesToRemove.shift();
                this.clearFixture( this._o.GetUserData().name );
            }
            // remove bodies before world timestep
            while( this.bodiesToRemove.length )
            {
                this._o = this.bodiesToRemove.shift();
                this.clearBody( this._o.GetUserData().name );
            }
            // remove joints before world timestep
            while( this.jointsToRemove.length )
            {
                this._o = this.jointsToRemove.shift();
                this.clearJoint( this._o.GetUserData().name );
            }

            // Update dependant handlers
            if( this.mouseUpdate !== null ) this.mouseUpdate();

            this.m_b2World.Step( this.m_fTimeStep, this.m_fVelocityIterations, this.m_fPositionIterations );

            // break joints on exceeding tolerance
            for( var key in this.jointThresholdMap )
            {
                this._o = this.jointMap[key];
                var tolerance = this.jointThresholdMap[key];
                if( this._o.GetReactionForce(this.m_fStep).Length() > tolerance )
                {
                    this.clearJointTolerance(this._o);
                    this.destroyJoint(this._o);
                }
            }

            this.m_b2World.ClearForces();

            if( bDraw && this.m_oCanvasContext )
            {
                // this.m_b2World.m_debugDraw.m_sprite.graphics.clear();
                this.m_b2World.DrawDebugData();
            }
        },

        /**
         * @desc bounding search returning first hit
         * @param x
         * @param y
         * @param return static object as well
         */
        GetBodyAtPoint: function( x, y, includeStatic )
        {
            if( typeof( includeStatic ) == 'undefined' ) includeStatic = false;
            // Make a small box.
            this.vec.Set( x, y );
            var aabb = new b2AABB();
            aabb.lowerBound.Set( x - 0.001, y - 0.001 );
            aabb.upperBound.Set( x + 0.001, y + 0.001 );
            var bodyHit;
            var pVec = this.vec;
            // Query the world for overlapping shapes.
            function GetBodyCallback( fixture )
            {
                if( fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic )
                {
                    if( fixture.GetShape().TestPoint( fixture.GetBody().GetTransform(), pVec ) )
                    {
                        bodyHit = fixture.GetBody();
                        return false;
                    }
                }
                return true;
            }
            this.m_b2World.QueryAABB(GetBodyCallback, aabb);
            return bodyHit;
        },

        /**
         * @desc bounding search returning array
         * @param x
         * @param y
         * @param width
         * @param height
         * @param return static object as well
         */
        GetBodiesAtRect: function( x, y, w, h, includeStatic, maxObjects )
        {
            if( typeof( includeStatic ) == 'undefined' ) includeStatic = false;
            if( typeof( maxObjects ) == 'undefined' ) maxObjects = 10;
            // Make a small box.
            var aabb = new b2AABB();
            aabb.lowerBound.Set( x - 0.001, y - 0.001 );
            aabb.upperBound.Set( x+w + 0.001, y+h + 0.001 );
            var BODIES = [];
            // Query the world for overlapping shapes.
            function GetBodyCallback( fixture )
            {
                if( fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic )
                {
                    BODIES.push( fixture.GetBody() );
                    if( BODIES.length == maxObjects ) return false;
                }
                return true;
            }
            this.m_b2World.QueryAABB(GetBodyCallback, aabb);
            return BODIES;
        },

        /**
         * @desc builds simulation base
         */
        createWorld: function()
        {
            var gravity = new b2Vec2(0, 10);
            var doSleep = true;
            this.m_b2World = new b2World(gravity, doSleep);
            this.m_b2Ground = this.m_b2World.GetGroundBody();
            return this.m_b2World;
        },

        /**
         * @desc sets debug drawing using the debug context
         * @param debug canvas element
         */
        enableDebugView: function( canvasElm )
        {
            this.m_oCanvasContext = canvasElm.getContext('2d');
            this.m_oDebugDraw = new b2DebugDraw();
            this.m_oDebugDraw.SetSprite( this.m_oCanvasContext );
            this.m_oDebugDraw.SetDrawScale( this.m_fScale );
            this.m_oDebugDraw.SetFillAlpha(0.7);
            this.m_oDebugDraw.SetLineThickness(1.0);
            this.m_oDebugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
            this.m_b2World.SetDebugDraw( this.m_oDebugDraw );
        },

        /**
         * @desc sets debug drawing using the debug context
         * @param translate coord
         * @param translate coord
         */
        moveDebugView: function( x, y )
        {
            this.m_oCanvasContext.translate( x, y );
        },

        /**
         * @desc sets debug drawing using the debug context
         * @param scale axis
         * @param scale axis
         */
        scaleDebugView: function( sx, sy )
        {
            this.m_oCanvasContext.scale( sx, sy );
        },

        /**
         * @desc sets a ground static body
         * @param body to add to
         * @param x position at centre
         * @param y position at centre
         * @param width of box
         * @param height of box
         */
        createStaticBox: function( world, x, y, width, height )
        {
            return this.createBox(world, x, y, width, height, 0.2, 0.2, 0, true);
        },

        /**
         * @desc sets a ground static body
         * @param body to add to
         * @param x1 position of first point
         * @param y1 position of first point
         * @param x2 position of second point
         * @param y2 position of second point
         */
        createStaticEdge: function( world, x1, y1, x2, y2 )
        {
            return this.createEdge(world, 0, 0, x1, y1, x2, y2, 0.2, 0.2, 0, true);
        },

        /**
         * @desc adds a cirle body to world
         * @param body to add to
         * @param x position at centre
         * @param y position at centre
         * @param radius
         * @param restition of collisions
         * @param friction
         * @param density
         * @param static body flag
         */
        createBall: function( world, x, y, radius, restitution, friction, density, fixed )
        {
            if( typeof(fixed) == 'undefined' ) fixed = true;
            var fDef = this.createFixture(restitution, friction, density, fixed);
            fDef.shape = new b2CircleShape( radius/this.m_fScale );
            return this.createBody(world, x, y, fDef, fixed);
        },

        /**
         * @desc adds a box body to world
         * @param body to add to
         * @param x position at centre
         * @param y position at centre
         * @param width of box
         * @param height of box
         * @param restition of collisions
         * @param friction
         * @param density
         * @param static body flag
         */
        createBox: function( world, x, y, width, height, restitution, friction, density, fixed )
        {
            if( typeof(fixed) == 'undefined' ) fixed = true;
            var fDef = this.createFixture(restitution, friction, density, fixed);
            fDef.shape = new b2PolygonShape();
            fDef.shape.SetAsBox( width/this.m_fScale, height/this.m_fScale );
            return this.createBody(world, x, y, fDef, fixed);
        },

        /**
         * @desc adds an edge body to world
         * @param body to add to
         * @param x position of body
         * @param y position of body
         * @param x position at start
         * @param y position at start
         * @param x position at end
         * @param y position at end
         * @param restition of collisions
         * @param friction
         * @param density
         * @param static body flag
         */
        createEdge: function( world, x, y, x1, y1, x2, y2, restitution, friction, density, fixed )
        {
            if( typeof(fixed) == 'undefined' ) fixed = true;
            var fDef = this.createFixture(restitution, friction, density, fixed);
            fDef.shape = new b2PolygonShape();
            fDef.shape.SetAsEdge( new b2Vec2( x1/this.m_fScale, y1/this.m_fScale ), new b2Vec2( x2/this.m_fScale, y2/this.m_fScale ) );
            return this.createBody(world, x, y, fDef, fixed);
        },

        /**
         * @desc adds an edge body to world
         * @param body to add to
         * @param x position of body
         * @param y position of body
         * @param vertexList for the chain points
         * @param restition of collisions
         * @param friction
         * @param density
         * @param static body flag
         */
        createEdgeChain: function( world, x, y, vertexChain, loop, restitution, friction, density, fixed )
        {
            if( typeof(fixed) == 'undefined' ) fixed = true;
            if( typeof(loop) == 'undefined' ) loop = true;
            vertexChain = this.fixVertices( vertexChain );
            var FIXTURES = [];
            var fixture;
            for( var u = 0, l = vertexChain.length-1; u < l; u++ )
            {
                fixture = this.createFixture(restitution, friction, density, fixed);
                fixture.shape = new b2PolygonShape();
                fixture.shape.SetAsEdge(    vertexChain[u],
                                            vertexChain[u+1] );
                FIXTURES.push( fixture );
            }
            var body = this.createBody(world, x, y, FIXTURES.shift(), fixed);
            while( FIXTURES.length )
            {
                body.CreateFixture( FIXTURES.shift() );
            }
            return body;
        },

        /**
         * @desc adds an edge body to world
         * @param body to add to
         * @param x position of body
         * @param y position of body
         * @param vertexList for the shape points
         * @param restition of collisions
         * @param friction
         * @param density
         * @param static body flag
         */
        createPolygon: function( world, x, y, vertexList, restitution, friction, density, fixed )
        {
            if( typeof(fixed) == 'undefined' ) fixed = true;
            var fDef = this.createFixture(restitution, friction, density, fixed);
            fDef.shape = new b2PolygonShape();
            vertexList = this.fixVertices( vertexList );
            fDef.shape.SetAsArray( vertexList, vertexList.length );
            return this.createBody(world, x, y, fDef, fixed);
        },

        /**
         * @desc creates a fixture object for a new body
         * @param restition of collisions
         * @param friction
         * @param density
         * @param static body flag
         */
        createFixture: function( restitution, friction, density, fixed )
        {
            if( typeof(fixed) == 'undefined' ) fixed = true;
            var fixture = new b2FixtureDef();
            fixture.density = density;
            fixture.restitution = restitution;
            fixture.friction = friction;
            return fixture;
        },

        /**
         * @desc adds to the engine maps
         * @param registry object
         * @param data object to assign to pointer
         */
        registerFixture: function( fixture, userData )
        {
            var data = fixture.GetUserData();
            if( data !== null )
            {
                for( var item in userData ) data[item] = userData[item];
                fixture.SetUserData( data );
            }
            else fixture.SetUserData( userData );
            this.fixtureMap[fixture.GetUserData().name] = fixture;
        },

        /**
         * @desc removes a given fixture from the body
         * @param fixture object to destroy
         */
        destroyFixture: function( fixture )
        {
            if( this.fixtureMap[fixture.GetUserData().name] )
                this.fixturesToRemove.push( fixture );
        },

        /**
         * @desc creates a fixture object for a new body
         * @param body to add to
         * @param x position at centre
         * @param y position at centre
         * @param fixture definition for body
         * @param static body flag
         */
        createBody: function( world, x, y, fixture, fixed )
        {
            var bDef = new b2BodyDef();
            if( !fixed ) bDef.type = b2Body.b2_dynamicBody;
            else bDef.type = b2Body.b2_staticBody;
            bDef.position.Set( x/this.m_fScale, y/this.m_fScale );
            var body = world.CreateBody(bDef);
            body.CreateFixture( fixture );
            this.bodyMap[body] = body;
            return body;
        },

        /**
         * @desc adds to the engine maps
         * @param registry object
         * @param data object to assign to pointer
         */
        registerBody: function( body, userData )
        {
            body.SetUserData( userData );
            this.bodyMap[userData.name] = body;
            var _o, i = 0;
            // register each fixture too
            var item = body.GetFixtureList();
            while( item !== null )
            {
                _o = { name: userData.name+'_'+i, body: userData.name };
                this.registerFixture( item, _o );
                userData.fixtures[_o.name] = item;
                ++i;
                item = item.GetNext();
            }
        },

        /**
         * @desc removes a given body from the world
         * @param body to remove
         */
        destroyBody: function( body )
        {
            if( this.bodyMap[body.GetUserData().name] )
                this.bodiesToRemove.push( body );
        },

        /**
         * @desc point joint with a motor mechanism
         * @param first body
         * @param second body
         * @param mutual anchor point
         * @param motor switch on/off
         * @param speed of motor
         * @param max torque strength of motor
         * @param limit on angle enabled
         * @param min angle limit
         * @param max angle limit
         */
        addRevoluteJoint: function( bod1, bod2, anchor, motor, speed, maxTorque, limit, lowerLimit, upperLimit )
        {
            var joint = new b2RevoluteJointDef();
            joint.Initialize( bod1, bod2, new b2Vec2( anchor.x, anchor.y ) );
            joint.enableMotor    = motor;
            joint.enableLimit    = limit;
            joint.motorSpeed     = speed;
            joint.maxMotorTorque = maxTorque;
            joint.lowerLimit     = lowerLimit;
            joint.upperLimit     = upperLimit;
            return this.m_b2World.CreateJoint( joint );
        },

        /**
         * @desc point joint with a motor mechanism
         * @param first body
         * @param second body
         * @param anchor point
         * @param anchor point
         * @param mass-spring-damper frequency in Hertz: 0-30
         * @param dampening ratio: 0 = no damping, 1 = critical damping.
         * @note you can change the length of the distance joint
         */
        addDistanceJoint: function( bod1, bod2, anchor1, anchor2, freqHz, ratio )
        {
            if( typeof(freqHz) == 'undefined' ) freqHz = 10;
            if( typeof(ratio) == 'undefined' ) ratio = 0.5;
            var joint = new b2DistanceJointDef();
            joint.Initialize( bod1, bod2, new b2Vec2( anchor1.x, anchor1.y ), new b2Vec2( anchor2.x, anchor2.y ) );
            joint.frequencyHz  = freqHz;
            joint.dampingRatio = ratio;
            return this.m_b2World.CreateJoint( joint );
        },

        /**
         * @desc slider joint with fixed axis of motion
         * @param first body
         * @param second body
         * @param anchor point
         * @param vector line of motion
         * @param maximum motor force
         */
        addPrismaticJoint: function( bod1, bod2, anchor, plane, motorForce )
        {
            var joint = new b2PrismaticJointDef();
            joint.Initialize( bod1, bod2, new b2Vec2( anchor.x, anchor.y ), plane );
            if( typeof(motorForce) == 'undefined' )
            {
                joint.maxMotorForce = 0;
                joint.enableMotor = false;
            }
            else
            {
                joint.maxMotorForce = motorForce;
                joint.enableMotor = true;
            }
            return this.m_b2World.CreateJoint( joint );
        },

        /**
         * @desc linked joint between/acting on two other joints
         * @param first body
         * @param second body
         * @param joint for body 1
         * @param joint for body 2
         * @param ratio - usually the (radius_2/radius_1) | 0-1.0
         */
        addGearJoint: function( bod1, bod2, joint1, joint2, ratio)
        {
            var joint    = new b2GearJointDef();
            joint.bodyA  = bod1;
            joint.bodyB  = bod2;
            joint.joint1 = joint1;
            joint.joint2 = joint2;
            joint.ratio  = ratio;
            return this.m_b2World.CreateJoint( joint );
        },

        /**
         * @desc joint acting on two bodies with seperate ground anchors
         * @param first body
         * @param second body
         * @param anchor point
         * @param anchor point
         * @param ground anchor point
         * @param ground anchor point
         * @param max length of 1
         * @param max length of 2
         * @param ratio - 0 - 1.0
         */
        addPulleyJoint: function( bod1, bod2, anchor1, anchor2, groundAnchor1, groundAnchor2, maxLength1, maxLength2, ratio )
        {
            var joint = new b2PulleyJointDef();
            joint.Initialize(   bod1,
                                bod2,
                                new b2Vec2( groundAnchor1.x, groundAnchor1.y ),
                                new b2Vec2( groundAnchor2.x, groundAnchor2.y ),
                                new b2Vec2( anchor1.x, anchor1.y ),
                                new b2Vec2( anchor2.x, anchor2.y ),
                                ratio );
            joint.maxLengthA = maxLength1/this.m_fScale;
            joint.maxLengthB = maxLength2/this.m_fScale;
            return this.m_b2World.CreateJoint( joint );
        },

        /**
         * @desc adds to the engine maps
         * @param registry object
         * @param data object to assign to pointer
         */
        registerJoint: function( joint, userData )
        {
            if( typeof( userData ) == 'undefined' ) userData = {};
            if( typeof( userData.name ) == 'undefined' )
                userData.name = 'joint_'+parseInt(Math.random()*10000000, 16);
            var data = joint.GetUserData();
            if( data !== null )
            {
                for( var item in userData ) data[item] = userData[item];
                joint.SetUserData( data );
            }
            else joint.SetUserData( userData );
            this.jointMap[joint.GetUserData().name] = joint;
        },

        /**
         * @desc removes a given joint from the world pre step
         * @param joint to remove
         */
        destroyJoint: function( joint )
        {
            if( this.jointMap[joint.GetUserData().name] )
                this.jointsToRemove.push( joint );
        },

        /**
         * @desc on step comparison of joint force to register a break
         * @param joint to apply break threshold
         * @param break threshold value
         */
        applyJointTolerance: function( joint, tolerance )
        {
            this.jointThresholdMap[joint.GetUserData().name] = tolerance;
        },

        /**
         * @desc removes a specific break threshold from step
         * @param joint to remove
         */
        clearJointTolerance: function( joint )
        {
            this.jointThresholdMap[joint.GetUserData().name] = null;
            delete this.jointThresholdMap[joint.GetUserData().name];
        },

        /**
         * @desc impulse on specific body
         * @param first body
         * @param direction of impulse (normalized)
         * @param magnitude
         * @param anchor point on body to apply impulse
         * @param applies or sets vector on body
         */
        applyImpulse: function( body, vector, power, anchor, incrementive )
        {
            vector.x = vector.x/this.m_fScale;
            vector.y = vector.y/this.m_fScale;
            vector.Normalize();
            vector.Multiply( power );
            power    = power/this.m_fScale;
            if( typeof(anchor) == 'undefined' ) anchor = body.GetWorldCenter();
            if( typeof(incrementive) == 'undefined' ) incrementive = true;
            if( incrementive ) body.ApplyImpulse( vector, anchor );
            else body.SetLinearVelocity( vector );
        },

        /**
         * @desc impulse on region to a singularity
         * @param start
         * @param end
         * @param width
         * @param height
         * @param magnitude
         */
        applyImpulsePoint: function( x, y, w, h, power )
        {
            x     = x/this.m_fScale;
            y     = y/this.m_fScale;
            w     = w/this.m_fScale;
            h     = h/this.m_fScale;
            power = power/this.m_fScale;
            var BODIES = this.GetBodiesAtRect( x-w/2, y-h/2, w, h, false );
            var body = BODIES.pop();
            var pos;
            while( body )
            {
                pos = body.GetPosition();
                pos.Subtract( new b2Vec2( x, y ) );
                pos.Normalize();
                pos.Multiply( power );
                body.ApplyImpulse(  pos,
                                    body.GetWorldCenter() );
                body = BODIES.pop();
            }
        },

        /**
         * @desc impulse on all bodies as ambient force
         * @param start
         * @param end
         * @param width
         * @param height
         * @param direction of impulse (normalized)
         * @param magnitude
         */
        applyImpulseRegion: function( x, y, w, h, vector, power )
        {
            x     = x/this.m_fScale;
            y     = y/this.m_fScale;
            w     = w/this.m_fScale;
            h     = h/this.m_fScale;
            var BODIES = this.GetBodiesAtRect( x, y, w, h, false );
            var body = BODIES.pop();
            while( body )
            {
                this.applyImpulse( body, vector, power );
                body = BODIES.pop();
            }
        },

        /**
         * @desc sets a default fluid area to the simulator
         * @param height offset from top
         * @param surface normal
         * @param water thickness
         * @param motion interference
         * @param rotation interference
         * @param gravity to use (if not set then world gravity used)
         * @param velocity vector
         */
        setBuoyancyController: function( height, normal, density, linearDrag, angularDrag, gravity, velocity )
        {
            var buoyancy = new b2BuoyancyController();
            buoyancy.normal.Set( normal.x, normal.y );
            buoyancy.offset = -height / this.m_fScale;
            buoyancy.density = density;
            buoyancy.linearDrag = linearDrag;
            buoyancy.angularDrag = angularDrag;
            if( typeof( gravity ) == 'undefined' ) buoyancy.useWorldGravity = true;
            else buoyancy.gravity = new b2Vec2( gravity.x / this.m_fScale, gravity.y / this.m_fScale );
            if( typeof( velocity ) != 'undefined' ) buoyancy.velocity = new b2Vec2( velocity.x / this.m_fScale, velocity.y / this.m_fScale );
            this.m_b2World.AddController( buoyancy );
            this.m_ctrlBuoyancy = buoyancy;
            return buoyancy;
        },

        /**
         * @desc sets a default fluid area to the simulator
         * @param body to register
         * @param says whether to add or remove from controller
         */
        registerBuoyancyBody: function( body, add )
        {
            if( typeof( add ) == 'undefined' ) add = true;
            if( add ) this.m_ctrlBuoyancy.AddBody( body );
            else this.m_ctrlBuoyancy.RemoveBody( body );
        },

        /**
         * @desc fixes vertices for scale and type
         * @param list of vertices to fix
         */
        fixVertices: function( LIST )
        {
            for( var u = 0, l = LIST.length; u < l; u++ )
            {
                LIST[u].x /= this.m_fScale;
                LIST[u].y /= this.m_fScale;
                if( !(LIST[u] instanceof b2Vec2) )
                {
                    LIST[u] = new b2Vec2( LIST[u].x, LIST[u].y );
                }
            }
            return LIST;
        },

        /**
         * @desc fires a full raycast with callback method
         * @param simulator to query against
         * @param start vector point
         * @param end vector point
         * @param callback method to return
         */
        rayCast: function( world, start, end, callback )
        {
            world.RayCast( callback, start, end );
        },
        /**
         * @desc raycast callback which shoul return the new length of the next cast
         * @param the fixture hit by the ray
         * @param the point of initial intersection
         * @param the normal vector at the point of intersection
         * @param the fractional length along the ray of the intersection
         */
        rayCastCallback: function( fixture, point, normal, fraction )
        {
            return 0;
        }

        // joint tolerances
    };

    window.jhBox2D = jhBox2D;
}());