<template>
  <div id="app">
    <router-view/>
    <ul>
      <li>
        <router-link :to="{name: 'GoogleMaps'}">Google Maps</router-link>
      </li>
      <li>
        <router-link :to="{name: 'Mapbox'}">Mapbox</router-link>
      </li>
    </ul>
  </div>
</template>
