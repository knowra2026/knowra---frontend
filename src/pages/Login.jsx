import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logomark from "../assets/logo.png";
import logoname from "../assets/Logoname.png";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Backend URL
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [gUsernameUsed, setGUsernameUsed] = useState(false);
  const [gMobileUsed, setGMobileUsed] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleUser, setGoogleUser] = useState(null);
  const [gUsername, setGUsername] = useState("");
   const [gMobile, setGMobile] = useState("");

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
      return setTimeout(() => navigate("/home"), 1000);
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
    setTimeout(() => navigate("/home"), 1500);

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
    return setTimeout(() => navigate("/home"), 800);
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#222738] p-6 rounded-xl w-[350px] text-white shadow-lg relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setGoogleUser(null)}
        className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center">Complete Profile</h2>

      {/* USERNAME */}
      <label className="text-sm">Username</label>
      <input
        type="text"
        className="w-full p-3 bg-[#2C3143] rounded-xl mt-1 outline-none"
        value={gUsername}
        onChange={(e) => setGUsername(e.target.value)}
        placeholder="Create username"
      />
      {gUsernameUsed && (
        <p className="text-red-400 text-xs mt-1">Username already taken</p>
      )}

      {/* MOBILE */}
      <label className="text-sm mt-4">Mobile Number</label>
      <input
        type="tel"
        maxLength="10"
        className="w-full p-3 bg-[#2C3143] rounded-xl mt-1 outline-none"
        value={gMobile}
        onChange={(e) => setGMobile(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter mobile number"
      />
      {gMobileUsed && (
        <p className="text-red-400 text-xs mt-1">Mobile already registered</p>
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
        className={`w-full py-3 rounded-xl font-semibold mt-4
          ${
            gUsername.trim().length >= 3 &&
            gMobile.length === 10 &&
            !gUsernameUsed &&
            !gMobileUsed
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-[#3a3f52] opacity-40 cursor-not-allowed"
          }
        `}
      >
        Continue
      </button>

    </div>
  </div>
)}


     

      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(145deg,#25293C 0%,#646FA2 100%)" }}
      >
        {/* MAIN CARD */}
        <div className="
          flex w-[950px] h-[530px] rounded-2xl shadow-2xl overflow-hidden
          bg-[#222738]
          max-md:flex-col max-md:w-[92%] max-md:h-auto max-md:py-8 max-md:rounded-xl
        ">

          {/* LEFT SIDE */}
          <div className="
            w-[48%] flex flex-col items-center justify-center gap-3 border-r border-gray-700/30
            max-md:w-full max-md:border-none max-md:mb-6 max-md:mt-4
          ">
           <img src={logomark} alt="Knowra logo mark" className="w-[230px] max-md:w-[110px] user-select-none pointer-events-none select-none" draggable="false" />
                       <img src={logoname} alt="Knowra logo name" className="w-[260px] max-md:w-[140px] user-select-none pointer-events-none select-none" draggable="false" />
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[52%] flex flex-col justify-center px-12 text-white max-md:w-full max-md:px-6">

            <h1 className="text-3xl font-bold text-center mb-1">Welcome Back</h1>
            <p className="text-center text-gray-300 text-sm mb-7">
              Sign in to continue learning
            </p>

            {/* EMAIL */}
            <label className="text-[13px] font-semibold">Email/User name </label>
            <input
              type="email"
              inputMode="text"
              pattern=".*"
              onInvalid={(e) => e.preventDefault()}
              placeholder="Enter your email or username"
               value={email}
               onChange={(e) => {
              setEmail(e.target.value);
               setEmailError("");
            }}
            className={`
              w-full bg-[#2C3143] p-3 rounded-xl mt-1 mb-1 text-gray-200 outline-none 
              border ${emailError ? "border-red-500" : "border-transparent"}
              focus:border-blue-400
            `}
            />

            {emailError && <p className="text-red-400 text-xs mb-3">{emailError}</p>}

            {/* PASSWORD */}
            <label className="text-[13px] font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                    setPassError("");
                  }}
                  className={`
                    w-full bg-[#2C3143] p-3 rounded-xl pr-12 mt-1 text-gray-200 outline-none 
                    border ${passError ? "border-red-500" : "border-transparent"}
                    focus:border-blue-400
                  `}
                  />

                  {password && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-pressed={showPass}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    title={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 flex items-center"
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
                {passError && <p className="text-red-400 text-xs mt-1">{passError}</p>}

                {/* FORGOT */}
                      <div className="text-right mt-1 mb-5">
                        <Link to="/forgot" className="text-blue-400 hover:underline text-xs">
                        Forgot Password?
                        </Link>
                      </div>

                      {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={!isValid || loading}
              className={`
                w-full py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2
                ${isValid && !loading
                  ? "bg-blue-500 hover:bg-blue-600 hover:scale-[1.05] shadow-[0_0_15px_#4c8ffd]"
                  : "bg-[#3a3f52] opacity-40 cursor-not-allowed"}
              `}
            >
              {loading ? (
                <div className="w-6 h-6 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>

            {/* OR */}
            <div className="flex items-center gap-3 my-4">
              <div className="h-[1px] bg-gray-600 flex-1"></div>
              <p className="text-gray-400 text-xs">OR CONTINUE WITH</p>
              <div className="h-[1px] bg-gray-600 flex-1"></div>
            </div>

            {/* GOOGLE */}
           <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#2C3143] py-3 rounded-xl"
           >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
          <span className="text-gray-200 text-sm">Continue with Google</span>
          </button>


            {/* SIGNUP LINK */}
            <p className="text-center text-sm mt-6 text-gray-300">
              Don’t have an account?
              <Link to="/signup" className="text-blue-400 ml-1">Sign Up</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
