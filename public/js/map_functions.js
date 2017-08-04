var lattitude = 37.774929;
var longitude = -122.419416;
var map;
var marker;
var infowindow;
var locationwindow;
var messagewindow;
var errorwindow;

function initMap() {
  var coordinates = {};
  coordinates.lat = lattitude;
  coordinates.lng = longitude;

  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 14
  });

  infowindow = new google.maps.InfoWindow({
    content: document.getElementById('form')
  });

  locationwindow = new google.maps.InfoWindow;

  messagewindow = new google.maps.InfoWindow({
    content: document.getElementById('message')
  });

  errorwindow = new google.maps.InfoWindow({
    content: document.getElementById('errormessage')
  });

  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
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
            var marker = new google.maps.Marker({
              position: latLng,
              map: map
            });

            this.marker.addListener('click', function() {
              infowindow.open(map, this.marker);
            });
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

      locationwindow.setPosition(pos);
      locationwindow.setContent('Location found.');
      locationwindow.open(map);
      map.setCenter(pos);
    }, function() {
        handleLocationError(true, locationwindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, locationwindow, map.getCenter());
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
  var availability = escape(document.getElementById('availability').value);
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
          messagewindow.open(map, marker);
      }
      else {
          console.log("Error in network request: " + request.statusText);
          infowindow.close();
          errorwindow.open(map, marker);
      }
  }); 
  request.send(JSON.stringify(payload));
}