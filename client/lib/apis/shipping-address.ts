"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Define an interface for the shipping address
interface ShippingAddress {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  [key: string]: any; // Allow additional properties
}

// Define the response structure
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a shipping address
export async function saveShippingAddress(
  data: ShippingAddress
): Promise<ApiResponse<ShippingAddress>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-address`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to get the shipping address
export async function getShippingAddress(): Promise<
  ApiResponse<ShippingAddress[]>
> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-address`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
export async function getUserShippingAddresses(){
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-address/user`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Function to update a shipping address
export async function updateShippingAddress(
  data: ShippingAddress
): Promise<ApiResponse<ShippingAddress>> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/shipping-address/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers,
      body: JSON.stringify(data),
    }
  );

  return await handleResponse(res);
}

// Function to delete a shipping address
export async function deleteShippingAddress(
  id: string
): Promise<ApiResponse<null>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-address/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
