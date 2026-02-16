import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";

import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URI}/api/auth/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
            }),
          }
        );

        const data = await res.json();
        dispatch(signInSuccess(data));
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <button onClick={handleGoogleClick}>
      Sign in with Google
    </button>
  );
}
