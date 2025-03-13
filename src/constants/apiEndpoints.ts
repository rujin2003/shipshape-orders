
/**
 * API Endpoints
 * This file contains all the API endpoints used throughout the application.
 * Centralizing them makes it easier to manage and update URLs.
 */

// Base API URL from config
import config from '@/config';

const BASE_URL = config.apiUrl;

export const API_ENDPOINTS = {
  // Sales endpoints
  SALES: {
    GET_MONTHLY_SALES: (year: number | string, month: string) => 
      `${BASE_URL}/api/sales/${year}/${month}`,
  },
  
  // Orders endpoints
  ORDERS: {
    GET_MONTHLY_ORDERS: (year: number | string, month: string) => 
      `${BASE_URL}/api/orders/${year}/${month}`,
    GET_RECENT_ORDERS: `${BASE_URL}/orders/recentorders`,
    GET_PENDING_COUNT: `${BASE_URL}/orders/pending-count`,
    GET_LATEST_ORDER_ID: `${BASE_URL}/orders/latestOrderId`,
    CREATE_ORDER: `${BASE_URL}/orders`,
  },
  
  // Customers endpoints
  CUSTOMERS: {
    GET_ALL: `${BASE_URL}/customers`,
    GET_TOTAL_COUNT: `${BASE_URL}/customer/totalCount`,
    CREATE: `${BASE_URL}/customers`,
    UPDATE: (id: number) => `${BASE_URL}/customers/${id}`,
  },
  
  // Shipments endpoints
  SHIPMENTS: {
    CREATE: `${BASE_URL}${config.createShipmentEndpoint}`,
    CUSTOMER: `${BASE_URL}${config.customerShipmentEndpoint}`,
  },
  
  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/login`,
  }
};

// Default authorization header
export const getAuthHeader = () => ({
  'Authorization': `Bearer 04XU8TeSj90dCX4b1_3fhZqolR7aFOZ_UWEUUHOSFRK`,
  'Content-Type': 'application/json',
});
