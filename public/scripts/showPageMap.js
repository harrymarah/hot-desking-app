mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', 
center: office.geometry.coordinates, 
zoom: 15 
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(office.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h6>${office.officeNickname}</h6><p>${office.officeAddress.streetAddress}</p>`
    )
)
.addTo(map)

