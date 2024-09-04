import {CLASSNAMES} from "~/consts";
import {
    type DefaultValues,
    type FieldValues,
    FormProvider,
    useForm as useFormOriginal,
    type UseFormProps as UseFormPropsOriginal
} from "react-hook-form";
import React, {type FC, type PropsWithChildren, type ReactNode, type SyntheticEvent} from "react";
import type {AnyObjectSchema} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {DefaultSubmitButton, type SubmitButtonFC} from "~/Form";

// @ts-ignore
export interface UseFormProps<TFieldValues extends FieldValues, TContext>
    extends UseFormPropsOriginal<TFieldValues, TContext> {
    onSubmit: (
        data: TFieldValues,
        event: SyntheticEvent<SubmitEvent, Event> | undefined,
    ) => void | Promise<void>;
    onCancel?: () => void;
    onError?: () => void;
    defaultValues?: DefaultValues<TFieldValues>;
    values?: DefaultValues<TFieldValues>;
    schema: AnyObjectSchema;
    submitButton?: SubmitButtonFC;
    disabled?: boolean;
}

export interface UseFormFormProps {
    error?: string | ReactNode;
    loading?: boolean;
}

export const useForm = <
    TFieldValues extends FieldValues = FieldValues,
    TTransformedValues extends FieldValues | undefined = undefined,
>({
    submitButton: SubmitButton = DefaultSubmitButton,
    disabled,
    ...props
}: UseFormProps<TFieldValues, TTransformedValues>) => {
    // @ts-ignore
    const { handleSubmit, ...rest } = useFormOriginal({
        resolver: yupResolver(props.schema),
        disabled,
        ...props,
    });

    const submit = handleSubmit((data, event) => {
        props.onSubmit(
            data,
            event as SyntheticEvent<SubmitEvent, Event> | undefined,
        );
    }, props.onError);

    // todo memoization ?
    const Form: FC<PropsWithChildren & UseFormFormProps> = ({
        children,
        error,
        loading,
    }) => (
        <FormProvider {...rest} handleSubmit={handleSubmit}>
            <form onSubmit={submit} className={CLASSNAMES.formElement}>
                {error}
                {children}
                <SubmitButton disabled={disabled} />
            </form>
        </FormProvider>
    );

    return {
        Form,
        ...rest,
    };
};
