"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

import { fetchPayments, initiatePayment, fetchuser } from '@/actions/useractions';

const Paymentpage = () => {
    const { data: session, status } = useSession({})
    const { username } = useParams();
    const Name = decodeURIComponent(username);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
    const [currentUser, setCurrentUser] = useState({});
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalSupporters: 0,
        averageContribution: 0,
        thisMonthEarnings: 0,
        last7DaysEarnings: 0,
        topSupporter: null,
        currentStreak: 0
    });
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Check if the current session user is the profile owner
    const isProfileOwner = session?.user?.username === Name || session?.user?.email === currentUser?.email;

    const handlechange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!session || !session.user?.email) return;
        getData();
    }, [session?.user?.email, Name]);

    const handleSubmit = async (razorpayResponse = null) => {
        if (!paymentform.amount || !paymentform.message || !paymentform.name)
            return alert("Please fill all fields");

        setIsSubmitting(true);

        try {
            if (razorpayResponse) {
                const paymentData = {
                    name: paymentform.name,
                    amount: paymentform.amount,
                    message: paymentform.message,
                    username: Name,
                    to_user: Name,
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,
                };

                const response = await fetch('/api/razorpay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentData)
                });

                const result = await response.json();

                if (result.success) {
                    await getData();
                    setPaymentform({ name: "", message: "", amount: "" });
                }

                return result;
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Export functionality
    const exportData = (format) => {
        const successfulPayments = payments.filter(p => p.done);

        if (format === 'csv') {
            const csvContent = [
                ['Date', 'Name', 'Amount (₹)', 'Message', 'Transaction ID'],
                ...successfulPayments.map(p => [
                    p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN') : 'N/A',
                    p.name || 'Anonymous',
                    p.amount || 0,
                    `"${p.message || ''}"`,
                    p._id?.slice(-6) || 'N/A'
                ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${Name}_support_history_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        }

        setShowExportModal(false);
    };

    const getData = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching data for username:', username);

            const user = await fetchuser(username);
            setCurrentUser(user || {});

            // Only fetch payments if user is the profile owner
            let dbPayments = [];
            if (session?.user && (session.user.username === Name || session.user.email === user?.email)) {
                dbPayments = await fetchPayments(username);
            }

            const sortedPayments = Array.isArray(dbPayments)
                ? dbPayments.sort((a, b) => b.amount - a.amount)
                : [];

            // Calculate stats for profile owner
            if (isProfileOwner) {
                const successfulPayments = sortedPayments.filter(p => p.done);
                const totalEarnings = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
                const totalSupporters = successfulPayments.length;
                const averageContribution = totalSupporters > 0 ? Math.round(totalEarnings / totalSupporters) : 0;

                // Calculate this month's earnings
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const thisMonthEarnings = successfulPayments
                    .filter(p => {
                        if (!p.created_at) return false;
                        const paymentDate = new Date(p.created_at);
                        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
                    })
                    .reduce((sum, p) => sum + (p.amount || 0), 0);

                // Calculate last 7 days earnings
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const last7DaysEarnings = successfulPayments
                    .filter(p => {
                        if (!p.created_at) return false;
                        return new Date(p.created_at) >= weekAgo;
                    })
                    .reduce((sum, p) => sum + (p.amount || 0), 0);

                // Find top supporter
                const supporterMap = {};
                successfulPayments.forEach(p => {
                    const name = p.name || 'Anonymous';
                    if (!supporterMap[name]) {
                        supporterMap[name] = { total: 0, count: 0 };
                    }
                    supporterMap[name].total += p.amount || 0;
                    supporterMap[name].count += 1;
                });

                const topSupporter = Object.entries(supporterMap)
                    .sort(([, a], [, b]) => b.total - a.total)[0];

                // Calculate current streak (consecutive days with payments)
                const sortedByDate = successfulPayments
                    .filter(p => p.created_at)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                let currentStreak = 0;
                let checkDate = new Date();
                checkDate.setHours(0, 0, 0, 0);

                for (let i = 0; i < 30; i++) { // Check last 30 days
                    const hasPaymentThisDay = sortedByDate.some(p => {
                        const paymentDate = new Date(p.created_at);
                        paymentDate.setHours(0, 0, 0, 0);
                        return paymentDate.getTime() === checkDate.getTime();
                    });

                    if (hasPaymentThisDay) {
                        currentStreak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                setStats({
                    totalEarnings,
                    totalSupporters,
                    averageContribution,
                    thisMonthEarnings,
                    last7DaysEarnings,
                    topSupporter: topSupporter ? {
                        name: topSupporter[0],
                        total: topSupporter[1].total,
                        count: topSupporter[1].count
                    } : null,
                    currentStreak
                });
            }

            setCurrentUser(user || {});
            setPayments(sortedPayments);

            console.log('User:', user, 'Payments:', sortedPayments);
        } catch (error) {
            console.error('Error fetching data:', error);
            setCurrentUser({});
            setPayments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const pay = async (amount) => {
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (!currentUser.razorpayId || !currentUser.razorpaySecret) {
            alert(`${Name} hasn't set up payment processing yet. Please contact them to set up Razorpay credentials.`);
            return;
        }

        try {
            setIsSubmitting(true);

            const order = await initiatePayment(amount, Name);
            const orderId = order.id;

            const options = {
                "key": currentUser.razorpayId,
                "amount": amount,
                "currency": "INR",
                "name": "Codefundr",
                "description": "Support Payment",
                "image": "https://example.com/your_logo",
                "order_id": orderId,
                "prefill": {
                    "name": paymentform.name || "Guest User",
                    "email": session?.user?.email || "guest@example.com",
                    "contact": "9999999999"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                },
                handler: async function (response) {
                    const result = await handleSubmit(response);
                    if (result && result.success) {
                        router.push(`/${username}?paymentdone=true`);
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                modal: {
                    ondismiss: async function () {
                        console.log("⚠️ Payment popup closed manually");

                        try {
                            await fetch('/api/saveAttempt', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    name: paymentform.name,
                                    message: paymentform.message,
                                    amount: paymentform.amount,
                                    username: Name,
                                    razorpay_order_id: orderId,
                                    status: 'cancelled',
                                    done: false
                                })
                            });
                        } catch (error) {
                            console.error('Error saving cancelled attempt:', error);
                        }

                        alert("Payment was cancelled.");
                        setIsSubmitting(false);
                    }
                }
            };

            console.log("Razorpay Key ID:", currentUser.razorpayId);

            const rzp1 = new Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Error initiating payment:', error);

            if (error.message.includes("Recipient has not set up Razorpay")) {
                alert(`${Name} hasn't configured payment processing yet. Please ask them to add their Razorpay credentials in their profile.`);
            } else if (error.message.includes("Recipient user not found")) {
                alert(`User ${Name} not found. Please check the username.`);
            } else {
                alert('Failed to initiate payment. Please try again.');
            }

            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}></div>
                    </div>

                    {/* Floating orbs */}
                    <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-500/15 via-blue-500/8 to-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 via-pink-500/8 to-cyan-500/12 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/15 via-teal-500/10 to-blue-500/15 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"></div>
                </div>

                <div className="relative z-10 px-6 py-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-20 mt-10">
                            <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 mb-8">
                                <span className="text-4xl">✨</span>
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                                Support
                                <br />
                                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">{currentUser.name}</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                                Show your appreciation with a contribution. Every bit helps fuel creativity and innovation.
                            </p>
                            <div className="flex justify-center mb-8">
                                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full"></div>
                            </div>
                        </div>

                        <div className={`${isProfileOwner ? 'space-y-12' : 'grid lg:grid-cols-1 max-w-2xl mx-auto'}`}>

                            {/* Stats Dashboard - Only for profile owner */}
                            {isProfileOwner && (
                                <div className="mb-12">
                                    {/* Header with Export Button */}
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                                Dashboard Overview
                                            </h2>
                                            <p className="text-gray-400 mt-2">Your complete support analytics</p>
                                        </div>
                                        <button
                                            onClick={() => setShowExportModal(true)}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                                        >
                                            <span>📊</span>
                                            Export Data
                                        </button>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        {/* Total Earnings */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">💰</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Earnings</h3>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                                    ₹{stats.totalEarnings.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Total Supporters */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">👥</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Supporters</h3>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                                    {stats.totalSupporters}
                                                </p>
                                            </div>
                                        </div>

                                        {/* This Month */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 to-yellow-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">📅</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">This Month</h3>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                                                    ₹{stats.thisMonthEarnings.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Last 7 Days */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">🔥</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Last 7 Days</h3>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                    ₹{stats.last7DaysEarnings.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Stats Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Average Contribution */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">📊</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Average Support</h3>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                    ₹{stats.averageContribution.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Top Supporter */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/50 to-rose-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">👑</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Top Supporter</h3>
                                                {stats.topSupporter ? (
                                                    <>
                                                        <p className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent truncate">
                                                            {stats.topSupporter.name}
                                                        </p>
                                                        <p className="text-sm text-gray-400">₹{stats.topSupporter.total.toLocaleString('en-IN')}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-lg text-gray-500">No data yet</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Support Streak */}
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/50 to-cyan-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                            <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 border border-gray-800/60 rounded-2xl p-6 text-center transform group-hover:scale-105 transition-all duration-300">
                                                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-2xl">⚡</span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Support Streak</h3>
                                                <p className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                                    {stats.currentStreak}
                                                </p>
                                                <p className="text-sm text-gray-400">{stats.currentStreak === 1 ? 'day' : 'days'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Form - Only show for visitors */}
                            {!isProfileOwner && (
                                <div className="relative group max-w-2xl mx-auto">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                                    <div className="relative bg-gradient-to-br from-gray-950/95 via-black to-gray-950/95 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-20 shadow-2xl">
                                        <div className="text-center mb-10">
                                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                                                <span className="text-3xl">💳</span>
                                            </div>
                                            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">Make Payment</h2>
                                            <p className="text-gray-400">Support {Name} with your contribution</p>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentform.name}
                                                    name="name"
                                                    onChange={handlechange}
                                                    placeholder="Enter your name"
                                                    className="w-full p-5 bg-black/50 border border-gray-600 text-white rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-500 transition-all duration-300 hover:border-gray-500"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                                    Amount
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl font-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={paymentform.amount}
                                                        name="amount"
                                                        onChange={handlechange}
                                                        placeholder="Enter amount"
                                                        min="1"
                                                        className="w-full p-5 pl-12 bg-black/50 border border-gray-600 text-white rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-500 transition-all duration-300 hover:border-gray-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 gap-3 mt-4">
                                                    {[100, 500, 1000, 2000].map((amt) => (
                                                        <button
                                                            key={amt}
                                                            onClick={() => {
                                                                setPaymentform({ ...paymentform, amount: amt.toString() });
                                                            }}
                                                            className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-cyan-900/50 hover:to-blue-900/50 text-gray-300 hover:text-cyan-300 rounded-xl text-sm font-semibold transition-all duration-300 border border-gray-700 hover:border-cyan-500/50 transform hover:scale-105"
                                                        >
                                                            ₹{amt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                                    Message
                                                </label>
                                                <textarea
                                                    value={paymentform.message}
                                                    name="message"
                                                    onChange={handlechange}
                                                    rows="4"
                                                    placeholder={`Leave a heartfelt message for ${Name}...`}
                                                    className="w-full p-5 bg-black/50 border border-gray-600 text-white rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-500 resize-none transition-all duration-300 hover:border-gray-500"
                                                ></textarea>
                                            </div>

                                            <button
                                                onClick={() => { pay(Number(paymentform.amount) * 100) }}
                                                disabled={isSubmitting || !paymentform.amount || !paymentform.message || !paymentform.name}
                                                className="w-full p-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-2xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                        Processing Payment...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span>✨</span>
                                                        Send Payment to {Name}
                                                        <span>✨</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Support Messages Dashboard - Only visible to profile owner */}
                            {isProfileOwner && (
                                <div className="relative">
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">Support Messages</h3>
                                        <p className="text-gray-400">Messages from your amazing supporters</p>
                                    </div>

                                    {/* Messages Grid */}
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto pr-2 pt-4"
                                        style={{
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#00ffff30 transparent",
                                        }}
                                    >
                                        <style jsx>{`
                                            div::-webkit-scrollbar {
                                                width: 8px;
                                            }
                                            div::-webkit-scrollbar-track {
                                                background: transparent;
                                            }
                                            div::-webkit-scrollbar-thumb {
                                                background-color: #00ffff80;
                                                border-radius: 10px;
                                                box-shadow: 0 0 10px #00ffff88, 0 0 20px #00ffff44;
                                            }
                                            div::-webkit-scrollbar-thumb:hover {
                                                background-color: #00ffff;
                                                box-shadow: 0 0 12px #00ffffaa, 0 0 24px #00ffff88;
                                            }
                                        `}</style>

                                        {isLoading ? (
                                            // Loading skeleton
                                            Array.from({ length: 6 }).map((_, index) => (
                                                <div key={index} className="animate-pulse">
                                                    <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-6">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 bg-gray-700 rounded-xl"></div>
                                                            <div>
                                                                <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
                                                                <div className="w-16 h-3 bg-gray-800 rounded"></div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-16 bg-gray-800 rounded-lg mb-3"></div>
                                                        <div className="w-20 h-6 bg-gray-700 rounded"></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : payments.length > 0 ? (
                                            payments.map((payment, index) =>
                                                payment.done ? (
                                                    <div
                                                        key={payment._id || index}
                                                        className="relative group/item bg-gradient-to-br from-gray-900/80 to-black/90 border border-gray-800/60 rounded-2xl p-6 hover:border-cyan-500/40 hover:from-gray-900/90 hover:to-black/95 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
                                                        onClick={() => setSelectedMessage(payment)}
                                                    >
                                                        {/* Amount Badge */}
                                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                            ₹{payment.amount?.toLocaleString('en-IN') || 0}
                                                        </div>

                                                        {/* Supporter Info */}
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 rounded-xl flex items-center justify-center text-cyan-300 font-bold">
                                                                {payment.name?.charAt(0).toUpperCase() || "?"}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white text-sm">
                                                                    {payment.name || "Anonymous"}
                                                                </h4>
                                                                <span className="text-xs text-gray-500">
                                                                    {payment.created_at
                                                                        ? new Date(payment.created_at).toLocaleDateString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })
                                                                        : "Recent"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Message - Improved layout */}
                                                        <div className="relative flex-1 mb-4">
                                                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                                                            <div className="pl-4 h-full flex flex-col">
                                                                <p className="text-gray-300 text-sm leading-relaxed italic flex-1 overflow-hidden">
                                                                    {payment.message && payment.message.length > 80
                                                                        ? `${payment.message.substring(0, 80)}...`
                                                                        : payment.message || "Thank you for your amazing work!"}
                                                                </p>

                                                                {payment.message && payment.message.length > 80 && (
                                                                    <button className="text-cyan-400 text-xs mt-2 hover:text-cyan-300 transition-colors self-start">
                                                                        Read more →
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Payment Status */}
                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                                <span className="text-xs text-green-400 font-medium">Completed</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500 font-mono">
                                                                #{payment._id?.slice(-6) || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null
                                            )
                                        ) : (
                                            <div className="col-span-full text-center py-16">
                                                <div className="text-6xl mb-6">🎉</div>
                                                <h4 className="text-2xl font-bold text-gray-300 mb-3">No support messages yet!</h4>
                                                <p className="text-gray-500 text-lg">Your first supporter message will appear here.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Enhanced Quick Stats Footer */}
                                    {payments.length > 0 && (
                                        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="bg-gradient-to-r from-gray-950/60 to-black/80 border border-gray-800/50 rounded-xl p-6 text-center group hover:border-cyan-500/30 transition-all duration-300">
                                                <div className="text-2xl mb-2">💬</div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Messages</p>
                                                <p className="text-2xl font-bold text-cyan-400">{payments.filter(p => p.done).length}</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-gray-950/60 to-black/80 border border-gray-800/50 rounded-xl p-6 text-center group hover:border-purple-500/30 transition-all duration-300">
                                                <div className="text-2xl mb-2">📝</div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Avg Message Length</p>
                                                <p className="text-2xl font-bold text-purple-400">
                                                    {Math.round(payments.filter(p => p.done && p.message).reduce((acc, p) => acc + (p.message?.length || 0), 0) / Math.max(payments.filter(p => p.done && p.message).length, 1))}
                                                </p>
                                                <p className="text-xs text-gray-500">characters</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-gray-950/60 to-black/80 border border-gray-800/50 rounded-xl p-6 text-center group hover:border-green-500/30 transition-all duration-300">
                                                <div className="text-2xl mb-2">📅</div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">This Week</p>
                                                <p className="text-2xl font-bold text-green-400">
                                                    {payments.filter(p => {
                                                        if (!p.done || !p.created_at) return false;
                                                        const weekAgo = new Date();
                                                        weekAgo.setDate(weekAgo.getDate() - 7);
                                                        return new Date(p.created_at) > weekAgo;
                                                    }).length}
                                                </p>
                                                <p className="text-xs text-gray-500">supporters</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-gray-950/60 to-black/80 border border-gray-800/50 rounded-xl p-6 text-center group hover:border-yellow-500/30 transition-all duration-300">
                                                <div className="text-2xl mb-2">⭐</div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Response Rate</p>
                                                <p className="text-2xl font-bold text-yellow-400">
                                                    {payments.filter(p => p.done && p.message && p.message.trim().length > 10).length > 0
                                                        ? Math.round((payments.filter(p => p.done && p.message && p.message.trim().length > 10).length / payments.filter(p => p.done).length) * 100)
                                                        : 0}%
                                                </p>
                                                <p className="text-xs text-gray-500">meaningful messages</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Export Modal */}
                            {showExportModal && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                                    <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
                                        <div className="text-center mb-6">
                                            <div className="text-4xl mb-4">📊</div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Export Support Data</h3>
                                            <p className="text-gray-400">Download your support history for records</p>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => exportData('csv')}
                                                className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                                            >
                                                <span>📄</span>
                                                Export as CSV
                                                <span className="text-sm opacity-75">(Excel compatible)</span>
                                            </button>

                                            <div className="text-center">
                                                <button
                                                    onClick={() => setShowExportModal(false)}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Message Detail Modal */}
                            {selectedMessage && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <div className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 rounded-xl flex items-center justify-center text-cyan-300 font-bold text-xl">
                                                    {selectedMessage.name?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">{selectedMessage.name || "Anonymous"}</h3>
                                                    <p className="text-gray-400">
                                                        {selectedMessage.created_at
                                                            ? new Date(selectedMessage.created_at).toLocaleDateString('en-IN', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                            : "Recent"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedMessage(null)}
                                                className="text-gray-400 hover:text-white transition-colors text-2xl"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* Amount */}
                                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 text-center">
                                            <p className="text-sm text-gray-400 mb-1">Support Amount</p>
                                            <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                                ₹{selectedMessage.amount?.toLocaleString('en-IN') || 0}
                                            </p>
                                        </div>

                                        {/* Message */}
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-white mb-3">Message</h4>
                                            <div className="bg-black/50 border border-gray-700 rounded-xl p-6">
                                                <p className="text-gray-300 leading-relaxed text-lg italic">
                                                    &quot;{selectedMessage.message || "Thank you for your amazing work!"}&quot;
                                                </p>

                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                                <p className="text-sm text-gray-400 mb-1">Transaction ID</p>
                                                <p className="text-white font-mono">#{selectedMessage._id?.slice(-6) || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                                <p className="text-sm text-gray-400 mb-1">Status</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <p className="text-green-400 font-medium">Completed</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={() => setSelectedMessage(null)}
                                            className="w-full p-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Owner Welcome Message */}
                            {isProfileOwner && payments.length === 0 && !isLoading && (
                                <div className="text-center py-12">
                                    <div className="inline-block p-8 bg-gradient-to-r from-gray-950/70 to-black/70 border border-gray-800/60 rounded-2xl backdrop-blur-sm max-w-2xl">
                                        <div className="text-5xl mb-6">🚀</div>
                                        <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                                            Ready to Receive Support!
                                        </h3>
                                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                            Your payment system is all set up. Share your profile link with your audience to start receiving support!
                                        </p>
                                        <div className="bg-black/50 border border-gray-700 rounded-lg p-3 text-left">
                                            <p className="text-sm text-gray-300 mb-2">Your Profile URL:</p>
                                            <code className="text-cyan-400 text-sm break-all">
                                                {typeof window !== 'undefined' ? `${window.location.origin}/${Name}` : `yourdomain.com/${Name}`}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Message for non-owners */}
                            {!isProfileOwner && (
                                <div className="text-center py-12">
                                    <div className="inline-block p-6 bg-gradient-to-r from-gray-950/70 to-black/70 border border-gray-800/60 rounded-2xl backdrop-blur-sm">
                                        <div className="text-4xl mb-4">💝</div>
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                            Support {Name}
                                        </h3>
                                        <p className="text-gray-400 max-w-md">
                                            Your contribution will help {Name} continue their amazing work.
                                            Fill out the form to show your support!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Footer */}
                        <div className="mt-24 text-center">
                            <div className="flex justify-center mb-8">
                                <div className="w-40 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full"></div>
                            </div>
                            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-950/70 to-black/70 border border-gray-800/60 rounded-2xl backdrop-blur-sm">
                                <span className="text-2xl">🔒</span>
                                <p className="text-gray-400 font-medium">
                                    Secure payments • Your support means everything
                                </p>
                                <span className="text-2xl">💖</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Paymentpage;