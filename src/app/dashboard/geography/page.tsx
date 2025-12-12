"use client";

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import config from '@/lib/config';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = config.env.mapBoxToken;

const Globe = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/titan1230/cm6guqad6002401sd5ssbgfrz',
      center: [0, 0],
      zoom: 1.5,
      bearing: 0,
      pitch: 0,
      projection: 'globe' as any,
      maxZoom: 4,
      minZoom: 2,
      interactive: true,
      maxBounds: [-180, -60, 180, 85],
      touchZoomRotate: true,
      dragPan: true,
      renderWorldCopies: false
    });
    
    mapRef.current = map;

    map.on('load', () => {
      // Mobile-optimized layer
      map.addLayer({
        id: 'country-boundaries-mobile',
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
          promoteId: 'iso_3166_1'
        },
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#fff',
          'line-width': 1.2,
          'line-opacity': 0.8
        },
        minzoom: 1.5
      });

      map.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 4.2,
        bearing: 360,
        duration: 6000,
        curve: 1.2,
        essential: true,
        easing: (t) => t * (2 - t)
      });

      // Mobile orientation handler
      const checkOrientation = () => {
        const isPortrait = window.matchMedia('(orientation: portrait)').matches;
        map.resize(); // Force map redraw on orientation change
        if (isPortrait) {
          map.setZoom(4.2);
        } else {
          map.setZoom(4.5);
        }
      };
      
      window.addEventListener('orientationchange', checkOrientation);
      return () => window.removeEventListener('orientationchange', checkOrientation);
    });

    // Set up a resize observer to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });
    
    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className="h-full w-full min-h-[50vh] touch-pan-x touch-pan-y"
      style={{
        touchAction: 'pan-x pan-y'
      }}
    />
  );
};

export default Globe;
