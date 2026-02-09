interface LocationData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  directionsUrl: string;
  directionsLabel: string;
}

let map: google.maps.Map | null = null;
let markers: Map<string, google.maps.marker.AdvancedMarkerElement> = new Map();
let infoWindow: google.maps.InfoWindow | null = null;

function panToMarkerWithOffset(marker: google.maps.marker.AdvancedMarkerElement): void {
  if (!map || !marker.position) return;

  const position = marker.position as google.maps.LatLngLiteral;
  map.panTo(position);

  // Wait for pan to finish, then shift map down so the info window fits on screen.
  // On mobile screens, the info window takes more relative space, so use a larger offset.
  google.maps.event.addListenerOnce(map, "idle", () => {
    if (!map) return;
    const mapDiv = map.getDiv();
    const mapHeight = mapDiv.offsetHeight;
    // Shift the map so the marker ends up in the lower portion,
    // leaving room for the info window above.
    // Use ~30% of map height on mobile (<768px), ~25% on larger screens.
    const isMobile = window.innerWidth < 768;
    const offsetY = isMobile ? -(mapHeight * 0.3) : -(mapHeight * 0.25);
    map.panBy(0, offsetY);
  });
}

function openInfoWindow(
  marker: google.maps.marker.AdvancedMarkerElement,
  location: LocationData
): void {
  if (!infoWindow || !map) return;

  const template = document.getElementById("map-infowindow-template") as HTMLTemplateElement | null;
  if (!template) return;

  const content = template.content.cloneNode(true) as DocumentFragment;
  const nameEl = content.querySelector('[data-field="name"]');
  const addressEl = content.querySelector('[data-field="address"]');
  const directionsEl = content.querySelector('[data-field="directions"]') as HTMLAnchorElement | null;

  if (nameEl) nameEl.textContent = location.name;
  if (addressEl) addressEl.textContent = location.address;
  if (directionsEl) {
    directionsEl.href = location.directionsUrl;
    directionsEl.textContent = location.directionsLabel;
  }

  infoWindow.setContent(content.firstElementChild as HTMLElement);
  infoWindow.open(map, marker);
  panToMarkerWithOffset(marker);

  window.dispatchEvent(
    new CustomEvent("highlight-card", { detail: { locationId: location.id } })
  );
}

export function initializeMap(
  containerId: string,
  locations: LocationData[]
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(container, {
    zoom: 12,
    center: { lat: 54.72, lng: 25.2 },
    mapId: "jaukuma-stores",
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  infoWindow = new google.maps.InfoWindow();

  locations.forEach((location) => {
    const position = { lat: location.lat, lng: location.lng };
    bounds.extend(position);

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title: location.name,
    });

    marker.addListener("click", () => {
      openInfoWindow(marker, location);
    });

    markers.set(location.id, marker);
  });

  map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
}

export function highlightLocation(locationId: string): void {
  const marker = markers.get(locationId);
  if (!marker || !map) return;

  const position = marker.position;
  if (!position) return;

  map.setZoom(15);
  google.maps.event.trigger(marker, "click");
}

export function findNearestStore(
  locations: LocationData[],
  onFound: (locationId: string) => void,
  onError: (message: string) => void
): void {
  if (!navigator.geolocation) {
    onError("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      let nearestId = locations[0].id;
      let minDistance = Infinity;

      locations.forEach((loc) => {
        const distance = haversineDistance(userLat, userLng, loc.lat, loc.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestId = loc.id;
        }
      });

      onFound(nearestId);
    },
    () => {
      onError("location-denied");
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
