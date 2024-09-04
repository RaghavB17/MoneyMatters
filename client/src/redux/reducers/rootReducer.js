import { combineReducers } from 'redux';
import userReducer from '../slices/userSlice';
import transactionReducer from '../slices/transactionSlice';
import themeReducer from '../slices/themeSlice'; // Ensure this is also a function

const rootReducer = combineReducers({
  user: userReducer,
  transactions: transactionReducer,
  theme: themeReducer,
});

export default rootReducer;
