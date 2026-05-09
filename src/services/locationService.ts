import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserLocation {
  latitude: number;
  longitude: number;
  district: string;
  province: string;
}

const CACHE_KEY = 'user_district_cache';

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
}

export async function getCurrentLocation(): Promise<{lat: number, lng: number}> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}

export async function reverseGeocode(lat: number, lng: number): Promise<{district: string, province: string}> {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: { lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'FasalDoc/1.0' }
    });

    const address = response.data.address;
    return {
      district: address.county || address.state_district || address.city || "Faisalabad",
      province: address.state || "Punjab"
    };
  } catch (error) {
    return { district: "Faisalabad", province: "Punjab" };
  }
}

export async function getUserDistrict(): Promise<UserLocation> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) throw new Error("Location permission denied");

    const coords = await getCurrentLocation();
    const info = await reverseGeocode(coords.lat, coords.lng);
    
    const locationData: UserLocation = {
      latitude: coords.lat,
      longitude: coords.lng,
      district: info.district,
      province: info.province
    };

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(locationData));
    return locationData;
  } catch (error) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    
    return {
      latitude: 31.4504,
      longitude: 73.1350,
      district: "Faisalabad",
      province: "Punjab"
    };
  }
}
