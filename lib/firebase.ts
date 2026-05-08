import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = { 
  apiKey: "AIzaSyBPwFv3rqimaFsmsxH8rIq0_c8f1zC3Bq4", 
  authDomain: "candidate-offline-poc.firebaseapp.com", 
  projectId: "candidate-offline-poc", 
  storageBucket: "candidate-offline-poc.firebasestorage.app", 
  messagingSenderId: "390407778881", 
  appId: "1:390407778881:web:fb66d54eb6447524304cc0", 
  measurementId: "G-SN7PC0P7L0" 
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache for offline support
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export { db };
