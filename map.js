function initMap() {


    google.maps.LatLng.prototype.kmTo = function (a) {
        var e = Math, ra = e.PI / 180;
        var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
        var g = this.lng() * ra - a.lng() * ra;
        var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos
            (c) * e.pow(e.sin(g / 2), 2)));
        return f * 6378.137;
    }

    google.maps.Polyline.prototype.inKm = function (i) {
        var a = this.getPath(), len = a.getLength(), dist = 0;
        for (; i >= 0; i--) {
            dist += a.getAt(i).kmTo(a.getAt(i + 1));
        }
        return dist;
    }


    var locations = jQuery.getJSON('https://raw.githubusercontent.com/pierreroudaut/transat-route/master/markers.json', (markers) => {
        var coords = markers.map((marker) => (
            {
                'lat': marker.location[0],
                'lng': marker.location[1],
                'marker': marker
            }
        ));
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 28.6795245, lng: -35.6921932 },
            mapTypeId: 'hybrid'
        });

        var polyline = new google.maps.Polyline({
            path: coords,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 5
        });

        var is_equal = (first, second) => first.substr(0, first.indexOf('.') + 2) == second.substr(0, second.indexOf('.') + 2);

        // Open the InfoWindow on mouseover:
        google.maps.event.addListener(polyline, 'click', function (e) {
            infoWindow.setPosition(e.latLng);
            let elat = e.latLng.lat().toString();
            let elng = e.latLng.lng().toString();
            let pointInfoIndex = _.findIndex(coords, p => is_equal(elat, p.lat.toString()) && is_equal(elng, p.lng.toString()));

            function windAngleToCompass(twa) {
                let val = parseInt((twa / 22.5) + 0.5);
                let arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
                return arr[(val % 16)];
            }

            if (pointInfoIndex != -1) {
                let pointInfo = coords[pointInfoIndex];
                let m = pointInfo.marker;
                _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
                let traveledInKm =  Math.round(polyline.inKm(pointInfoIndex));
                let traveledInNmi = Math.round(traveledInKm / 1.852);
                let template = _.template(`<ul>
                <li>Date: {{m.date}}</li>
                <li>Cap: {{m.cog}}°</li>
                <li>Speed: {{m.sog}} knts</li>
                <li>Wind: {{compass}} | {{m.tws}}knts </li>
                <li>Traveled: {{traveledInNmi}}nm ({{traveledInKm}}km) </li>
                </ul>`);
                infoWindow.setContent(template({
                    'm': m,
                    'compass': windAngleToCompass(m.twa),
                    'traveledInKm':  traveledInKm,
                    'traveledInNmi':  traveledInNmi,
                }));
                infoWindow.open(map);
            }
        });

        var infoWindow = new google.maps.InfoWindow();
        polyline.setMap(map);
    });
}
