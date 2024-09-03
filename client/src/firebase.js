import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Your Firebase configuration object
// const firebaseConfig = {
//   apiKey: "AIzaSyDFW_NKdIF5Q5SjlUBnHlB6QlKAzQ_R2Og",
//   authDomain: "bt-verify-cfc7f.firebaseapp.com",
//   projectId: "bt-verify-cfc7f",
//   storageBucket: "bt-verify-cfc7f.appspot.com",
//   messagingSenderId: "773414404553",
//   appId: "1:773414404553:web:29f7ca21b1b21a3d3d6818"
// };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set up reCAPTCHA verifier
const setupRecaptcha = (containerId) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
  
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible", // "normal" if you want it visible
      callback: (response) => {
        console.log("reCAPTCHA solved", response);
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired, please solve again.");
      },
    });
  
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    }).catch((error) => {
      console.error("Error rendering reCAPTCHA", error);
    });
  };

export { auth, setupRecaptcha, signInWithPhoneNumber };
