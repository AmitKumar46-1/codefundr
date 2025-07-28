import React from 'react';
import { AlertTriangle, Settings, X, CreditCard } from 'lucide-react';

const RazorpaySetupAlert = ({ isOpen, onClose, onGoToDashboard, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-md w-full bg-gradient-to-br from-gray-950/95 via-black to-gray-950/95 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 shadow-2xl animate-in fade-in duration-300 zoom-in-95">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group"
                    aria-label="Close modal"
                >
                    <X size={16} className="text-gray-400 group-hover:text-white" />
                </button>
                
                {/* Alert content */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <AlertTriangle className="text-amber-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payment Setup Required</h3>
                    <p className="text-gray-400 leading-relaxed">
                        {userName ? `${userName} hasn't` : "This user hasn't"} set up their Razorpay payment credentials yet. 
                        They need to configure their payment settings to receive contributions.
                    </p>
                </div>

                {/* Info box */}
                <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <CreditCard className="text-cyan-400 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-cyan-300 font-semibold mb-1">What&apos;s needed:</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Razorpay API Key ID</li>
                                <li>• Razorpay API Secret Key</li>
                                <li>• Account verification</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onGoToDashboard}
                        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-cyan-500/25"
                    >
                        <Settings size={16} />
                        Set Up Payment Settings
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600"
                    >
                        Close
                    </button>
                </div>

                {/* Help text */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Need help? Check the dashboard for setup instructions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RazorpaySetupAlert;