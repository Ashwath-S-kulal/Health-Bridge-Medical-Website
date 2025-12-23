import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {app} from "../firebase.js"
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            });
            const data = await res.json();
            console.log(data);
            console.log(res);
            dispatch(signInSuccess(data));
            navigate('/');


        } catch (error) {
            console.log("Cloud not login with google", error);
        }
    }
    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 py-3 px-6 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm group"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>

            <span className="text-slate-700 font-bold text-base tracking-tight">
                Sign in with Google
            </span>
            <ArrowRight
                size={20}
                className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all duration-200"
            />
        </button>
    )
}
