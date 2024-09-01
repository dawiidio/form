import React, {FC, PropsWithChildren, ReactNode, SyntheticEvent} from 'react';
import {DefaultValues, FormProvider, useForm} from 'react-hook-form';
import type {AnyObjectSchema} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {CLASSNAMES} from "~/consts.js";
import type {UseFormProps} from "react-hook-form";

export interface SubmitButtonProps {
    disabled?: boolean;
}

export type SubmitButtonFC = FC<SubmitButtonProps>;

export interface FormProps<T extends Record<string, any>> {
    error?: string | ReactNode;
    onSubmit: (
        data: T,
        event: SyntheticEvent<SubmitEvent, Event> | undefined,
    ) => void | Promise<void>;
    onCancel?: () => void;
    onError?: () => void;
    defaultValues?: DefaultValues<T>;
    schema: AnyObjectSchema;
    disabled?: boolean;
    submitButton?: SubmitButtonFC;
    options?: UseFormProps<T>;
}

const DefaultSubmitButton: SubmitButtonFC = ({ disabled }) => <button disabled={disabled} className={CLASSNAMES.formSubmitButton} type="submit">Submit</button>;

export function Form<T extends Record<string, any>>({
    error,
    onError,
    defaultValues,
    onSubmit,
    schema,
    children,
    disabled,
    submitButton: SubmitButton = DefaultSubmitButton,
    options = {},
}: FormProps<T> & PropsWithChildren) {
    const { handleSubmit, ...rest } = useForm<T>({
        defaultValues,
        resolver: yupResolver(schema),
        ...options,
    });

    const submit = handleSubmit((data, event) => {
        onSubmit(data, event as SyntheticEvent<SubmitEvent, Event> | undefined);
    }, onError);

    return (
        <FormProvider {...rest} handleSubmit={handleSubmit}>
            <form onSubmit={submit} className={CLASSNAMES.formElement}>
                {error}
                {children}
                <SubmitButton disabled={disabled} />
            </form>
        </FormProvider>
    );
}
