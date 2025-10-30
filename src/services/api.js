import axios from "axios";
import store from "../store/store";
import { clearTokens, setTokens } from "../store/Slices/auth/authSlice";
import { BASE_URL, API_URLS } from "./configUrls";
import { toast } from "react-toastify";

const MAX_RETRY_ATTEMPTS = 3;

const api = axios.create({
  baseURL: BASE_URL,
});

function handleInfoMessage(message) {
  toast.info(message, {
    autoClose: 2000,
    position: "top-center",
  });
}

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api?.interceptors?.response?.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop by checking if this is already a refresh token request
    if (originalRequest.url === API_URLS.REFRESH) {
      // If refresh token request fails, clear tokens and redirect
      store.dispatch(clearTokens());
      localStorage.clear();
      handleInfoMessage("Session expired. Redirecting to login page.");
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token available, clear everything
        store.dispatch(clearTokens());
        localStorage.clear();
        handleInfoMessage("Session expired. Redirecting to login page.");
        return Promise.reject(error);
      }

      let retryAttempts = 0;

      while (retryAttempts < MAX_RETRY_ATTEMPTS) {
        retryAttempts++;

        try {
          // Make refresh request without going through interceptor
          const refreshResponse = await axios.post(
            `${BASE_URL}${API_URLS.REFRESH}`,
            {
              refresh_token: refreshToken,
            }
          );

          const newAccessToken = refreshResponse.data.access_token;

          if (newAccessToken) {
            store.dispatch(
              setTokens({
                accessToken: newAccessToken,
                refreshToken: refreshToken, // Keep the existing refresh token
              })
            );
            localStorage.setItem("accessToken", newAccessToken);
            return api(originalRequest);
          } else {
            console.error("No new access token provided during refresh.");
            store.dispatch(clearTokens());
            localStorage.clear();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          if (retryAttempts === MAX_RETRY_ATTEMPTS) {
            // If maximum retry attempts reached, go to login
            store.dispatch(clearTokens());
            localStorage.clear();
            handleInfoMessage("Session expired. Redirecting to login page.");

            // window.location.href = "https://eduskillsfoundation.org/login/";
            return Promise.reject(refreshError);
          }
          // Wait for some time before the next retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
