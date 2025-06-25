import { SHOW_NOTIFICATION } from './actions';

const notificationState = {
  message: null,
  messageType: null,
  description: null
}

export default function notificationReducer(state = notificationState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      // Store in state for custom notification component only
      return {
        ...state,
        message: action.payload.message,
        messageType: action.payload.messageType,
        description: action.payload.description
      }
      
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        message: null,
        messageType: null,
        description: null
      }

    default:
      return state
  }
}
