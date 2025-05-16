// src/api/clientFactory.ts
import { Client } from './generated';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_KEY:', API_KEY);

export function createApiClient() {
  return new Client(API_BASE_URL, {
    fetch: (url, options) => {
      options = options || {};
      options.headers = {
        ...(options.headers || {}),
        'X-API-KEY': API_KEY,
      };
      return fetch(url, options);
    },
  });
}

export enum LocationType {
  Remote = 0,
  Hybrid = 1,
  Onsite = 2,
}