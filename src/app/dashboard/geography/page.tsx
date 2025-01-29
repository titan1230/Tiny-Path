"use client";

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import config from '@/lib/config';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = config.env.mapBoxToken;

const Globe = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/titan1230/cm6guvm8j00e001pb8xyt1pti',
      center: [0, 0],
      zoom: 1,
      maxZoom: 4,
      minZoom: 2,
      bearing: 0,
      projection: 'globe' as any,
    });

    map.on('load', () => {
      map.addLayer({
        id: 'country-boundaries',
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        },
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#fff',
          'line-width': 1,
        },
      });

      map.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 4,
        bearing: 360,
        duration: 8000,
        curve: 1.5,
        essential: true
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className='h-full w-full' />;
};

export default Globe;