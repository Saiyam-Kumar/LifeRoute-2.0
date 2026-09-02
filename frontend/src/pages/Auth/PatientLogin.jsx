import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    LogIn,
} from "lucide-react";

import {
    login,
    getPatientMe,
} from "../../services/authService";


function PatientLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError(
                "Please enter your email and password."
            );
            return;
        }


        try {
            setLoading(true);


            // -----------------------------------------
            // STEP 1
            // Firebase authentication
            // -----------------------------------------

            const firebaseUser = await login(
                email,
                password
            );

            console.log(
                "Patient Firebase login successful:",
                firebaseUser.uid
            );


            // -----------------------------------------
            // STEP 2
            // Check LifeRoute patient profile
            // -----------------------------------------

            const patientProfile =
                await getPatientMe();

            console.log(
                "Patient profile:",
                patientProfile
            );


            // -----------------------------------------
            // STEP 3
            // Make sure Firebase user is registered
            // as a LifeRoute patient
            // -----------------------------------------

            if (
                !patientProfile ||
                !patientProfile.registered
            ) {
                setError(
                    "This account is not registered as a patient."
                );

                return;
            }


            // -----------------------------------------
            // STEP 4
            // Patient is fully authenticated
            // -----------------------------------------

            navigate("/patient/dashboard");

        } catch (err) {
            console.error(
                "Patient login error:",
                err
            );


            // Firebase authentication errors

            if (
                err.code ===
                "auth/invalid-credential"
            ) {
                setError(
                    "Incorrect email or password."
                );

            } else if (
                err.code ===
                "auth/user-not-found"
            ) {
                setError(
                    "No account exists with this email."
                );

            } else if (
                err.code ===
                "auth/wrong-password"
            ) {
                setError(
                    "Incorrect email or password."
                );

            } else if (
                err.code ===
                "auth/invalid-email"
            ) {
                setError(
                    "Please enter a valid email address."
                );

            } else if (
                err.code ===
                "auth/network-request-failed"
            ) {
                setError(
                    "Unable to connect to Firebase. Please check your internet connection and try again."
                );

            } else {
                setError(
                    err.message ||
                    "Unable to sign in. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center px-6 py-12">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
                className="w-full max-w-md"
            >

                <div className="bg-[#15161c] border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Header */}

                    <div className="mb-8">

                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">

                            <LogIn
                                className="text-orange-400"
                                size={24}
                            />

                        </div>


                        <h1 className="text-3xl font-bold">
                            Welcome back
                        </h1>


                        <p className="text-gray-400 mt-2">
                            Sign in to access your emergency
                            assessments and hospital
                            recommendation history.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>


                            <div className="relative">

                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />


                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-[#202126] border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>


                                <Link
                                    to="/patient/forgot-password"
                                    className="text-sm text-orange-400 hover:text-orange-300"
                                >
                                    Forgot password?
                                </Link>

                            </div>


                            <div className="relative">

                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />


                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-[#202126] border border-white/10 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-orange-500 transition"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >

                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition"
                        >

                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={19} />
                                </>
                            )}

                        </button>

                    </form>


                    {/* Register */}

                    <div className="mt-7 text-center text-sm text-gray-400">

                        Don't have an account?{" "}

                        <Link
                            to="/patient/register"
                            className="text-orange-400 hover:text-orange-300 font-semibold"
                        >
                            Create one
                        </Link>

                    </div>

                </div>

            </motion.div>

        </div>
    );
}


export default PatientLogin;