import { ref, onUnmounted } from 'vue'
import type { Map as LeafletMap, Marker } from 'leaflet'

export const useMap = () => {
  const map = ref<LeafletMap | null>(null)
  const markers = ref<Marker[]>([])
  let L: any = null

  const initMap = async (elementId: string) => {
    if (process.client) {
      // Dynamically import Leaflet only on client-side
      L = (await import('leaflet')).default
      
      // Initialize the map centered on Rio de Janeiro
      map.value = L.map(elementId).setView([-22.9068, -43.1729], 13)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value)
    }
  }

  const addMarker = (latitude: number, longitude: number, popupContent: string) => {
    if (!map.value || !L) return

    const marker = L.marker([latitude, longitude])
      .bindPopup(popupContent)
      .addTo(map.value)
    
    markers.value.push(marker)
  }

  const clearMarkers = () => {
    markers.value.forEach(marker => marker.remove())
    markers.value = []
  }

  onUnmounted(() => {
    if (map.value) {
      map.value.remove()
    }
  })

  return {
    map,
    initMap,
    addMarker,
    clearMarkers
  }
}
