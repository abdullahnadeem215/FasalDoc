import axios from 'axios';

export interface UserLocation {
  latitude: number;
  longitude: number;
  district: string;
  province: string;
}

const CACHE_KEY = 'user_district_cache';

export async function requestLocationPermission(): Promise<boolean> {
  if (!("geolocation" in navigator)) {
    return false;
  }
  // On web, permissions are handled by the browser when we call getCurrentPosition
  return true;
}

export async function getCurrentLocation(): Promise<{lat: number, lng: number}> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 15000, enableHighAccuracy: true }
    );
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<{district: string, province: string}> {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json'
      },
      headers: {
        'User-Agent': 'FasalDoc/1.0'
      }
    });

    const address = response.data.address;
    return {
      district: address.county || address.state_district || address.city || "Faisalabad",
      province: address.state || "Punjab"
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return {
      district: "Faisalabad",
      province: "Punjab"
    };
  }
}

export async function getUserDistrict(): Promise<UserLocation> {
  try {
    const coords = await getCurrentLocation();
    const info = await reverseGeocode(coords.lat, coords.lng);
    
    const locationData: UserLocation = {
      latitude: coords.lat,
      longitude: coords.lng,
      district: info.district,
      province: info.province
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(locationData));
    return locationData;
  } catch (error) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Default fallback coordinates for Faisalabad
    return {
      latitude: 31.4504,
      longitude: 73.1350,
      district: "Faisalabad",
      province: "Punjab"
    };
  }
}
