import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function GoogleAuthHandler() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(user, token);
        navigate("/");
      } catch (error) {
        console.error("Failed to parse Google auth data:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Signing you in with Google...</p>
    </div>
  );
}
