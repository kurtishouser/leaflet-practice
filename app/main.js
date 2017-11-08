import './main.scss';
import template from './main.html';

import { ApiService } from './services/api';
import { Map } from './components/map/map';

/** Main UI Controller Class */
class ViewController {
  /** Initialize Application */
  constructor () {
    document.getElementById('app').outerHTML = template;

    this.api = new ApiService('http://localhost:8080/api');

    this.initializeComponents();
    this.loadMapData();
  }

  /** Initialize Components with data and event listeners */
  initializeComponents () {
    // Initialize Map
    this.mapComponent = new Map('map-placeholder');
  }

  async loadMapData () {
    const markers = await this.api.getMarkers();

    this.mapComponent.addMarkers(markers);
  }
}

window.ctrl = new ViewController();
