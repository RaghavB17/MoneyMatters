import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set up reCAPTCHA verifier
const setupRecaptcha = (containerId) => {
  // Check if reCAPTCHA verifier already exists and clear it
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    delete window.recaptchaVerifier; // Remove from memory
  }

  // Create a new reCAPTCHA verifier
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible", // Use "normal" for visible reCAPTCHA
      callback: (response) => {
        console.log("reCAPTCHA solved:", response);
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired, please solve again.");
      },
      'error-callback': (error) => {
        console.error("reCAPTCHA error:", error);
      }
    });
  }

  // Render reCAPTCHA and store the widget ID
  window.recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
  }).catch((error) => {
    console.error("Error rendering reCAPTCHA", error);
  });
};

export { auth, setupRecaptcha, signInWithPhoneNumber };
