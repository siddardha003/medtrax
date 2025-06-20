import { notification } from "antd";
import { SHOW_NOTIFICATION } from './actions';

const notificationState = {
  message: null,
  massageType: null,
  description: null
}

export default function notificationReducer(state = notificationState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      // Also show antd notification
      notification[action.payload.massageType]({
        message: action.payload.message,
        description: action.payload.description,
      });
      
      // Store in state for custom notification component
      return {
        ...state,
        message: action.payload.message,
        massageType: action.payload.massageType,
        description: action.payload.description
      }
      
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        message: null,
        massageType: null,
        description: null
      }

    default:
      return state
  }
}
