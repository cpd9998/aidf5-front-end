import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, Home, Calendar } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (orderId) {
      setPaymentDetails({
        orderId,
        date: new Date().toLocaleString(),
      });

      // Optional: Call your backend to verify payment status
      // fetch(`/api/booking/${orderId}`)
      //   .then(res => res.json())
      //   .then(data => setPaymentDetails(prev => ({ ...prev, ...data })));
    }
  }, [searchParams]);

  const handlerGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-100 text-lg">
              Your booking has been confirmed
            </p>
          </div>

          {/* Payment Details Section */}
          <div className="p-8">
            {paymentDetails ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600 font-medium">Order ID</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {paymentDetails.orderId}
                    </span>
                  </div>

                  {paymentDetails.paymentId && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium">
                        Payment ID
                      </span>
                      <span className="font-mono font-semibold text-gray-900">
                        {paymentDetails.paymentId}
                      </span>
                    </div>
                  )}

                  {paymentDetails.method && (
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium">
                        Payment Method
                      </span>
                      <span className="font-semibold text-gray-900">
                        {paymentDetails.method}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Date & Time
                    </span>
                    <span className="font-semibold text-gray-900">
                      {paymentDetails.date}
                    </span>
                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm leading-relaxed">
                    <span className="font-semibold">
                      Confirmation email sent!
                    </span>
                    <br />A confirmation email has been sent to your registered
                    email address with your booking details and receipt.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading payment details...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8   grid grid-cols-1  gap-4">
              {/* <button
                onClick={() => navigate("/bookings")}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <Calendar className="w-5 h-5" />
                View Bookings
              </button> */}

              {/* <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button> */}

              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
