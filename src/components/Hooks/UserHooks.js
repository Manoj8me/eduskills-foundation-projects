import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../services/API/apiService";

export const useProfile = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("REFRESH_TOKEN"));

  useEffect(() => {
    const refreshTokens = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            "refresh": refreshToken
        });
        const { access, refresh } = response.data;
        
        // Store the new tokens in local storage
        localStorage.setItem("ACCESS_TOKEN", access);
        localStorage.setItem("REFRESH_TOKEN", refresh);
        
        // Update the state with the new access token
        setAccessToken(access);
      } catch (error) {
        // If the refresh token is invalid, clear the tokens from local storage
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
        
        // Clear the state
        setAccessToken(null);
        setRefreshToken(null);
        
        // Handle the error or redirect to the login page
        console.error("Error refreshing tokens:", error);
      }
    };

    if (!accessToken) {
      // Access token is missing, refresh the tokens
      refreshTokens();
    }
  }, [accessToken, refreshToken]);

  return accessToken;
};
