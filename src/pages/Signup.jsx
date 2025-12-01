import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logomark from "../assets/logo.png";
import logoname from "../assets/Logoname.png";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";

// Firebase
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Backend URL
const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

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
        setTimeout(() => navigate("/login"), 1500);
      } else {
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
        className="w-full p-3 bg-[#2C3143] rounded-xl mt-1 mb-1"
        value={gUsername}
        onChange={(e) => setGUsername(e.target.value)}
        placeholder="Create username"
      />
      {usernameUsed && <p className="text-red-400 text-xs mb-2">Username already taken</p>}

      {/* MOBILE */}
      <label className="text-sm">Mobile Number</label>
      <input
        type="tel"
        maxLength="10"
        className="w-full p-3 bg-[#2C3143] rounded-xl mt-1 mb-1"
        value={gMobile}
        onChange={(e) => setGMobile(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter mobile number"
      />
      {mobileUsed && <p className="text-red-400 text-xs mb-2">Mobile already registered</p>}

      {/* CONTINUE BUTTON */}
      <button
        onClick={handleGoogleComplete}
        disabled={
          gUsername.trim().length < 3 ||
          gMobile.length !== 10 ||
          usernameUsed ||
          mobileUsed
        }
        className={`w-full py-3 rounded-xl font-semibold mt-3
          ${
            gUsername.trim().length >= 3 &&
            gMobile.length === 10 &&
            !usernameUsed &&
            !mobileUsed
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

        {/* MAIN CONTAINER */}
        <div
          className="
            flex w-[1300px] h-[780px] rounded-2xl shadow-2xl overflow-hidden
            bg-[#222738]
            max-md:flex-col max-md:w-[92%] max-md:h-auto max-md:py-8 max-md:rounded-xl
          "
        >

          {/* LEFT SECTION */}
          <div className="
                w-[48%] flex flex-col items-center justify-center gap-3 border-r border-gray-700/30
                max-md:w-full max-md:border-none max-md:mb-6 max-md:mt-4
                ">
            <img src={logomark} alt="Knowra logo mark" className="w-[230px] max-md:w-[110px] user-select-none pointer-events-none select-none" draggable="false" />
            <img src={logoname} alt="Knowra logo name" className="w-[260px] max-md:w-[140px] user-select-none pointer-events-none select-none" draggable="false" />
                           
            <p className="text-center text-gray-300 text-[14px] w-[78%]">
              Learn smarter, grow faster — Knowra empowers engineering minds.
            </p>
          </div>

          {/* RIGHT FORM AREA */}
                <div className="w-[54%] px-20 pb-10 text-white max-md:w-full max-md:px-6">

                <h1 className="text-3xl font-bold text-center mt-10">Create Account</h1>
                <p className="text-center text-gray-300 text-sm mb-10">Join us to start learning</p>

                {/* NAME + USERNAME */}
                <div className="flex gap-6 mb-6 max-md:flex-col max-md:gap-3">
                  <div className="w-1/2 max-md:w-full">
                  <label className="text-xs font-semibold">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#2C3143] p-3 rounded-xl mt-1 outline-none"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  </div>

                  <div className="w-1/2 max-md:w-full">
                  <label className="text-xs font-semibold">Username</label>
                  <input
                    type="text"
                    className="w-full bg-[#2C3143] p-3 rounded-xl mt-1 outline-none"
                    placeholder="Create username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {usernameUsed && <p className="text-red-400 text-xs mt-1">Username already taken</p>}
                  </div>
                </div>

                {/* MOBILE */}
            <label className="text-xs font-semibold">Mobile Number</label>
            <input
              type="tel"
              maxLength={10}
              className="w-full bg-[#2C3143] p-3 rounded-xl mt-1 outline-none"
              placeholder="mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            />
            {mobileUsed && <p className="text-red-400 text-xs mt-1">Mobile already registered</p>}

            {/* EMAIL */}
            <label className="text-xs font-semibold mt-4">Email </label>
            <input
              type="email"
              className="w-full bg-[#2C3143] p-3 rounded-xl mt-1 outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailUsed && <p className="text-red-400 text-xs mt-1">Email already in use</p>}

            {/* PASSWORD */}
                  <label className="text-xs font-semibold mt-4">Password</label>
                  <div className="relative mb-8">
                    <input
                    ref={passRef}
                    type={showPass ? "text" : "password"}
                    className="w-full bg-[#2C3143] p-3 pr-12 rounded-xl mt-1 outline-none"
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
                  </div>

                  {/* SIGN UP BUTTON */}
            <button
              onClick={handleSignup}
              disabled={!isValid || loading}
              className={`
                w-full py-3 text-lg font-semibold rounded-xl transition-all
                ${isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-[#3a3f52] opacity-40"}
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
              <div className="flex-1 h-[1px] bg-gray-600"></div>
              <p className="text-xs text-gray-400">OR CONTINUE WITH</p>
              <div className="flex-1 h-[1px] bg-gray-600"></div>
            </div>

            {/* GOOGLE */}
            <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#2C3143] py-3 rounded-xl"
            >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
           <span className="text-gray-200 text-sm">Continue with Google</span>
           </button>


            {/* LOGIN REDIRECT */}
            <p className="text-center text-sm mt-4 text-gray-300">
              Already have an account?
              <Link to="/login" className="text-blue-400 ml-1">Sign In</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
