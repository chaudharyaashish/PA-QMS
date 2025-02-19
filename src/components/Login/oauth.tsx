import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function OAuth() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let userType = "patient"; // Default user type if new user

      if (!userSnap.exists()) {
        // New user: Save user data to Firestore
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          userType, // Assign default user type
          createdAt: serverTimestamp(),
        });
      } else {
        // Existing user: Retrieve userType
        userType = userSnap.data().userType;
      }

      alert("Sign in successful!");

      // Redirect based on user type
      switch (userType) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "patient":
          navigate("/patient-dashboard");
          break;
        default:
          navigate("/dashboard"); // Default dashboard
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <button
      className="w-full bg-red-600 p-3 rounded text-white font-bold hover:bg-red-700"
      type="button"
      onClick={handleGoogleSignIn}
    >
      Continue with Google
    </button>
  );
}
