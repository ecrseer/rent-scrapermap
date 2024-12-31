<template>
  <div class="container">
    <h1>OLX Rental Listings Map</h1>
    <div id="map" class="map-container"></div>
    <div class="listings">
      <div v-for="listing in listings" :key="listing.link" class="listing-card">
        <h3>{{ listing.title }}</h3>
        <p>Price: {{ listing.price }}</p>
        <p>ZIP Code: {{ listing.zipCode }}</p>
        <a :href="listing.link" target="_blank">View on OLX</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

type Listing = {
  title: string
  price: string
  zipCode: string
  link: string
  latitude?: number
  longitude?: number
}

const { initMap, addMarker, clearMarkers } = useMap()
const listings = ref<Listing[]>([])

const fetchListings = async () => {
  try {
    const response = await axios.get('http://localhost:4242/api/zona-norte')
    listings.value = response.data as Listing[]
    console.log("🚀 ~ file: index.vue:37 ~ response.data:", response.data)

    // Add markers for each listing with ZIP code
    clearMarkers()
    listings.value.forEach(listing => {
      if (listing.latitude && listing.longitude) {
        addMarker(
          listing.latitude,
          listing.longitude,
          `
            <strong>${listing.title}</strong><br>
            Price: ${listing.price}<br>
            <a href="${listing.link}" target="_blank">View on OLX</a>
          `
        )
      }
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
  }
}

onMounted(async () => {
  await initMap('map')
  await fetchListings()
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.map-container {
  height: 500px;
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
}

.listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.listing-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.listing-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.listing-card p {
  margin: 5px 0;
  color: #666;
}

.listing-card a {
  display: inline-block;
  margin-top: 10px;
  color: #0066cc;
  text-decoration: none;
}

.listing-card a:hover {
  text-decoration: underline;
}
</style>
