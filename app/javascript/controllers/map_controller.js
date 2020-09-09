import { Controller } from 'stimulus'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import places from 'places.js';

export default class extends Controller {
  static targets = ['map']

  connect() {
    this.initMapbox()
    this.initAutocomplete()
    this.markers = []
    this.map = null
  }

  initMapbox() {
    if (this.mapTarget) { // only build a map if there's a div#map to inject into
      mapboxgl.accessToken = this.mapTarget.dataset.mapboxApiKey;
      this.markers = JSON.parse(this.mapTarget.dataset.markers);

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 10
      });

      this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl }));

      this.showMarkers()
      this.fitMapToMarkers()
    }
  }

  showMarkers() {
    this.markers.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.infoWindow);

      const element = document.createElement('div');
      element.className = 'marker';
      element.style.backgroundImage = `url('${marker.image_url}')`;
      element.style.backgroundSize = 'contain';
      element.style.width = '25px';
      element.style.height = '25px';

      new mapboxgl.Marker(element)
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
      this.markers.forEach(marker => bounds.extend([ marker.lng, marker.lat ]));
      this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  }

  initAutocomplete = () => {
    const addressInput = document.getElementById('flat_address');
    if (addressInput) {
      places({ container: addressInput });
    }
  };
}