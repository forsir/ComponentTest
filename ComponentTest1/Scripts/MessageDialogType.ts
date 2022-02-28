/**
 * Determines the type of message dialog.
 *
 * @state Info - Message required
 * @state Warning - Message and Ok action required, Cancel action optional
 * @state Error - Message required
 * @state ConfirmAction - Message and Ok action required, Cancel and other action optional
 */
const enum MessageDialogType {
    Info = "info",
    Warning = "warning",
    Error = "error",
    ConfirmAction = "confirm-action" //Is this used? Why not to change it for succeed?
}