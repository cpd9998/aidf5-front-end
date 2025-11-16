import React from "react";
import {
  SignUp,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
