import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth,db } from "../../context/firebase";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import {setDoc, doc} from "firebase/firestore";

export default function SignInWithGoogle() {
    const handleSignInWithGoogle = async () => {
        
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider).then(async (result) => {
            console.log(result);
            if(result.user){
                await setDoc(doc(db, "users", result.user.uid), {
                          email: result.user.email,
                          fullname: result.user.displayName,
                          photo: result.user.photoURL,
                        });
               
                window.location.href = "/";
            }
        });
    };
    
    return (
        <button
        onClick={handleSignInWithGoogle}
        className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500 inline-flex items-center justify-center"
        >
        <FcGoogle className="w-5 h-5" />

        </button>
    );
}