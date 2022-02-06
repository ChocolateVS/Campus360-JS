var panorama, viewer, container, infospot, controlButton, modeButton, videoButton;

var controlIndex = PANOLENS.CONTROLS.ORBIT;
var modeIndex = 0;
var videoPlaying = false;

container = document.querySelector( '#container' );
controlButton = document.querySelector( '#controlButton' );
modeButton = document.querySelector( '#modeButton' );
videoButton = document.querySelector( '#videoButton' );

panorama = new PANOLENS.ImagePanorama( 'https://chocolatevs.github.io/Campus360-JS/MAPS/Test%20Block/1644143320653.jpg' );

infospot = new PANOLENS.Infospot( 350, PANOLENS.DataImage.Info );
infospot.position.set( 0, -2000, -5000 );

panorama.add( infospot );

viewer = new PANOLENS.Viewer( { container: container } );
viewer.add( panorama );

// Method to trigger control
controlButton.addEventListener( 'click', function(){

  controlIndex = controlIndex >= 1 ? 0 : controlIndex + 1;
  
  switch ( controlIndex ) {
      
    case 0: viewer.enableControl( PANOLENS.CONTROLS.ORBIT ); break;
    case 1: viewer.enableControl( PANOLENS.CONTROLS.DEVICEORIENTATION ); break;
    default: break;
      
  }

} );

modeButton.addEventListener( 'click', function(){
  
  modeIndex = modeIndex >= 2 ? 0 : modeIndex + 1;
  
  switch ( modeIndex ) {
      
    case 0: viewer.disableEffect(); break;
    case 1: viewer.enableEffect( PANOLENS.MODES.CARDBOARD ); break;
    case 2: viewer.enableEffect( PANOLENS.MODES.STEREO ); break;
    default: break;
      
  }

} );

// if it's video panorama
videoButton.addEventListener( 'click', function(){
  
  videoPlaying = !videoPlaying;
  viewer.toggleVideoPlay( videoPlaying ? false : true );
  
} );