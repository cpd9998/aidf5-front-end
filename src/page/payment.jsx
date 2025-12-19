import { useLocation, useNavigate } from "react-router-dom";
import { useAddHashMutation } from "@/lib/api";
import { useEffect, useState, useRef } from "react";

const Payment = () => {
  const [addHash, { isLoading }] = useAddHashMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState(null);
  const hasSubmitted = useRef(false);

  const {
    order_id,
    amount,
    currency,
    firstName,
    lastName,
    email,
    phone,
    idNumber,
    address,
    city,
    country,
  } = location.state || {};

  useEffect(() => {
    // Prevent double submission
    if (hasSubmitted.current) return;

    // Validate required data
    if (!order_id || !amount || !firstName || !lastName || !email || !phone) {
      setPaymentError("Missing required payment information");
      console.error("Missing fields:", {
        order_id,
        amount,
        firstName,
        lastName,
        email,
        phone,
      });
      return;
    }

    const initiatePayment = async () => {
      try {
        hasSubmitted.current = true;

        const paymentDetails = {
          order_id: order_id,
          amount: "100.00",
          currency: currency || "LKR",
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          idNumber: idNumber,
          address: address || "N/A",
        };

        console.log("Sending payment details:", paymentDetails);

        // Get hash from backend
        const response = await addHash(paymentDetails).unwrap();

        console.log("Backend response:", response);

        // Prepare payment data
        const paymentData = {
          sandbox: "true", // Must be string
          merchant_id: response.merchantId.toString(),
          return_url: `${window.location.origin}/payments-success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          notify_url:
            "https://unsatisfactory-maddox-unskeptically.ngrok-free.dev",
          order_id: paymentDetails.order_id.toString(),
          items: "Hotel Room Booking",
          amount: response.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.firstName,
          last_name: paymentDetails.lastName,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: city || "Colombo",
          country: country || "Sri Lanka",
          hash: response.hash,
        };

        console.log("Payment data prepared:", paymentData);

        // Create and submit form to PayHere
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://sandbox.payhere.lk/pay/checkout";
        form.style.display = "none";

        // Add all payment fields as hidden inputs
        Object.keys(paymentData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);

        console.log("Submitting payment form to PayHere...");

        // Submit form after a short delay
        setTimeout(() => {
          form.submit();
        }, 500);
      } catch (error) {
        console.error("Payment initiation error:", error);
        hasSubmitted.current = false;
        setPaymentError(
          error?.data?.message || error?.message || "Failed to initiate payment"
        );
      }
    };

    initiatePayment();
  }, []);

  if (paymentError) {
    return (
      <div
        style={{
          padding: "40px",
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          ❌
        </div>
        <h2
          style={{
            color: "#d32f2f",
            marginBottom: "15px",
          }}
        >
          Payment Error
        </h2>
        <p
          style={{
            color: "#666",
            marginBottom: "30px",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          {paymentError}
        </p>

        <button
          onClick={() => {
            hasSubmitted.current = false;
            navigate(-1);
          }}
          style={{
            padding: "12px 30px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "60px",
            height: "60px",
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <h2 style={{ marginBottom: "10px" }}>Initializing Payment...</h2>
        <p style={{ color: "#666" }}>
          Please wait while we prepare your payment.
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          💳
        </div>
        <h2 style={{ marginBottom: "15px" }}>Redirecting to Payment Gateway</h2>
        <p
          style={{
            color: "#666",
            marginBottom: "20px",
            lineHeight: "1.6",
          }}
        >
          You will be redirected to PayHere's secure payment page shortly...
        </p>
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

export default Payment;
