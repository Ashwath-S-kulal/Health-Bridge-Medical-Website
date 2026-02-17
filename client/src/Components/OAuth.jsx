import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import GoogleImg from '../Images/GoogleImg.jpg';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
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
        <button type="button" onClick={handleGoogleClick}
            className='bg-red-700 text-white rounded-lg p-3 uppercase hover:bg-red-900 flex items-center gap-2 justify-center'>
            <img src={GoogleImg} alt="Google" className='w-6 h-6' />
            <span>Continue with Google</span>
        </button>
    )
}
