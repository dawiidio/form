import React, {FunctionComponent, PropsWithChildren, useContext} from 'react';
import {FormObjectContext} from '~/FormObjectContext.js';
import {CLASSNAMES} from "~/consts.js";

export type FormObjectContainer = FunctionComponent<PropsWithChildren>;

export interface FormObjectProps extends PropsWithChildren {
    name: string;
    container?: FormObjectContainer;
}

const DefaultFormObjectContainer: FormObjectContainer = ({ children }) => (
    <div className={CLASSNAMES.formObjectContainer}>{children}</div>
);

export const FormObject: FunctionComponent<FormObjectProps> = ({
    name,
    children,
    container: Container = DefaultFormObjectContainer,
}) => {
    const nestedFormContext = useContext(FormObjectContext);
    const contextualName = nestedFormContext
        ? `${nestedFormContext}.${name}`
        : name;

    return (
        <FormObjectContext.Provider value={contextualName}>
            <Container>{children}</Container>
        </FormObjectContext.Provider>
    );
};
