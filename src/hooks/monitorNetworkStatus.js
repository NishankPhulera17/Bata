// NetworkStatusMonitor.js (for detecting internet connection changes)
import { setInternetConnection, setSlowNetwork } from '../../redux/slices/internetSlice'
import NetInfo from "@react-native-community/netinfo";

const monitorNetworkStatus = (dispatch) => {
  const updateConnectionStatus = (state) => {
    dispatch(setInternetConnection(state.isConnected));
    // You can add more sophisticated logic to detect slow network here
    // For simplicity, let's assume it's not slow for now
    dispatch(setSlowNetwork(false));
  };

  const unsubscribe = NetInfo.addEventListener(state => {
    updateConnectionStatus(state);
  });

  // Initial check
  NetInfo.fetch().then(state => {
    updateConnectionStatus(state);
  });

  // Clean up listener when component unmounts
  return () => unsubscribe();
};

export default monitorNetworkStatus;
