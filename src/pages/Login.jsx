import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logomark from "../assets/logo.png";
import logoname from "../assets/logoname-b.png";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";

import { auth } from "../firebase";
import { useAuth } from '@/context/AuthContext'
import { signInWithEmailAndPassword } from "firebase/auth";

// Backend URL
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth()
  const [gUsernameUsed, setGUsernameUsed] = useState(false);
  const [gMobileUsed, setGMobileUsed] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleUser, setGoogleUser] = useState(null);
  const [gUsername, setGUsername] = useState("");
   const [gMobile, setGMobile] = useState("");

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const loginButtonRef = useRef(null);

  const [showPass, setShowPass] = useState(false);

  // ERROR STATES
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  // TOAST
  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(false);

  const isValid = email.length > 3 && password.length > 3;

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Handle Enter key to navigate between fields
  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginButtonRef.current?.click();
    }
  };

  


  async function handleGoogleLogin() {
  setLoading(true);

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 1️⃣ CHECK IN BACKEND IF USER EXISTS
    const res = await fetch(`${API_URL}/auth/check-email?email=${user.email}`);
    const data = await res.json();

    // 2️⃣ USER ALREADY EXISTS → DIRECT LOGIN SUCCESS
      if (data.exists) {
        showToast("Login Successful 🎉", "success");
        return setTimeout(() => navigate("/"), 1000);
    }

    // 3️⃣ NEW GOOGLE USER → ASK FOR USERNAME + MOBILE
    setGoogleUser({
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
    });

    setLoading(false); // open popup

  } catch (err) {
    console.log(err);
    showToast("Google login failed ❌");
  }

  setLoading(false);
}


// ---------------------------------------------
// GOOGLE USERNAME LIVE CHECK
// ---------------------------------------------
useEffect(() => {
  if (gUsername.length < 3) return;

  const delay = setTimeout(async () => {
    const res = await fetch(`${API_URL}/auth/check-username?username=${gUsername}`);
    const data = await res.json();
    setGUsernameUsed(data.exists);
  }, 300);

  return () => clearTimeout(delay);
}, [gUsername]);

// ---------------------------------------------
// GOOGLE MOBILE LIVE CHECK
// ---------------------------------------------
useEffect(() => {
  if (gMobile.length < 10) return;

  const delay = setTimeout(async () => {
    const res = await fetch(`${API_URL}/auth/check-mobile?mobile=${gMobile}`);
    const data = await res.json();
    setGMobileUsed(data.exists);
  }, 300);

  return () => clearTimeout(delay);
}, [gMobile]);

  // If user is already signed in, send them to the app root
  useEffect(() => {
    if (!authLoading && user) navigate('/');
  }, [user, authLoading, navigate]);



  // -------------------------------------------------------
  // LOGIN HANDLER
  // -------------------------------------------------------
  async function handleLogin() {
  setEmailError("");
  setPassError("");
  setToast(null);

  if (!isValid || loading) return;
  setLoading(true);

  // 1️⃣ CHECK IDENTIFIER (email or username)
  const res = await fetch(`${API_URL}/auth/check-identifier?identifier=${email}`);
  const data = await res.json();

  // ❌ CASE 1 + CASE 3 : User not found
  if (!data.exists) {
    setLoading(false);
    showToast("You are not registered ❌");
    setEmail("");
    setPassword("");
    return;
  }

  // ✔ IDENTIFIER EXISTS → always use email for Firebase login
  const finalEmail = data.email;

  try {
    // 2️⃣ Firebase Login
    await signInWithEmailAndPassword(auth, finalEmail, password);

    showToast("Login Successful 🎉", "success");
    // Redirect to root after login
        return setTimeout(() => navigate("/"), 1500);

  } catch (error) {
    setLoading(false);

    // ❌ CASE 2 + CASE 4: Wrong password
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      setPassError("Incorrect password");
      setPassword("");
      return;
    }

    // Other errors
    showToast("Login failed. Please try again.");
  }


  setLoading(false);
}
async function handleGoogleComplete() {
  if (!gUsername || gMobile.length !== 10) {
    showToast("Please fill all fields ❌");
    return;
  }

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: googleUser.uid,
      name: googleUser.name,
      username: gUsername,
      mobile: gMobile,
      email: googleUser.email,
    }),
  });

  const data = await res.json();

  if (data.status === "success") {
    showToast("Login Successful 🎉", "success");
    return setTimeout(() => navigate("/"), 800);
  }

  showToast("Something went wrong ❌");
}




  return (
    <>
      {/* TOAST */}
      {toast && (
        <div
          className={`
            fixed top-4 right-4 px-4 py-2 rounded-xl text-white shadow-lg 
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
            animate-slide
          `}
        >
          {toast.msg}
        </div>
      )}
{googleUser && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-2xl w-[350px] text-black shadow-2xl relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setGoogleUser(null)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-2 text-center text-black">Complete Profile</h2>
      <p className="text-center text-slate-600 text-sm mb-6">Add a few details to finish signing up</p>

      {/* USERNAME */}
      <label className="text-sm font-semibold text-black block mb-2">Username</label>
      <input
        type="text"
        className="w-full p-3 bg-white rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400"
        value={gUsername}
        onChange={(e) => setGUsername(e.target.value)}
        placeholder="Create username"
      />
      {gUsernameUsed && (
        <p className="text-red-600 text-xs mt-1 font-medium">Username already taken</p>
      )}

      {/* MOBILE */}
      <label className="text-sm font-semibold text-black block mb-2 mt-4">Mobile Number</label>
      <input
        type="tel"
        maxLength="10"
        className="w-full p-3 bg-white rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400"
        value={gMobile}
        onChange={(e) => setGMobile(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter mobile number"
      />
      {gMobileUsed && (
        <p className="text-red-600 text-xs mt-1 font-medium">Mobile already registered</p>
      )}

      {/* CONTINUE BUTTON */}
      <button
        onClick={handleGoogleComplete}
        disabled={
          gUsername.trim().length < 3 ||
          gMobile.length !== 10 ||
          gUsernameUsed ||
          gMobileUsed
        }
        className={`w-full py-3 rounded-lg font-semibold mt-6 transition-all duration-200
          ${
            gUsername.trim().length >= 3 &&
            gMobile.length === 10 &&
            !gUsernameUsed &&
            !gMobileUsed
              ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md"
              : "bg-sky-100 opacity-60 cursor-not-allowed text-slate-400"
          }
        `}
      >
        Continue
      </button>

    </div>
  </div>
)}


     

      <div
        className="min-h-screen flex items-center justify-center bg-white"
      >
        {/* MAIN CARD */}
        <div className="
          flex w-[950px] rounded-3xl shadow-2xl overflow-hidden
          bg-white
          max-md:flex-col max-md:w-[92%] max-md:h-auto max-md:py-8 max-md:rounded-2xl
        ">

          {/* LEFT SIDE */}
          <div className="
            w-[48%] flex flex-col items-center justify-center gap-4 border-r border-sky-100
            bg-gradient-to-br from-sky-50 to-white
            max-md:w-full max-md:border-none max-md:mb-6 max-md:mt-4 max-md:py-8
          ">
           <img src={logomark} alt="Knowra logo mark" className="w-[200px] max-md:w-[100px] user-select-none pointer-events-none select-none" draggable="false" />
           <img src={logoname} alt="Knowra logo name" className="w-[240px] max-md:w-[130px] user-select-none pointer-events-none select-none" draggable="false" />
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[52%] flex flex-col justify-between px-12 text-black max-md:w-full max-md:px-6 py-8">

            <div>
              <h1 className="text-3xl font-bold text-center mb-1 text-black">Welcome Back</h1>
              <p className="text-center text-sky-600 text-sm mb-8">
                Sign in to continue learning
              </p>

              {/* EMAIL */}
              <label className="text-sm font-semibold text-black mb-2">Email or Username</label>
              <input
                ref={emailInputRef}
                type="text"
                inputMode="email"
                onKeyDown={handleEmailKeyDown}
                placeholder="Enter your email or username"
                 value={email}
                 onChange={(e) => {
                setEmail(e.target.value);
                 setEmailError("");
              }}
              className={`
                w-full bg-white p-3 rounded-lg mt-0 mb-2 text-black outline-none 
                border-2 placeholder-gray-400
                ${emailError ? "border-red-500" : "border-sky-200"}
                focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-colors
              `}
              />

              {emailError && <p className="text-red-600 text-xs mb-3 font-medium">{emailError}</p>}

              {/* PASSWORD */}
              <label className="text-sm font-semibold text-black mb-2">Password</label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onKeyDown={handlePasswordKeyDown}
                  onChange={(e) => {
                    setPassword(e.target.value);
                      setPassError("");
                    }}
                    className={`
                      w-full bg-white p-3 rounded-lg pr-12 mt-0 mb-2 text-black outline-none 
                      border-2 placeholder-gray-400
                      ${passError ? "border-red-500" : "border-sky-200"}
                      focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-colors
                    `}
                    />

                    {password && (
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-pressed={showPass}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      title={showPass ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 flex items-center cursor-pointer"
                    >
                      {showPass ? (
                      /* eye-off (official-like) */
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 3l18 18"></path>
                        <path d="M10.47 10.47A3 3 0 0113.53 13.53"></path>
                        <path d="M9.88 5.06C11.07 5 12.34 5.25 13.53 5.72"></path>
                        <path d="M2.46 12.01C3.73 7.95 7.52 5 12 5c1.2 0 2.36.2 3.44.57"></path>
                        <path d="M21.54 12.01C20.27 16.07 16.48 19 12 19c-1.2 0-2.36-.2-3.44-.57"></path>
                      </svg>
                      ) : (
                      /* eye (official-like) */
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path d="M2.46 12C3.73 7.95 7.52 5 12 5c4.48 0 8.27 2.95 9.54 7-1.27 4.05-5.06 7-9.54 7-4.48 0-8.27-2.95-9.54-7z"></path>
                      </svg>
                      )}
                    </button>
                    )}
                  </div>
                  {passError && <p className="text-red-600 text-xs mt-1 font-medium">{passError}</p>}

                  {/* FORGOT */}
                        <div className="text-right mt-2 mb-6">
                          <Link to="/forgot" className="text-sky-600 hover:text-sky-700 hover:underline text-xs font-medium">
                          Forgot Password?
                          </Link>
                        </div>

                        {/* LOGIN BUTTON */}
              <button
                ref={loginButtonRef}
                onClick={handleLogin}
                disabled={!isValid || loading}
                className={`
                  w-full py-3 text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200
                  ${isValid && !loading
                    ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg"
                    : "bg-sky-100 opacity-60 cursor-not-allowed text-slate-400"}
                `}
              >
                {loading ? (
                  <div className="w-6 h-6 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Login"
                )}
              </button>

              {/* OR */}
              <div className="flex items-center gap-3 my-6">
                <div className="h-[1px] bg-sky-200 flex-1"></div>
                <p className="text-slate-500 text-xs font-medium">OR CONTINUE WITH</p>
                <div className="h-[1px] bg-sky-200 flex-1"></div>
              </div>

              {/* GOOGLE */}
             <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-sky-200 py-3 rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-all duration-200"
             >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
            <span className="text-slate-700 text-sm font-medium">Continue with Google</span>
            </button>
            </div>

            {/* SIGNUP LINK (removed top border and added gap) */}
            <p className="text-center text-xs text-slate-700 mt-8">
              Don't have an account?<Link to="/signup" className="text-sky-600 hover:text-sky-700 font-semibold ml-1">Sign Up</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
