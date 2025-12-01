import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import logomark from "../assets/logo.png";
import logoname from "../assets/Logoname.png";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorState, setErrorState] = useState(false);

  // 🔥 SHOW TOAST
  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // 🔥 SUBMIT HANDLER
  async function handleReset() {
    if (!email.includes("@")) {
      setErrorState(true);
      showToast("Enter a valid email");
      return;
    }

    setLoading(true);
    setErrorState(false);

    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset link sent! Check your email.", "success");

      // SUCCESS → HIDE INPUT
      setEmailSent(true);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrorState(true);
        showToast("Email is not registered");
      } else {
        showToast(error.message);
      }
    }

    setLoading(false);
  }

  return (
    <>
      {/* TOAST */}
      {toast && (
        <div
          className={`
            fixed top-4 right-4 px-4 py-2 rounded-xl text-white
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
          `}
        >
          {toast.msg}
        </div>
      )}

      {/* MAIN */}
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(145deg,#25293C 0%,#646FA2 100%)" }}
      >
        <div className="
          flex w-[900px] h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-[#222738]
          max-md:flex-col max-md:w-[92%] max-md:h-auto max-md:py-10
        ">
          
          {/* LEFT */}
          <div className="
            w-[50%] border-r border-gray-700/40 flex flex-col items-center justify-center 
            gap-3 max-md:w-full max-md:border-none max-md:mb-6
          ">
            <img src={logomark} className="w-[180px] max-md:w-[110px]" draggable="false" />
            <img src={logoname} className="w-[200px] max-md:w-[130px]" draggable="false" />

            <p className="text-gray-300 text-center px-10 text-sm">
              Reset your password and continue learning with Knowra.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-[50%] px-16 text-white max-md:w-full max-md:px-6">

            <h1 className="text-2xl font-bold text-center mt-14">Forgot Password</h1>
            <p className="text-center text-gray-300 text-sm mb-10">
              Enter your registered email to receive reset link
            </p>

            {/* IF EMAIL SUCCESS → HIDE INPUT FIELD */}
            {!emailSent ? (
              <>
                <label className="text-xs font-semibold">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full bg-[#2C3143] p-3 rounded-xl mt-1 outline-none
                    ${errorState ? "border border-red-500" : ""}
                  `}
                />
                
                {errorState && (
                  <p className="text-red-400 text-xs mt-1">
                    Email not registered
                  </p>
                )}

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className={`
                    w-full py-3 mt-8 rounded-xl text-lg font-semibold
                    ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"}
                  `}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </>
            ) : (
              <div className="text-center mt-20">
                <h2 className="text-green-400 text-xl font-semibold">
                  Reset link sent!
                </h2>
                <p className="text-gray-300 mt-2">
                  Please check your email inbox to reset your password.
                </p>
              </div>
            )}

            <p className="text-center text-sm mt-6 text-gray-300">
              Remember password?  
              <Link to="/login" className="text-blue-400 ml-1">Login</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
