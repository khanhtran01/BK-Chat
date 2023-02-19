// import PropTypes from 'prop-types';
// import ProfileProvider from '.';

const ProfileReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "HANDLE_DIALOG":
      return {
        ...state,
        openDialog: payload,
      };
    case "HANDLE_USERNAME":
      return {
        ...state,
        username: payload,
      }
    case "HANDLE_AGE":
      return {
        ...state,
        age: payload,
      }
    case "HANDLE_DESCRIPTION":
      return {
        ...state,
        description: payload,
      }
    case "HANDLE_AVATAR":
      return {
        ...state,
        avatar: {
          ...state.avatar,
          name: payload.name,
          file: payload.file,
        },
      }
    case "HANDLE_LOCATION":
      return {
        ...state,
        location: payload,
      }
    default:
      return { ...state };
  }
};

export { ProfileReducer };

// ProfileReducer.prototype = {
//   state: PropTypes.object()
//   username: String,
//   age: Number,
//   location: String,
//   avatar: String,
//   openDialog: Boolean,
//   description: String,
// }
