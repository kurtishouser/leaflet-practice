/** API Wrapper Service Class */
export class ApiService {
  constructor (url = 'http://localhost:8080/api') {
    this.url = url;
    // this.cancelToken = CancelToken.source()
  }

  getMarkers() {
    return fetch(`${this.url}/markers`)
      .then(markers => markers.json());
  }
}
