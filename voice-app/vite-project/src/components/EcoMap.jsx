// src/components/EcoMap.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco fallback

export default function EcoMap({ onPointsSelected }) {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Detect user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location detected:", userLocation);
          setOrigin(userLocation);
          setMapCenter(userLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default center if geolocation fails
        }
      );
    } else {
      console.log("Geolocation not supported by this browser.");
    }
  }, []);

  const handleMapClick = useCallback((event) => {
    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    if (!origin) {
      console.log("Setting origin:", newPoint);
      setOrigin(newPoint);
    } else if (!destination) {
      console.log("Setting destination:", newPoint);
      setDestination(newPoint);
      onPointsSelected({ origin, destination: newPoint });
    }
  }, [origin, destination, onPointsSelected]);

  const onLoad = useCallback(() => {
    console.log("Map loaded");
  }, []);

  const onLoadError = useCallback((error) => {
    console.error("Map load error:", error);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyD52505zMexVfQiXyr_JjOFceQeE72f11w"
      onLoad={onLoad}
      onError={onLoadError}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClick}
      >
        {origin && <Marker position={origin} label="Origin" />}
        {destination && <Marker position={destination} label="Destination" />}
      </GoogleMap>
    </LoadScript>
  );
}