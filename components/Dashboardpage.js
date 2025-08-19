"use client";

import React, { useEffect, useState } from 'react';
import { Mail, User, Phone, Image, Lock, KeyRound, Settings, Upload, Check, X } from 'lucide-react';
import { fetchuser, updateProfile } from '@/actions/useractions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { signIn } from "next-auth/react";

import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

/**
 * User Dashboard Component with Cloudinary Integration
 * 
 * This component provides a complete user profile management interface with:
 * - User profile data fetching and updating
 * - Profile picture upload to Cloudinary with preview
 * - Form validation and submission
 * - Modern glassmorphism UI design
 * - Authentication and session management
 * - Image optimization and error handling
 */
export default function Dashboardpage() {
  // Authentication and navigation hooks
  const { data: session, status } = useSession({
 
})
  const router = useRouter();

  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    razorpayId: '',
    razorpaySecret: '',
    profilePic: null, // File object for new uploads
  });

  const [preview, setPreview] = useState(null); // URL for profile picture preview
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'

  /**
   * Authentication check and data initialization
   */
  useEffect(() => {
    if (!session) {
      router.push('/login');
    } else {
      getData();
    }
  }, [session, router]);

  /**
   * Fetches user data from the server
   */
  const getData = async () => {
    try {
      setIsLoading(true);
      const u = await fetchuser(session.user.email);
      console.log("Fetched user data:", u);



      if (u) {
        setFormData(prevData => ({
          name: u.name || prevData.name || '',
          email: u.email || session.user.email || prevData.email || '',
          username: u.username || prevData.username || '',
          phone: u.phone || prevData.phone || '',
          razorpayId: u.razorpayId || prevData.razorpayId || '',
          razorpaySecret: u.razorpaySecret || prevData.razorpaySecret || '',
          profilePic: null, // Always reset file input
        }));

        // Set profile picture preview from Cloudinary URL
        if (u.profilePic) {
          setPreview(u.profilePic);
        }
      } else {
        setFormData(prevData => ({
          ...prevData,
          email: session.user.email || prevData.email || '',
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setFormData(prevData => ({
        ...prevData,
        email: session.user.email || prevData.email || '',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form input changes with special file handling
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePic' && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Create preview URL
      const tempPreview = URL.createObjectURL(file);
      setPreview(tempPreview);
      setFormData(prevData => ({ ...prevData, profilePic: file }));
      setUploadStatus('ready');
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  /**
   * Handles form submission with Cloudinary upload
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Create FormData for multipart submission
      const data = new FormData();

      // Always append email (required for user identification)
      data.append('email', formData.email || session.user.email);

      // Append other fields if they have values
      if (formData.name?.trim()) {
        data.append('name', formData.name.trim());
      }

      if (formData.username?.trim()) {
        data.append('username', formData.username.trim());
      }

      if (formData.phone?.trim()) {
        data.append('phone', formData.phone.trim());
      }

      if (formData.razorpayId?.trim()) {
        data.append('razorpayId', formData.razorpayId.trim());
      }

      if (formData.razorpaySecret?.trim()) {
        data.append('razorpaySecret', formData.razorpaySecret.trim());
      }

      // Handle profile picture upload
      if (formData.profilePic && typeof formData.profilePic !== 'string') {
        setUploadStatus('uploading');
        setUploadProgress(25);
        data.append('profilePic', formData.profilePic);
      }

      console.log("Submitting form data...");
      setUploadProgress(50);

      // Send update request
      const result = await updateProfile(data, session.user.name);

      setUploadProgress(100);

      if (result?.error) {
        setUploadStatus('error');
        alert(`Error: ${result.error}`);
      } else {
        setUploadStatus('success');

        // force revalidation of the session
        await signIn("github", { redirect: false });
        toast.success('Profile updated successfully!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        // Clean up file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }

        // Reset form state
        setFormData(prevData => ({
          ...prevData,
          profilePic: null
        }));

        // Refresh data
        setTimeout(() => {
          getData();
          setUploadStatus(null);
          setUploadProgress(0);
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setUploadStatus('error');
      alert("Something went wrong while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cleanup effect for blob URLs
   */
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /**
   * Form field configuration with updated field list
   */
  const fields = [
    { icon: <User className="w-5 h-5" />, name: 'name', placeholder: 'Full Name', type: 'text', accent: 'cyan' },
    { icon: <Mail className="w-5 h-5" />, name: 'email', placeholder: 'example@gmail.com', type: 'email', accent: 'blue' },
    { icon: <User className="w-5 h-5" />, name: 'username', placeholder: 'Username', type: 'text', accent: 'purple' },
    { icon: <Phone className="w-5 h-5" />, name: 'phone', placeholder: '9876543210', type: 'tel', accent: 'teal' },
    { icon: <Image className="w-5 h-5" />, name: 'profilePic', placeholder: '', type: 'file', accent: 'cyan' },
    { icon: <KeyRound className="w-5 h-5" />, name: 'razorpayId', placeholder: 'Razorpay ID', type: 'text', accent: 'blue' },
    { icon: <Lock className="w-5 h-5" />, name: 'razorpaySecret', placeholder: 'Razorpay Secret', type: 'password', accent: 'teal' },
  ];

  /**
   * Dynamic styling functions
   */
  const getAccentClasses = (accent, focused) => {
    const colors = {
      cyan: focused
        ? 'border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-cyan-950/20'
        : 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      blue: focused
        ? 'border-blue-400/70 shadow-[0_0_30px_rgba(59,130,246,0.25)] bg-blue-950/20'
        : 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      purple: focused
        ? 'border-purple-400/70 shadow-[0_0_30px_rgba(147,51,234,0.25)] bg-purple-950/20'
        : 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)]',
      teal: focused
        ? 'border-teal-400/70 shadow-[0_0_30px_rgba(20,184,166,0.25)] bg-teal-950/20'
        : 'hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]',
    };
    return colors[accent] || colors.cyan;
  };

  const getIconAccent = (accent, focused) => {
    const colors = {
      cyan: focused ? 'text-cyan-400' : 'text-cyan-500/70 group-hover:text-cyan-400',
      blue: focused ? 'text-blue-400' : 'text-blue-500/70 group-hover:text-blue-400',
      purple: focused ? 'text-purple-400' : 'text-purple-500/70 group-hover:text-purple-400',
      teal: focused ? 'text-teal-400' : 'text-teal-500/70 group-hover:text-teal-400',
    };
    return colors[accent] || colors.cyan;
  };

  // Loading state
  if (isLoading && !formData.email) {
    return (
      <div className="pt-35 pb-10 min-h-screen bg-[#040404cc] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="pt-35 pb-10 min-h-screen bg-[#040404cc] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-3xl">
          <div className="bg-[#040404bb] backdrop-blur-2xl rounded-3xl border border-gray-800/50 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] p-8 relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-900/5 via-gray-900/10 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#040404cc] rounded-3xl mb-6 shadow-[0_15px_45px_rgba(0,0,0,0.8)] border border-gray-800/60 relative group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Settings className="w-10 h-10 text-cyan-400 relative z-10" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-300 bg-clip-text text-transparent mb-3 tracking-wide">User Dashboard</h1>
              <p className="text-gray-400/90 text-lg">Manage your profile settings</p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent mx-auto mt-6"></div>
            </div>

            {/* Profile Picture Preview with Upload Status */}
            {preview && (
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500"></div>
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="relative h-28 w-28 rounded-full border-2 border-cyan-400/30 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    onError={(e) => {
                      console.error("Image failed to load:", preview);
                      setPreview(null);
                    }}
                  />

                  {/* Upload Status Indicator */}
                  {uploadStatus && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-3 border-gray-950 flex items-center justify-center">
                      {uploadStatus === 'uploading' && (
                        <div className="w-full h-full bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                          <Upload className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {uploadStatus === 'success' && (
                        <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {uploadStatus === 'error' && (
                        <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {fields.map(({ icon, name, placeholder, type, accent }) => (
                  <div key={name} className="relative group">
                    <div className={`flex items-center gap-5 bg-[#040404e2] border border-gray-800/50 rounded-2xl p-5 transition-all duration-500 shadow-[0_8px_25px_rgba(0,0,0,0.6)] ${getAccentClasses(accent, focusedField === name)}`}>

                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)] border border-gray-700/40 relative">
                        <div className={`transition-all duration-300 ${getIconAccent(accent, focusedField === name)}`}>
                          {icon}
                        </div>
                      </div>

                      <div className="flex-1">
                        {type !== 'file' ? (
                          <input
                            type={type}
                            name={name}
                            placeholder={placeholder}
                            value={formData[name] || ''}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(name)}
                            onBlur={() => setFocusedField(null)}
                            className="w-full p-3 rounded-xl bg-[#0f172a] border-2 border-cyan-500 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition duration-200"
                            required={name === 'name' || name === 'email'}
                            readOnly={name === 'email'}
                            disabled={isLoading}
                          />
                        ) : (
                          <label className="cursor-pointer text-gray-500/90 hover:text-cyan-400 transition-all duration-300 text-lg font-medium tracking-wide">
                            <input
                              type="file"
                              name={name}
                              onChange={handleChange}
                              onFocus={() => setFocusedField(name)}
                              onBlur={() => setFocusedField(null)}
                              className="w-full p-3 rounded-xl bg-[#0f172a] border-2 border-cyan-500 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition duration-200"
                              accept="image/*"
                              disabled={isLoading}
                            />
                            {formData.profilePic ? (
                              <span className="text-cyan-400">New image selected ✓</span>
                            ) : (
                              'Upload profile picture'
                            )}
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-10 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-2xl shadow-[0_15px_40px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-3 text-lg">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Settings className="w-5 h-5" />
                        Update Profile
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
              <p className="text-gray-500/70 text-sm">
                Your profile data is securely stored and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}