import {Fab, IconButton, styled} from "@mui/material";

const PREFIX = 'Demo';

export const classes = {
    container: `${PREFIX}-container`,
    text: `${PREFIX}-text`,
    button: `${PREFIX}-button`,
    addButton: `${PREFIX}-addButton`,
    content: `${PREFIX}-content`,
    header: `${PREFIX}-header`,
    closeButton: `${PREFIX}-closeButton`,
    buttonGroup: `${PREFIX}-buttonGroup`,
    picker: `${PREFIX}-picker`,
    wrapper: `${PREFIX}-wrapper`,
    icon: `${PREFIX}-icon`,
    textField: `${PREFIX}-textField`,
};

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
    [`&.${classes.button}`]: {
        color: theme.palette.background.default,
        padding: 0,
    },
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
    [`&.${classes.addButton}`]: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(4),
    },
}));