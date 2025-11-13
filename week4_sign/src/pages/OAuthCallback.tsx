import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken) {
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
      }
      if (refreshToken) {
        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
      }
    } catch (e) {
      // ignore
    } finally {
      navigate("/my", { replace: true });
    }
  }, [navigate]);

  return null;
}


