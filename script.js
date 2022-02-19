var panorama, viewer, container, infospot, controlButton, modeButton, videoButton;

var controlIndex = PANOLENS.CONTROLS.ORBIT;
var modeIndex = 0;
var videoPlaying = false;

container = document.querySelector( '#container' );
controlButton = document.querySelector( '#controlButton' );
modeButton = document.querySelector( '#modeButton' );
videoButton = document.querySelector( '#videoButton' );

panorama = new PANOLENS.ImagePanorama( 'https://chocolatevs.github.io/Campus360-JS/default_panorama.jpg' );

//infospot = new PANOLENS.Infospot( 450, PANOLENS.DataImage.Info );
//infospot.position.set( 0, 0, -100 );

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




////GET LOCATIONS
$(document).ready(function() {
  $.ajax({
      type: "GET",
      url: "https://chocolatevs.github.io/Campus360-JS/LOCATIONS/phonebook.csv",
      dataType: "text",
      success: function(data) {processData(data);}
   });
});

function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];

  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {

          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
          lines.push(tarr);
      }
  }
  console.log(lines);
}