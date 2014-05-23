var config = {
    // demo
    demo_initial_cube_drop_total: 5,
    demo_load_more_button_id: 'load-more-button',
    demo_promo_id: 'promo',

    // canvas objects
    canvas_webgl_canvas_name: 'webglCanvas',
    canvas_demo_canvas_name: 'demoCanvas',
    canvas_debug_canvas_name: 'debugCanvas',

    // createjs
    ticker_root_framerate: 67,

    // three
    three_cube_size: 50,

    // box2d
    box2d_scene_width: 1200,
    box2d_scene_height: 600,
    box2d_simulation_scale: 12,//32,
    box2d_cube_size: 70
};

var image_config = function() {
    var set = [];
    set.push( { id: "p01z7jn5", text: "Why is Dylan Thomas so popular in America?" } );
    set.push( { id: "p01z4kw7", text: "Dreams, data and downloads: 20 years of the BBC on the web" } );
    set.push( { id: "p01z25tm", text: "How can I avoid dodgy builders?" } );
    set.push( { id: "p01z0gn5", text: "Why did ordinary people commit atrocities in the Holocaust?" } );
    set.push( { id: "p01z0g7x", text: "Do you have to listen to Dylan Thomas?" } );
    set.push( { id: "p01yssxs", text: "Why do Buddhists meditate?" } );
    set.push( { id: "p01yssvb", text: "Is bread bad for you?" } );
    set.push( { id: "p01vgmtw", text: "Has history misjudged the generals of WW1?" } );
    set.push( { id: "p01ydykg", text: "Should three-year-olds learn to cook?" } );
    set.push( { id: "p01ydtcd", text: "Could you be a poet?" } );
    set.push( { id: "p01vmbz6", text: "How do we know the Big Bang actually happened?" } );
    set.push( { id: "p01yd8ss", text: "How did Dylan Thomas help Britain's wartime propaganda?" } );
    set.push( { id: "p01w4lrs", text: "Is rocket science easier than you think?" } );
    set.push( { id: "p01y4jpw", text: "Was Dylan Thomas a grafter or a drunk?" } );
    set.push( { id: "p01w057w", text: "How did a WW1 hospital revolutionise mental healthcare?" } );
    set.push( { id: "p01y3k01", text: "Under Milk Wood: how did Dylan make us 'love the words'?" } );
    set.push( { id: "p01vglpx", text: "How did Pack Up Your Troubles become the viral hit of WW1?" } );
    set.push( { id: "p01vgnl4", text: "Did WW1 change French composer Ravel and his music?" } );

    return set;
};