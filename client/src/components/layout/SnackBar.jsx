import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { LayoutContext } from "../../utils/context/layout";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {

    const layoutCtx = React.useContext(LayoutContext);

    return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={layoutCtx.snackBarOpen}
                autoHideDuration={4000}
                onClose={layoutCtx.hideSnackBar}>

                <Alert onClose={layoutCtx.hideSnackBar} severity={layoutCtx.snackBarOptions.type} sx={{ width: "100%" }}>
                    {layoutCtx.snackBarOptions.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
