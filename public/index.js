let map;
let latLng;
//represents assets
const layers = {};

//custom asset icons
let suppliesIcon =  L.AwesomeMarkers.icon({
  icon: 'pencil',
  markerColor: 'gray',
  prefix: 'fa',
  iconColor: 'black'
  })
let staffIcon =  L.AwesomeMarkers.icon({
  icon: 'users',
  markerColor: 'purple',
  prefix: 'fa',
  iconColor: 'black'
  })
let foodIcon = L.AwesomeMarkers.icon({
  icon: 'cutlery',
  markerColor: 'green',
  prefix: 'fa',
  iconColor: 'black'
  })
let waterIcon = L.AwesomeMarkers.icon({
  icon: 'tint',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
  })
let energyIcon = L.AwesomeMarkers.icon({
  icon: 'bolt',
  markerColor: 'orange',
  prefix: 'fa',
  iconColor: 'black'
  })
let medicalIcon =  L.AwesomeMarkers.icon({
  icon: 'medkit',
  markerColor: 'red',
  prefix: 'fa',
  iconColor: 'black'
  })
let openSpaceIcon =  L.AwesomeMarkers.icon({
  icon: 'tree',
  markerColor: 'green',
  prefix: 'fa',
  iconColor: 'black'
  })
let shelterIcon = L.AwesomeMarkers.icon({
  icon: 'home',
  markerColor: 'blue',
  prefix: 'fa',
  iconColor: 'black'
  })

function getIcon(layerName) {
  let icons = {
    "supplies": suppliesIcon,
    "staff": staffIcon,
    "food": foodIcon,
    "water": waterIcon,
    "energy or fuel": energyIcon,
    "medical": medicalIcon,
    "open space": openSpaceIcon,
    "shelter": shelterIcon,
    'default': suppliesIcon
  }
  return (icons[layerName] || icons["default"]);
}

function getMarkers() {
  $.get('/api/markers', (markers) => {
    initLayers(markers);
   // showMarkers(markers);
  })
}

//should only be called when initializating map
function initLayers(markers){
  markers.forEach(m => {
  addLayer(m);
  })
}

//Creates a group layer based on the marker's asset name and adds it to map
function addLayer(marker){
  //add extra check to avoid redeclaring a layer group
  if (!layers[marker.asset]){
    layers[marker.asset] = L.layerGroup().addTo(map);
    addLayerButton(marker.asset, getIcon(marker.asset).options.icon);
   }
   showMarker(marker);
}

//Should we rename this function to addMarker(marker)?
// add the marker to a layer group + put popup content on each marker
function showMarker(marker) {
   const customIcon = getIcon(marker.asset);
   const x = L.marker([marker.coordinates[1], marker.coordinates[0]], {icon:customIcon});
   layers[marker.asset].addLayer(x);
   x._id = marker._id;
   x.properties = marker;
   addPopup(x);
   console.log(layers);
}

//Create a button to toggle the layer
function addLayerButton(layerName, iconName){
  //create button
  let layerItem = document.createElement('div')
  layerItem.innerHTML = `${layerName} <span class="fa fa-${iconName}"></span>`
  layerItem.className = "layer-button"
  layerItem.classList.add("toggle-active"); //layers are initially active
  layerItem.setAttribute('ref', `${layerName}-toggle`) //will be used to toggle on mobile
  layerItem.addEventListener('click', (e) => toggleMapLayer(layerName))
  document.getElementById("layer-buttons").appendChild(layerItem);

  function toggleMapLayer(layerName){
    //Toggle active UI status
    layerItem.classList.toggle('toggle-active')

    const layer = layers[layerName];
    if (map.hasLayer(layer)) {
      map.removeLayer(layer)
    } else {
      map.addLayer(layer)
    }
  }
}

function updateMarker(data, marker) {
  if (data) {
    marker.properties.asset = data.asset;
    marker.properties.title = data.title;
    marker.properties.author = data.author;
    marker.properties.description = data.description;
    addPopup(marker);
  }
}

/*
Adds html content to our popup marker
*/
function addPopup(marker) {
  if (marker) {
    marker.bindPopup(popupContent(marker, 'add'));
    marker.on('popupopen', onPopupOpen);
  }
}

function popupContent (marker, mode) {
  if (marker) {
    var { title, description, author, asset } = marker.properties;
  } else {
    var title = '';
    var description = '';
    var author = '';
  }

  // default mode
  let isDisabled = true;
  let buttons = `<button class="edit btn">Edit</button><button class="delete btn">Delete</button>`;

  if (mode === 'update') {
    buttons = `<button class="update">Save Changes</button>`;
    isDisabled = false;
  } else if (mode == 'create') {
    buttons = `<input type="button" value="Add Location" onclick=saveData() />`;
    isDisabled = false;
  }

  const content = `
    <table>
      <tr><td colspan="2"></td></tr>
      <tr><td>Title</td><td><input id="titleTbx" type="text" value="${title}" ${isDisabled ? 'disabled' : ''} /></td></tr>
      <tr><td>Description</td><td><input id="descriptionTbx" type="text" value="${description}" ${isDisabled ? 'disabled' : ''} /></td></tr>
      <tr><td>Author</td><td><input id="authorTbx" type="text" value="${author}" ${isDisabled ? 'disabled' : ''} /></td></tr>
      <tr><td>Asset</td>
          <td>
            <select id="assetSelect" ${isDisabled ? 'disabled' : ''}>
              <option ${asset === 'supplies' ? 'selected' : ''} value="supplies">Supplies</option>
              <option ${asset === 'staff' ? 'selected' : ''} value="staff">Staff</option>
              <option ${asset === 'food' ? 'selected' : ''} value="food">Food</option>
              <option ${asset === 'water' ? 'selected' : ''} value="water">Water</option>
              <option ${asset === 'energy or fuel' ? 'selected' : ''} value="energy or fuel">Energy/Fuel</option>
              <option ${asset === 'medical' ? 'selected' : ''} value="medical">Medical</option>
              <option ${asset === 'open space' ? 'selected' : ''} value="open space">Open Space</option>
              <option ${asset === 'shelter' ? 'selected' : ''} value="shelter">Shelter</option>
            </select></td>
          </td>
      </tr>
    </table>
    <div>
      ${buttons}
    </div>
  `;

  return content;
}

function initmap() {
  // set up the map
  map = new L.Map('mapid');

  // create the tile layer with correct attribution
  let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  let osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 20, attribution: osmAttrib });

  // start the map in Northern San Francisco
  map.setView(new L.LatLng(37.80, -122.42), 14);
  map.addLayer(osm);
  map.zoomControl.setPosition('bottomright');
  var sidebar = L.control.sidebar('sidebar').addTo(map);

  getMarkers();

  map.on('click', onMapClick);
}

function onMapClick(e) {
  latLng = e.latlng;
  const popup = L.popup()
    .setLatLng(latLng)
    .setContent(popupContent(null, 'create'))
    .openOn(map);
}


function saveData() {
  const currentMarker = {
    title: document.getElementById('titleTbx').value,
    description: document.getElementById('descriptionTbx').value,
    author: document.getElementById('authorTbx').value,
    asset: document.getElementById('assetSelect').value,
    coordinates: [latLng.lng, latLng.lat],
  }

  $.post('api/markers', currentMarker, (data) => {
    addLayer(data);
  });

  clearTextBoxAndClosePopup();
}

function clearTextBoxAndClosePopup() {
  document.getElementById('titleTbx').value = '';
  document.getElementById('descriptionTbx').value = '';
  document.getElementById('authorTbx').value = '';
  document.getElementById('assetSelect').value = '';
  map.closePopup();
}

function onPopupOpen(e) {
  const marker = this;
  const marker_id = marker._id;
  // To remove marker on click of delete
  $(".delete").on("click", () => {
    //can update confirm default box with bootstrap modal
    let confirmDelete = confirm("Are you sure you want to delete this marker?");
    if (confirmDelete) {
      $.ajax({
        url: `/api/markers/${marker_id}`,
        type: 'DELETE',
        success: (response) => {
          console.log("Succesfully delete marker");
          let leaflet_id = marker._leaflet_id;
          let layer = layers[marker.properties.asset];
          //Have to do this extra step to delete the marker reference that is inside the layer group
          delete layer._layers[leaflet_id];
          //show in UI
          map.removeLayer(marker);
        }
      });
    }
  });
  // To update marker
  $(".edit").on("click", () => {
    const previous_content = marker._popup.getContent();
    marker._popup.setContent(popupContent(marker, 'update'));

    marker.on('popupclose', (e) => {
      console.log('close popup');
      // marker._popup.setContent(popupContent(marker, 'add'));
      marker._popup.setContent(previous_content);
    });

    $(".update").on("click", () => {
      console.log('save changes', marker);
      const updatedProperties = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value,
        author: document.getElementById('authorTbx').value,
        asset: document.getElementById('assetSelect').value,
      };

      $.post(`/api/markers/${marker_id}`, updatedProperties, (data) => {
        // show updated marker on map
        updateMarker(data, marker);
      });

      clearTextBoxAndClosePopup();
    });
  });
}

initmap();
