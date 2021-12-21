import SubscribeForm from "./components/SubscribeForm/SubscribeForm";
import { Alert, AlertColor, Box, Snackbar } from "@mui/material";
import { useCallback, useState } from "react";

interface SnackbarConfig {
  open: boolean,
  severity?: AlertColor,
  message?: string,
}

export function App() {

  const [snackbarConfig, setSnackbarConfig] = useState<SnackbarConfig>({
    open: false,
    severity: "success" as AlertColor,
    message: ""
  });

  const onSubscriptionAdded = useCallback((errors?: string[]) => {
    setSnackbarConfig({
      open: true,
      severity: errors && errors.length ? "error" : "success",
      message: errors && errors.length ? errors.join("; ") : "Subscription added successfully"
    });
  }, []);

  return (
    <>
      <Box sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <SubscribeForm onSubscriptionAdded={onSubscriptionAdded} />
      </Box>
      <Snackbar open={snackbarConfig.open} autoHideDuration={6000}
                onClose={() => setSnackbarConfig({ open: false })}>
        <Alert severity={snackbarConfig.severity} sx={{ width: "100%" }}>
          {snackbarConfig.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
