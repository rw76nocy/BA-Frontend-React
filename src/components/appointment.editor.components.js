import React from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import {AppointmentForm} from "@devexpress/dx-react-scheduler-material-ui";

export const DateEditor = React.memo(
    ({
         onValueChange,
         value,
         readOnly,
         className,
         locale,
         excludeTime,
         ...restProps
     }) => {
        const memoizedChangeHandler = React.useCallback(
            (nextDate) => nextDate && onValueChange(nextDate.toDate()),
            [onValueChange]
        );
        const dateFormat = excludeTime ? "DD/MM/YYYY" : "DD/MM/YYYY HH:mm";

        return (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
                <DateTimePicker
                    disabled={readOnly}
                    renderInput={(props) => (
                        <TextField className={className} margin="normal" {...props} />
                    )}
                    value={value ? value : null}
                    onChange={memoizedChangeHandler}
                    inputFormat={dateFormat}
                    {...restProps}
                />
            </LocalizationProvider>
        );
    }
);

export const TextEditor = (props) => {
    if (props.type === 'multilineTextEditor') {
        return null;
    }

    return <AppointmentForm.TextEditor  {...props} />;
};

export const BooleanEditor = (props) => {
    if (props.label === 'All Day') {
        return null;
    }
    return <AppointmentForm.BooleanEditor {...props} />
};

export const Label = (props) => {
    if (props.text === 'More Information') {
        return null;
    }
    return <AppointmentForm.Label {...props} />
};

export const ResourceEditor = (props) => {
    if (props.resource.fieldName === 'location') {
        return null;
    }
    return <AppointmentForm.ResourceEditor {...props} />
};

export const BasicLayout = React.memo(({ onFieldChange, appointmentData, ...restProps }) => {
    const onCustomFieldChange = (nextValue) => {
        onFieldChange({ location: nextValue });
    };

    return (
        <AppointmentForm.BasicLayout
            appointmentData={appointmentData}
            onFieldChange={onFieldChange}
            {...restProps}
        >
            <AppointmentForm.Label
                text="Ort"
                type="title"
            />
            <AppointmentForm.TextEditor
                type="ordinaryTextEditor"
                value={appointmentData.location}
                onValueChange={onCustomFieldChange}
                placeholder="Ort"
                readOnly={false}
            />
        </AppointmentForm.BasicLayout>
    );
});
