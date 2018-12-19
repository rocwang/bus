<template>
  <div id="app">
    <ul>
      <li>
        <router-link :to="{name: 'GoogleMaps'}">Google Maps</router-link>
      </li>
      <li>
        <router-link :to="{name: 'Mapbox'}">Mapbox</router-link>
      </li>
    </ul>
    <router-view/>
  </div>
</template>
