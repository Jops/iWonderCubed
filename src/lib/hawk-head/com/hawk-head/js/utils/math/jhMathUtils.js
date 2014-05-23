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
 * <summary>simple collection of math helper functions.</summary>
 */

/**
 * @desc degreesToRadians
 * @param degrees - value 0.0 -> 359.9 to transform
 * @return float
 */
function jhMath_degreesToRadians( degrees )
{
    return degrees * Math.PI / 180;
}

/**
 * @desc radiansToDegrees
 * @param radians - value to transform
 * @return float
 */
function jhMath_radiansToDegrees( radians )
{
    return radians / (180 * Math.PI);
}

/**
 * @desc applies 2D spring to a display object returning the new
 *       point incremenation
 * @param obj - display object with xy vec
 * @param target - xy vec target
 * @param potential - the current displacement xy vec (from last calculation)
 * @param inertia - value from 0.1 - 0.9 (default 0.9)
 * @param kinetic - value from 0.1 - 0.9 (default 0.5)
 */
function jhMath_applySpring( obj, target, potential, inertia, kinetic )
{
    var dist    = -obj.x + target.x;
    potential.x = potential.x*inertia + dist*kinetic;
    dist        = -obj.y + target.y;
    potential.y = potential.y*inertia + dist*kinetic;
    return potential;
}

/**
 * @desc calculates and returns the position movement along
 *       a single spring value
 * @param value - value to displace
 * @param target - xy vec target
 * @param potential - the current displacement value (from last calculation)
 * @param inertia - value from 0.1 - 0.9 (default 0.9)
 * @param kinetic - value from 0.1 - 0.9 (default 0.5)
 */
function jhMath_applySpringAxis( value, target, potential, inertia, kinetic )
{
    return ( potential*inertia + (-value+target)*kinetic );
}