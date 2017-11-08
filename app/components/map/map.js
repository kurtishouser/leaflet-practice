import './map.scss';
import L from 'leaflet';

import { Component } from '../component';

const template = '<div ref="mapContainer" class="map-container"></div>';

// hack for webpack(?) issue
// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-261904061
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Leaflet Map Component
 * Render Resilience Map items, and provide user interactivity.
 * @extends Component
 */
export class Map extends Component {
  /** Map Component Constructor
   * @param { String } placeholderId Element ID to inflate the map into
   * @param { Object } props.events.click Map item click listener
   */
  constructor (mapPlaceholderId, props) {
    super(mapPlaceholderId, props, template)

    // Initialize Leaflet map
    this.map = new L.Map(this.refs.mapContainer);

    // create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });

    // start the map in Northern San Francisco
    this.map.setView(new L.LatLng(37.78, -122.44), 14);
    this.map.zoomControl.setPosition('bottomright') // Position zoom control
    this.map.addLayer(osm);
  }

  addMarkers (markers) {
    markers.forEach(m => {
      L.marker([m.coordinates[1], m.coordinates[0]]).addTo(this.map).bindPopup(m.title);
    });
  }
}
