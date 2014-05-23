iWonderCubed
============

a quick hack to visualise the BBC iWonder homepage using Web3D.

Concept: Create falling 3D cubes for each promo displayed. The 'load more' piles on more promos. Each is a click to the desired live page and perhaps the hover state displays its metadata.

* ~~port Hawkhead web3D wrappers for generic js~~
* adopt Three.js and add custom classes for whatevers
* Take a snapshot of the iWonder Homepage http://www.bbc.co.uk/iwonder
* Copy each promo image into a library matched by header text
* build simple version of homepage with css driving a responsive canvas
* load sprite library of promo images
* create basic 3D render scene
* render cube objects from hawkhead lib using above library
* add physics simulation
* add physics actors to drop boxes in from height
* add 'load more button' which drops another batch from library
* add extra camera controls bound to mouse position on canvas
* devise mouse to 3D transformation pointer to find mouse over events for each cube
* create click event for each cube rolled over
* fire new element over canvas to display metadata per cube rolled over
* profit