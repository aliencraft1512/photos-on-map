class Map {
  constructor(mapId) {
    this.mapId = mapId;
    this.latitude = 41.153332;
    this.longitude = 20.168331;
    this.center = [this.latitude, this.longitude];
    this.osmUrl = `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;
    this.osmAttrib = `Map data © <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors`;
    this.initZoom = 10;
    this.minZoom = 2;
    this.maxZoom = 20;
    this.icon = new L.divIcon({
      iconSize: [0, 0],
      className: 'my-div-icon'
    });
    this.markerSettings = {
      closeOnClick: true,
      autoClose: true,
      closeButton: false,
      className: 'custom-popup'
    };
    this.mapSettings = {
      center: this.center,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      closePopupOnClick: false,
      scrollWheelZoom: true
    };
    this.requestUserLocation = true;
    this.map = {};
  }

  /**
     * Get user location if possible
     */
  getCurrentUserLocation() {
    this.map
      .locate({
        setView: true,
        watch: false,
        enableHighAccuracy: true,
        maxZoom: this.initZoom
      })
      .on('locationfound', ({ latitude, longitude, accuracy }) => {
        this.latitude = latitude;
        this.longitude = longitude;
        let marker = L.marker([latitude, longitude]).bindPopup(
          `<a href="#">Your are here :)</a>`,
          this.markerSettings
        );
        let circle = L.circleMarker([latitude, longitude], accuracy / 2);
        this.map.addLayer(marker);
        this.map.addLayer(circle);
        this.updateMapPosition();
      })
      .on('locationerror', ({ code }) => {
        let errors = {
          1: 'Permission denied',
          2: 'Position unavailable',
          3: 'Request timeout'
        };
        console.log('Error: ', errors[code]);
      });
  }

  /**
     * Update map position
     */
  updateMapPosition() {
    this.map.setView(
      new L.LatLng(this.latitude, this.longitude),
      this.initZoom
    );
  }

  /**
     * Add map events
     */
  mapEvents() {
    // resize event
    this.map.on('resize', () => {
      this.updateMapPosition();
    });

    // zoom change
    this.map.on('zoom', e => {
      this.initZoom = e.target.getZoom();
    });
  }

  /**
     * Add photos to map
     */
  addPhotosToMap(photos = []) {
    this.markersGroup = L.featureGroup().addTo(this.map);
    photos.forEach(photo => {
      let marker = L.marker(
        [photo.latitude, photo.longitude] /*, { icon: self.icon }*/
      )
        .bindPopup(this.generatePopupContent(photo), this.markerSettings)
        .addTo(this.markersGroup)
        .on('click', () => {
          this.markersGroup.invoke('closePopup');
          setTimeout(function() {
            marker.openPopup();
            // init venobox
            $('.venobox').venobox();
          }, 200);
        });
    });
    this.updateMapPosition();
  }

  /**
     * Add photo to map
     */
  addPhotoToMap(photo = {}) {
    this.markersGroup = L.featureGroup().addTo(this.map);
    let marker = L.marker(
      [photo.latitude, photo.longitude] /*, { icon: self.icon }*/
    )
      .bindPopup(this.generatePopupContent(photo), this.markerSettings)
      .addTo(this.markersGroup)
      .on('click', () => {
        this.markersGroup.invoke('closePopup');
        setTimeout(function() {
          marker.openPopup();
          // init venobox
          $('.venobox').venobox();
        }, 200);
      });
    //.openPopup();
  }

  /**
     * Generate popup content
     */
  generatePopupContent({ fileName, latitude, longitude, date, filePath }) {
    return `<div class="photo-wrapper">
            <div class="photo-filename"><span>Filename: </span><span class="photo-info">${fileName}</span></div>
            <div class="photo-location"><span>Latitude: </span><span class="photo-info">${latitude}</span><br />
            <span>Longitude: </span><span class="photo-info">${longitude}</span></div>
            <div class="photo-date"><span>Date: </span> <span class="photo-info">${date}</span></div>
            <div class="photo"><a class="venobox" href="${filePath}" title="${fileName}"><img src="${filePath}" style="max-width:100%;" /></a></div>
            </div>`;
  }

  /**
     * Init map
     */
  init() {
    this.map = new L.Map(this.mapId, this.mapSettings);
    let osm = new L.TileLayer(this.osmUrl, { attribution: this.osmAttrib });
    this.updateMapPosition();
    this.map.addLayer(osm);
    if (this.requestUserLocation) {
      this.getCurrentUserLocation();
    }
    // init map events
    this.mapEvents();

    // add photos to map
    this.addPhotosToMap();
  }
}
