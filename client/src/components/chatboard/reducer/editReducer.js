export const EditReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
      case "HANDLE_AVATAR":
        return {
          ...state,
          avatar: {
            ...state.avatar,
            name: payload.name,
            file: payload.file,
          },
        };
      case "HANDLE_DESCRIPTION":
        return {
          ...state,
          description: payload,
        };
      case "HANDLE_NAME":
        return {
          ...state,
          name: payload,
        };
        case "HANDLE_DIALOG":
        return {
          ...state,
          openDialog: payload,
        };
      default:
        return "unknown action";
    }
  };
//   HANDLE_AVATAR
// HANDLE_DESCRIPTION
// HANDLE_NAME