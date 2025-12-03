import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logomark from "../assets/logo.png";
import logoname from "../assets/logoname-b.png";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";

// Firebase
import { auth } from "../firebase";
import { useAuth } from '@/context/AuthContext'
import { createUserWithEmailAndPassword } from "firebase/auth";

// Backend URL
const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // FORM STATES
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [gUsername, setGUsername] = useState("");
  const [gMobile, setGMobile] = useState("");

  // REFS FOR FORM FIELDS
  const nameInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const signupButtonRef = useRef(null);

  // LIVE VALIDATION STATES
  const [emailUsed, setEmailUsed] = useState(false);
  const [usernameUsed, setUsernameUsed] = useState(false);
  const [mobileUsed, setMobileUsed] = useState(false);

  // UI STATES
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const passRef = useRef(null);

  // FORM VALIDATION
  const isValid =
    name.trim().length > 2 &&
    username.trim().length > 2 &&
    mobile.length === 10 &&
    email.includes("@") &&
    password.length > 5 &&
    !emailUsed &&
    !usernameUsed &&
    !mobileUsed;

  // Handle Enter key to navigate between fields
  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      usernameInputRef.current?.focus();
    }
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      mobileInputRef.current?.focus();
    }
  };

  const handleMobileKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      emailInputRef.current?.focus();
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      signupButtonRef.current?.click();
    }
  };

// ---------------------------------------------
// 🔥 GOOGLE USERNAME LIVE CHECK
// ---------------------------------------------
useEffect(() => {
  if (gUsername.length < 3) return;

  const delay = setTimeout(async () => {
    const res = await fetch(`${API_URL}/auth/check-username?username=${gUsername}`);
    const data = await res.json();
    setUsernameUsed(data.exists);
  }, 300);

  return () => clearTimeout(delay);
}, [gUsername]);

// ---------------------------------------------
// 🔥 GOOGLE MOBILE LIVE CHECK
// ---------------------------------------------
useEffect(() => {
  if (gMobile.length < 10) return;

  const delay = setTimeout(async () => {
    const res = await fetch(`${API_URL}/auth/check-mobile?mobile=${gMobile}`);
    const data = await res.json();
    setMobileUsed(data.exists);
  }, 300);

  return () => clearTimeout(delay);
}, [gMobile]);



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

  // ---------------------------------------
  // 🔥 LIVE CHECK EMAIL USED
  // ---------------------------------------
  useEffect(() => {
    if (email.length < 5) return;
    const t = setTimeout(async () => {
      const res = await fetch(`${API_URL}/auth/check-email?email=${email}`);
      const data = await res.json();
      setEmailUsed(data.exists);
    }, 400);
    return () => clearTimeout(t);
  }, [email]);

  // ---------------------------------------
  // 🔥 LIVE CHECK USERNAME USED
  // ---------------------------------------
  useEffect(() => {
    if (username.length < 3) return;
    const t = setTimeout(async () => {
      const res = await fetch(`${API_URL}/auth/check-username?username=${username}`);
      const data = await res.json();
      setUsernameUsed(data.exists);
    }, 400);
    return () => clearTimeout(t);
  }, [username]);

  // ---------------------------------------
  // 🔥 LIVE CHECK MOBILE USED
  // ---------------------------------------
  useEffect(() => {
    if (mobile.length < 10) return;
    const t = setTimeout(async () => {
      const res = await fetch(`${API_URL}/auth/check-mobile?mobile=${mobile}`);
      const data = await res.json();
      setMobileUsed(data.exists);
    }, 400);
    return () => clearTimeout(t);
  }, [mobile]);

  // ---------------------------------------
  // 🔥 SHOW TOAST
  // ---------------------------------------
  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ---------------------------------------
  // 🔥 SIGNUP HANDLER
  // ---------------------------------------
  async function handleSignup() {
    if (!isValid) return;

    setLoading(true);

    try {
      // 1️⃣ Firebase Signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2️⃣ Backend Save
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name,
          username,
          mobile,
          email,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        showToast("Signup Successful 🎉", "success");
        // After signup we can redirect into the app (firebase signs user in)
        setTimeout(() => navigate("/"), 1500);
      } else {
          // Redirect away if the user is already authenticated
          useEffect(() => {
            if (!authLoading && user) navigate('/');
          }, [user, authLoading, navigate]);
        showToast(data.error || "Signup error");
      }

    } catch (error) {
      showToast(error.message);
    }

    setLoading(false);
  }

  return (
    <>
      {/* 📌 TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`
          fixed top-4 right-4 px-4 py-2 rounded-xl shadow-lg text-white 
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
      {usernameUsed && <p className="text-red-600 text-xs mt-1 font-medium">Username already taken</p>}

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
      {mobileUsed && <p className="text-red-600 text-xs mt-1 font-medium">Mobile already registered</p>}

      {/* CONTINUE BUTTON */}
      <button
        onClick={handleGoogleComplete}
        disabled={
          gUsername.trim().length < 3 ||
          gMobile.length !== 10 ||
          usernameUsed ||
          mobileUsed
        }
        className={`w-full py-3 rounded-lg font-semibold mt-6 transition-all duration-200
          ${
            gUsername.trim().length >= 3 &&
            gMobile.length === 10 &&
            !usernameUsed &&
            !mobileUsed
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

        {/* MAIN CONTAINER */}
        <div
          className="
            flex w-[1300px] rounded-3xl shadow-2xl overflow-hidden
            bg-white
            max-md:flex-col max-md:w-[92%] max-md:h-auto max-md:py-8 max-md:rounded-2xl
          "
        >

          {/* LEFT SECTION */}
          <div className="
                w-[48%] flex flex-col items-center justify-center gap-4 border-r border-sky-100
                bg-gradient-to-br from-sky-50 to-white
                max-md:w-full max-md:border-none max-md:mb-6 max-md:mt-4 max-md:py-8
                ">
            <img src={logomark} alt="Knowra logo mark" className="w-[200px] max-md:w-[100px] user-select-none pointer-events-none select-none" draggable="false" />
            <img src={logoname} alt="Knowra logo name" className="w-[240px] max-md:w-[130px] user-select-none pointer-events-none select-none" draggable="false" />
                           
            <p className="text-center text-slate-700 text-sm w-[78%]">
              Learn smarter, grow faster — Knowra empowers engineering minds.
            </p>
          </div>

          {/* RIGHT FORM AREA */}
                <div className="w-[54%] px-12 py-8 text-black max-md:w-full max-md:px-6 flex flex-col justify-between">

                <div>
                <h1 className="text-3xl font-bold text-center mb-1 text-black">Create Account</h1>
                <p className="text-center text-sky-600 text-sm mb-8">Join us to start learning</p>

                {/* NAME + USERNAME */}
                <div className="flex gap-6 mb-6 max-md:flex-col max-md:gap-3">
                  <div className="w-1/2 max-md:w-full">
                  <label className="text-sm font-semibold text-black mb-2">Full Name</label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    onKeyDown={handleNameKeyDown}
                    className="w-full bg-white p-3 rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400 transition-colors"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  </div>

                  <div className="w-1/2 max-md:w-full">
                  <label className="text-sm font-semibold text-black mb-2">Username</label>
                  <input
                    ref={usernameInputRef}
                    type="text"
                    onKeyDown={handleUsernameKeyDown}
                    className="w-full bg-white p-3 rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400 transition-colors"
                    placeholder="Create username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {usernameUsed && <p className="text-red-600 text-xs mt-1 font-medium">Username already taken</p>}
                  </div>
                </div>

                {/* MOBILE */}
            <label className="text-sm font-semibold text-black mb-2">Mobile Number</label>
            <input
              ref={mobileInputRef}
              type="tel"
              maxLength={10}
              onKeyDown={handleMobileKeyDown}
              className="w-full bg-white p-3 rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400 transition-colors"
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            />
            {mobileUsed && <p className="text-red-600 text-xs mt-1 font-medium">Mobile already registered</p>}

            {/* EMAIL */}
            <label className="text-sm font-semibold text-black mt-4 mb-2">Email</label>
            <input
              ref={emailInputRef}
              type="email"
              onKeyDown={handleEmailKeyDown}
              className="w-full bg-white p-3 rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400 transition-colors"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailUsed && <p className="text-red-600 text-xs mt-1 font-medium">Email already in use</p>}

            {/* PASSWORD */}
                  <label className="text-sm font-semibold text-black mt-4 mb-2">Password</label>
                  <div className="relative mb-6">
                    <input
                    ref={passwordInputRef}
                    type={showPass ? "text" : "password"}
                    onKeyDown={handlePasswordKeyDown}
                    className="w-full bg-white p-3 pr-12 rounded-lg mt-0 mb-2 text-black outline-none border-2 border-sky-200 focus:border-sky-500 placeholder-gray-400 transition-colors"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

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
                  </div>

                  {/* SIGN UP BUTTON */}
            <button
              ref={signupButtonRef}
              onClick={handleSignup}
              disabled={!isValid || loading}
              className={`
                w-full py-3 text-base font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                ${isValid && !loading ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg" : "bg-sky-100 opacity-60 cursor-not-allowed text-slate-400"}
              `}
            >
              {loading ? (
                <div className="w-6 h-6 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* OR */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-[1px] bg-sky-200"></div>
              <p className="text-xs text-slate-500 font-medium">OR CONTINUE WITH</p>
              <div className="flex-1 h-[1px] bg-sky-200"></div>
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

            {/* LOGIN REDIRECT */}
            <p className="text-center text-xs text-slate-700 mt-8">
              Already have an account?
              <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold ml-1">Sign In</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
