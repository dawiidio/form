import {FieldError, useFormContext} from 'react-hook-form';
import React, {type FC, ForwardRefExoticComponent} from 'react';
import {useFormInputController} from '~/useFormInputController';
import {RefCallBack} from "react-hook-form/dist/types";

export interface CommonFormInputProps<T> {
    value?: T | undefined;
    name: string;
    label?: string;
    disabled?: boolean;
    onChange: (event: { target: { value: T } }) => void;
    onBlur?: () => void;
    ref?: RefCallBack;
    error?: string;
}

export interface FormInputProps<T> extends Omit<CommonFormInputProps<T>, 'onBlur' | 'onChange' | 'ref'>, Record<string, any> {
    component: FC<CommonFormInputProps<T>> | ForwardRefExoticComponent<CommonFormInputProps<T>>;
    defaultValue?: T;
}

const getStatusProps = (error?: FieldError) => {
    return {
        error: error?.message || '',
    };
};

export function FormInput<T>({
    name,
    label,
    component: Component,
    defaultValue,
    ...others
}: FormInputProps<T>) {
    const { control } = useFormContext();
    const {
        fieldState,
        field
    } = useFormInputController({
        name,
        control,
        defaultValue,
    });

    return (
        <Component
            {...field}
            // @ts-ignore
            value={field.value ?? ''}
            label={label || name}
            {...getStatusProps(fieldState.error)}
            {...others}
        />
    );
}
