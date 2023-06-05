
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    // center: [77.203264, 28.517158], // starting position [lng, lat]
    zoom: 8, // starting zoom
});

const nav = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(nav, 'top-right');

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`))
    .addTo(map);