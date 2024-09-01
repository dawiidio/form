import React, {FunctionComponent, PropsWithChildren, useContext, useEffect, useMemo,} from 'react';
import {FormObjectContext} from '~/FormObjectContext.js';
import {useFieldArray, useFormContext, Validate} from 'react-hook-form';
import {FormArrayContext} from '~/FormArrayContext.js';


export interface FormArrayProps extends PropsWithChildren {
    /**
     * Name of the form array field
     */
    name: string;
    /**
     * Minimum number of items in the array
     */
    minLength?: number;
    /**
     * Maximum number of items in the array
     */
    maxLength?: number;
    /**
     * Whether the field is required
     */
    required?: boolean;
    /**
     * Validation function
     */
    // fixme add types
    validate?: Validate<any, any>;
    /**
     * Initial value for new entries in the FormArray, not the existing ones, these will be taken from the form
     * context default values
     *
     * @example <FormArray name="items" initialValue={{ myField: 'Default value for new entry' }}>{...}</FormArray>
     */
    initialValue?: any;
    /**
     * Whether to set initial value on mount, if true then on form will be rendered with one empty entry taken
     * from the initialValue prop
     */
    setInitialValueOnMount?: boolean;
}

/**
 * FormArray component - a wrapper for object of fields. It provides context for nested fields, and should
 * not be used as a standalone component. It was designed to be used as a foundation for creating custom
 * FormArrayControls components that contain a set of fields and button to add/remove/replace/update new entries.
 * @constructor
 */
export const FormArray: FunctionComponent<FormArrayProps> = ({
    name,
    children,
    required,
    validate,
    minLength,
    maxLength,
    initialValue,
    setInitialValueOnMount,
}: FormArrayProps) => {
    const nestedFormContext = useContext(FormObjectContext);
    const contextualName = nestedFormContext
        ? `${nestedFormContext}.${name}`
        : name;
    const { control } = useFormContext();

    const fieldArray = useFieldArray({
        control,
        name: contextualName,
        rules: {
            minLength,
            maxLength,
            required,
            validate,
        },
    });

    const contextValue = useMemo(() => {
        return {
            name: contextualName,
            initialValue,
            ...fieldArray,
        };
    }, [fieldArray, name, initialValue]);

    useEffect(() => {
        // fixme it adds initial value twice, may be connected to react dev mode
        if (setInitialValueOnMount && fieldArray.fields.length === 0)
            fieldArray.append(initialValue);
    }, []);

    return (
        <FormArrayContext.Provider value={contextValue}>
            {children}
        </FormArrayContext.Provider>
    );
};
