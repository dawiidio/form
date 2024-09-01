import React, { FunctionComponent, PropsWithChildren, useContext } from "react";
import { FormObjectContext } from "~/FormObjectContext.js";

export type FormObjectContainer = FunctionComponent<PropsWithChildren>;

export interface FormObjectProps extends PropsWithChildren {
    name: string;
}

export const FormObject: FunctionComponent<FormObjectProps> = ({
    name,
    children,
}) => {
    const nestedFormContext = useContext(FormObjectContext);
    const contextualName = nestedFormContext
        ? `${nestedFormContext}.${name}`
        : name;

    return (
        <FormObjectContext.Provider value={contextualName}>
            {children}
        </FormObjectContext.Provider>
    );
};
