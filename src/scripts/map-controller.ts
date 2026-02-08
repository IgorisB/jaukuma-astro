interface LocationData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
}

let map: google.maps.Map | null = null;
let markers: Map<string, google.maps.marker.AdvancedMarkerElement> = new Map();
let infoWindow: google.maps.InfoWindow | null = null;

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
      if (infoWindow && map) {
        infoWindow.setContent(`
          <div style="padding: 0.5rem; font-family: 'Source Sans Pro', sans-serif;">
            <strong style="font-family: 'Playfair Display', serif; font-size: 1rem;">${location.name}</strong>
            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #333F48;">${location.address}</p>
          </div>
        `);
        infoWindow.open(map, marker);
      }

      window.dispatchEvent(
        new CustomEvent("highlight-card", { detail: { locationId: location.id } })
      );
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

  map.panTo(position);
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
