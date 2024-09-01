import {useContext} from "react";
import {FormObjectContext} from "~/FormObjectContext";
import {useController} from "react-hook-form";
import type {FieldPath, FieldValues, UseControllerProps} from "react-hook-form";

export const useFormInputController = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: UseControllerProps<TFieldValues, TName>) => {
    const nestedFormContext = useContext(FormObjectContext);
    const contextualName = nestedFormContext
        ? `${nestedFormContext}.${props.name}`
        : props.name;

    return useController<TFieldValues, TName>({
        ...props,
        name: contextualName as TName,
    });
}