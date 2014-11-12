//initialize FB object.
FB.init({
appId      : '1585448541679009',
xfbml      : false,
status     : true,
version    : 'v2.2'
});

function showMap(geocode) {
    var mapOptions = {
      center: { lat: geocode.lat, lng: geocode.lng},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

/**
 * Convert address text into geocode and use the geocode 
 * to display map
 */
function mapMyLocation(address) {
    //geocode location using Nominatim service
    url = 'http://nominatim.openstreetmap.org/search'
    format = 'json';
    addressdetails = '1';
    limit = '1';
    geocode = getGecocode(url, address, format, addressdetails, limit);
    if (showMap) {
        showMap(geocode);    
    }                 
}

function getGecocode(url, location, format, addressdetails, limit) {
    url = url + '?q=' + location + '&format=' + format + '&addressdetails=' + addressdetails + '&limit=' + limit;
    url = encodeURI(url); 
    var response = httpGet(url);
    var latLng = new google.maps.LatLng();
    latLng.lat = Number(response[0].lat);
    latLng.lng = Number(response[0].lon);
    return latLng;
}

/**
 * make AJAX calls and return json result
 */
function httpGet(url){
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    var obj = eval(xmlHttp.responseText);
    return obj;
}
   

/**
 * use FB Graph API to get getails on the current logged in user
 */
function getLoggedInUserDetails() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        FB.api('/me', function(response) {
            var address = response.hometown.name;
            var responseText = '';
            if (address) {
                document.getElementById("status").innerHTML = 
                "Hi " + response.name + " Facebook says you are from " + address
                + "<br/>This is how your hometown looks on a map!";
                mapMyLocation(address);
            } else {
                document.getElementById("status").innerHTML = 
                "Hi " + response.name + " I cannot find  your location on Facebook :(";
            }
            
        });
      }
      else {
        FB.login();
      }
    });   
}
