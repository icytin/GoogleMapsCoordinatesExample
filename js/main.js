$(document).ready(function() {
		var geocoder = new google.maps.Geocoder();

		function geocodePosition(pos) {
		  geocoder.geocode({
			latLng: pos
		  }, function(responses) {
			if (responses && responses.length > 0) {
			  updateMarkerAddress(responses[0].formatted_address);
			} else {
			  updateMarkerAddress('Cannot determine address at this location.');
			}
		  });
		}

		function updateMarkerStatus(str) {
		  document.getElementById('markerStatus').innerHTML = str;
		}

		function updateMarkerPosition(latLng) {
		  $('#coordinates').val([
			latLng.lat(),
			latLng.lng()
		  ].join(', '));
		}

		function updateMarkerAddress(str) {
		  document.getElementById('address').innerHTML = str;
		}

		function initialize() {
			var markers = [];
			var latLng = new google.maps.LatLng(62.386846131932316, 17.3155955734253);
			var map = new google.maps.Map(document.getElementById('mapCanvas'), {
				zoom: 8,
				center: latLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			
			_loadMarker(latLng)

			$('#coordinates').change(function(e) { // On coordinates input change
				var coords = $(this).val().split(',');
				if(coords.length == 2) {
					var latLng = new google.maps.LatLng(coords[0], coords[1]);
					_loadMarker(latLng);
				}
				else {
					$(this).css('background', '#f00');
					setTimeout(function() {
						$(this).css('background', '#fff');
					}, 1500);
				}
			});
		  
			function _loadMarker(latLng) {
			
				_clearMarkers();
				
				var marker = new google.maps.Marker({
					position: latLng,
					title: 'Punkt',
					map: map,
					draggable: true
				});
				markers.push(marker);
				
				map.setCenter(marker.getPosition());
				
				// Update current position info.
				updateMarkerPosition(latLng);
				geocodePosition(latLng);

				// Add dragging event listeners.
				google.maps.event.addListener(marker, 'dragstart', function() {
					updateMarkerAddress('Dragging...');
				});

				google.maps.event.addListener(marker, 'drag', function() {
					updateMarkerStatus('Dragging...');
					updateMarkerPosition(marker.getPosition());
				});

				google.maps.event.addListener(marker, 'dragend', function() {
					updateMarkerStatus('Drag ended');
					geocodePosition(marker.getPosition());
				});
			}
			
			function _clearMarkers() {
				_setMapOnAll(null);
			}
			
			function _setMapOnAll(map) {
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(map);
				}
			}
		}
		


		// Onload handler to fire off the app.
		google.maps.event.addDomListener(window, 'load', initialize);
});