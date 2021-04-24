import { Button } from "@material-ui/core";
import history from "../../helpers/history";
import { closeSnackbar } from "../../helpers/SnackBarUtils";

const SnackbarActions = () => {};

SnackbarActions.SignIn = () => (
  <Button
    onClick={() => {
      closeSnackbar();
      history.push("/auth", {
        from: history.location,
      });
    }}
  >
    SIGN IN
  </Button>
);

SnackbarActions.Dismiss = (props) => {
  const { snackKey } = props;

  return (
    <Button
      onClick={() => {
        closeSnackbar(snackKey);
      }}
    >
      DISMISS
    </Button>
  );
};

export default SnackbarActions;
