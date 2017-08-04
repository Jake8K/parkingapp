var lattitude = 37.774929;
var longitude = -122.419416;
var map;
var marker;
var infowindow;
var location_window;
var availability_window;
var message_window;
var error_window;
var availability;

function initMap() {
  var coordinates = {};
  coordinates.lat = lattitude;
  coordinates.lng = longitude;

  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 14
  });

  availability_window = new google.maps.InfoWindow({
    content: document.getElementById('availability_window')
  });

  infowindow = new google.maps.InfoWindow({
    content: document.getElementById('form')
  });

  location_window = new google.maps.InfoWindow;

  message_window = new google.maps.InfoWindow({
    content: document.getElementById('message')
  });

  error_window = new google.maps.InfoWindow({
    content: document.getElementById('error_message')
  });

  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });

    google.maps.event.addListener(marker, 'click', function() { 
      availability_window.open(map, this); 
    });

    infowindow.open(map, marker);
  });


  //
  // Request all locations in database and create markers on map
  //
  var request = new XMLHttpRequest();
  request.open('GET', '/location', true);
  request.setRequestHeader('Content-Type', 'application/json'); 
  request.addEventListener('load',function(){
      if(request.status >= 200 && request.status < 400){
        var response = JSON.parse(request.responseText);

        //Make Markers
        for (var i = 0; i < response.length; i++) {
          var latLng = new google.maps.LatLng(response[i].location_lat,response[i].location_lon);
          
          var location = {};

          location.marker = new google.maps.Marker({
            position: latLng,
            map: map
          });

          /*
          google.maps.event.addListener(marker, 'click', function() { 
            document.getElementById("availability_window").textContent = "12 Spaces Left";
            availability_window.open(map, this); 
          }); 
          */
          
        }
      }
      else {
        console.log("Error in network request: " + request.statusText);
      }
  }); 
  request.send();
}

function useGPS() {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      location_window.setPosition(pos);
      location_window.setContent('Location found.');
      location_window.open(map);
      map.setCenter(pos);
    }, function() {
        handleLocationError(true, location_window, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, location_window, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function submitData() {
  availability = escape(document.getElementById('availability').value);
  var latlng = marker.getPosition();
  var lat = latlng.lat()
  var lng = latlng.lng()

  var request = new XMLHttpRequest();
  var payload = {location_lat: lat, location_lon: lng, location_availability: availability};
  request.open('POST', '/location', true);
  request.setRequestHeader('Content-Type', 'application/json'); 
  request.addEventListener('load',function(){
      if(request.status >= 200 && request.status < 400){
          var response = JSON.parse(request.responseText);
          console.log(response);
          infowindow.close();
          message_window.open(map, marker);
      }
      else {
          console.log("Error in network request: " + request.statusText);
          infowindow.close();
          error_window.open(map, marker);
      }
  }); 
  request.send(JSON.stringify(payload));
}