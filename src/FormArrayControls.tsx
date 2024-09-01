import React, {
    FC,
    type FunctionComponent,
    PropsWithChildren,
    type ReactNode,
    useCallback,
    useContext,
    useMemo
} from 'react';
import type {UseFieldArrayReturn} from 'react-hook-form';
import {FormObject} from '~/FormObject.js';
import {FormArrayContext} from '~/FormArrayContext.js';
import {CLASSNAMES} from "~/consts.js";
import classNames from "classnames";

export type ContainerWithDeleteButtonInfo = {
    actionsVisible: boolean;
} & PropsWithChildren;

export type FormArrayControlsContainer = FC<PropsWithChildren>;

export const DefaultFormArrayControlsContainer: FormArrayControlsContainer = ({ children }) => <div className={CLASSNAMES.formArrayContainer}>{children}</div>;

const DefaultEntryContainer: FC<PropsWithChildren> = ({ children }) => (
    <div className={CLASSNAMES.formArrayEntryContainer}>{children}</div>
);

const DefaultFieldsContainer: FC<ContainerWithDeleteButtonInfo> = ({
    children,
    actionsVisible,
}) => (
    <div
        className={classNames({
            [CLASSNAMES.formArrayFieldsContainer]: true,
            [CLASSNAMES.formArrayFieldsContainerWithDeleteButton]:
                actionsVisible,
        })}
    >
        {children}
    </div>
);

export type RenderFormArrayControlsRemoveButton = (
    props: UseFieldArrayReturn & { removeEntry: () => void },
) => ReactNode;

const DefaultRenderActions: RenderFormArrayControlsRemoveButton = ({
    removeEntry,
    fields,
}) => (
    <button disabled={fields.length === 1} onClick={removeEntry} type='button'>
        -
    </button>
);

export type FormArrayControlsAddButton = FC<{
    addEntry: () => void;
}>;

const DefaultFormArrayControlsAddButton: FormArrayControlsAddButton = ({ addEntry }) => (
    <div className={CLASSNAMES.formArrayAddButtonContainer}>
        <button type='button' className={CLASSNAMES.formArrayAddButton} onClick={addEntry}>+</button>
    </div>
);

export interface FormArrayControlsProps {
    /**
     * Form fields wrapped into FormInput, or your raw input components ported with useFormInputController hook
     * @param controls
     */
    children: (controls: Omit<UseFieldArrayReturn, 'fields'>) => ReactNode;
    /**
     *  Container that wraps collection of items (fields), includes also action buttons if actionsVisible is true
     */
    entryContainer?: FC<PropsWithChildren>;
    /**
     * Container that wraps only fields passed as children
     */
    fieldsContainer?: FC<ContainerWithDeleteButtonInfo>;
    /**
     * Render function for action buttons
     */
    renderActions?: RenderFormArrayControlsRemoveButton;
    /**
     * Root container that wraps all the FormArrayControls component
     */
    container?: FormArrayControlsContainer;
    /**
     * If true, action buttons will be rendered
     */
    actionsVisible?: boolean;
    /**
     * Add button component
     */
    addButton?: FormArrayControlsAddButton;
}

export const FormArrayControls: FunctionComponent<FormArrayControlsProps> = ({
    children,
    renderActions = DefaultRenderActions,
    container: Container= DefaultFormArrayControlsContainer,
    entryContainer: EntryContainer = DefaultEntryContainer,
    fieldsContainer: FieldsContainer = DefaultFieldsContainer,
    actionsVisible = true,
    addButton: AddButton= DefaultFormArrayControlsAddButton
}) => {
    const formArrayCtx = useContext(FormArrayContext);

    if (!formArrayCtx)
        throw new Error(
            `FormFieldsArray must be rendered under FormArrayContext`,
        );

    const handleFieldDeleteFactory = useMemo(
        () => (idx: number) => () => {
            formArrayCtx.remove(idx);
        },
        [formArrayCtx.remove],
    );

    const addEntry = useCallback(() => {
        formArrayCtx.append(formArrayCtx.initialValue);
    }, [formArrayCtx.append, formArrayCtx.initialValue]);

    return (
        <Container>
            {formArrayCtx.fields.map((field, index) => (
                <FormObject
                    key={field.id}
                    name={`${formArrayCtx.name}.${index}.`}
                >
                    <EntryContainer>
                        <FieldsContainer actionsVisible={actionsVisible}>
                            {children(formArrayCtx)}
                        </FieldsContainer>
                        {actionsVisible &&
                            renderActions({
                                ...formArrayCtx,
                                removeEntry: handleFieldDeleteFactory(index),
                            })}
                    </EntryContainer>
                </FormObject>
            ))}
            <AddButton addEntry={addEntry}/>
        </Container>
    );
};
