# @dawiidio/form

Small, headless (port it to any UI framework) library for creating rich and robust forms in React. 
Based on `react-hook-form` and `yup` validator.

### Why? 
Because I'm tired of writing the same form handling code over and over again. AND I don't like form creators based 
on configuration as many do now. I think forms often need additional logic, and it's better to have them in code 
when we can easily manipulate them, change rules, parse data, port new fields etc.

### Why headless?

Because I wanted to have some nice building blocks of higher abstraction level, so I can use them always the same
everywhere and port only the UI part.

### Why not just use `react-hook-form` and `yup`?

Please do! This lib is just a wrapper around them, with some small additions and some sugar on top.

### Porting to UI frameworks

There will be some ports to popular UI frameworks like Material-UI, Ant Design, etc. But in my work I use custom UI,
so you will need wait or do it yourself. If you do, please share it with me and I'll link it here.

### Porting fancy inputs

What do I mean by fancy inputs? I mean inputs that are not just simple text inputs, but some complex components like
drag&drop libs, canvas editors, rich text editors, etc. With usage of `useFormInputController` you can easily port
any of them, store their value in form state, validate them as any other input, and use them in your forms.
I like this approach because it gives me encapsulation and reusability of complex components. I can write
canvas editor for ML pipelines, and when someone wants to add it to the form as a part of other flow, I can easily just 
write simple wrapper around it and use it as a form input.

## Installation

```bash
npm install @dawiidio/form
```

## Usage

```tsx
import React, {useState} from 'react';
import {Field, Form, FormObject, FormArray, FormInput, FormArrayControls} from '@dawiidio/form';
import Input from './Input';

export interface MyFormValues {
    fieldWithoutNesting: string;
    obj: {
        someField: string;
    };
    arr: Array<{
        arrField: string;
        objNestedInArr: {
            nestedField: string;
        };
    }>;
}

// define schema for form validation
const schema = yup.object({
    fieldWithoutNesting: yup.string().required(),
    obj: yup.object({
        someField: yup.string().required()
    }),
    arr: yup.array().of(
        yup.object({
            arrField: yup.string().required(),
            objNestedInArr: yup.object({
                nestedField: yup.string().required()
            })
        })
    )
});

// default values, in real app most likely fetched from API
const defaultValues = {
    fieldWithoutNesting: 'defaultValue',
    obj: {
        someField: 'someValue'
    },
    arr: [
        {
            arrField: 'arrValue1',
            objNestedInArr: {nestedField: 'nestedValue1'}
        },
        {
            arrField: 'arrValue2',
            objNestedInArr: {nestedField: 'nestedValue2'}
        }
    ],
};

export const MyForm = () => {
    const [loading, setLoading] = useState();

    // do something with form data
    const handleSubmit = (data: MyFormValues) => {
        console.log(data);
        // send to server and disable form until response is received
        setLoading(true);
    };

    return (
        <Form<MyFormValues>
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            schema={schema}
            disabled={loading}
        >
            <FormInput name='fieldWithoutNesting' component={Input}/>
            <FormObject name='obj'>
                <FormInput name='someField' component={Input}/>
            </FormObject>
            <FormArray name='arr' initialValue={{arrField: 'Default value for new entries'}} setInitialValueOnMount>
                <FormArrayControls>
                    {() => (
                        <>
                            <FormInput name='arrField' component={Input}/>
                            <FormObject name='objNestedInArr'>
                                <FormInput name='nestedField' component={Input}/>
                            </FormObject>
                        </>
                    )}
                </FormArrayControls>
            </FormArray>
        </Form>
    );
};
```

## Components

FYI: Docs for components were generated with LLM because I'm in rush (and lazy). If something doesn't make sense, please refer to the source code and/or create an issue.

## Form
The `Form` component is used to create a form context using `react-hook-form` and `yup` for validation. It provides a structured way to handle form submission, validation, and error handling.

### Props
| Name          | Type                                                                 | Default                | Required | Description                                                                 |
|---------------|----------------------------------------------------------------------|------------------------|----------|-----------------------------------------------------------------------------|
| `error`       | `string \| ReactNode`                                                | N/A                    | No       | Error message or component to display.                                      |
| `onSubmit`    | `(data: T, event: SyntheticEvent<SubmitEvent, Event> \| undefined) => void \| Promise<void>` | N/A                    | Yes      | Function to handle form submission.                                         |
| `onCancel`    | `() => void`                                                         | N/A                    | No       | Function to handle form cancellation.                                       |
| `onError`     | `() => void`                                                         | N/A                    | No       | Function to handle form errors.                                             |
| `defaultValues`| `DefaultValues<T>`                                                  | N/A                    | No       | Default values for the form fields.                                         |
| `schema`      | `AnyObjectSchema`                                                    | N/A                    | Yes      | Validation schema using `yup`.                                              |
| `disabled`    | `boolean`                                                            | N/A                    | No       | Whether the form is disabled.                                               |
| `submitButton`| `SubmitButtonFC`                                                     | `DefaultSubmitButton`  | No       | Custom submit button component.                                             |
| `options`     | `UseFormProps<T>`                                                    | `{}`                   | No       | Additional options for `useForm`.                                           |

### Usage
The `Form` component is used to create a form context using `react-hook-form` and `yup` for validation. It provides a structured way to handle form submission, validation, and error handling.

```tsx
import React, { SyntheticEvent } from 'react';
import { Form } from '@dawiidio/form';
import { FormInput } from '@dawiidio/form';
import Input from './Input';
import * as yup from 'yup';

export interface MyFormValues {
    firstName: string;
    lastName: string;
}

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
});

const defaultValues = {
    firstName: 'John',
    lastName: 'Doe',
};

export const MyForm = () => {
    const handleSubmit = (data: MyFormValues, event: SyntheticEvent<SubmitEvent, Event> | undefined) => {
        console.log(data);
    };

    return (
        <Form<MyFormValues>
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            schema={schema}
        >
            <FormInput name="firstName" component={Input} />
            <FormInput name="lastName" component={Input} />
        </Form>
    );
};
```

## FormObject
The `FormObject` component is used to create a nested form context within a form. It allows you to group form fields under a specific context, making it easier to manage and validate nested form structures.

### Props
| Name       | Type                                      | Default                     | Required | Description                                                                 |
|------------|-------------------------------------------|-----------------------------|----------|-----------------------------------------------------------------------------|
| `name`     | `string`                                  | N/A                         | Yes      | The name of the form object. This name will be used to create a nested context for the form fields within this object. |
| `children` | `React.ReactNode`                         | N/A                         | Yes      | The form fields or other components that will be nested within this form object. |
| `container`| `FormObjectContainer`                     | `DefaultFormObjectContainer`| No       | A custom container component to wrap the children. If not provided, the default container will be used. |

### Usage
The `FormObject` component is used to create a nested form context within a form. It allows you to group form fields under a specific context, making it easier to manage and validate nested form structures.

```tsx
import React from 'react';
import { FormObject } from '@dawiidio/form';
import { FormInput } from '@dawiidio/form';
import Input from './Input';

const MyForm = () => {
    return (
        <Form>
            <FormObject name="user">
                <FormInput name="firstName" component={Input} />
                <FormInput name="lastName" component={Input} />
            </FormObject>
        </Form>
    );
};
```

## FormArray
The `FormArray` component is a wrapper for an array of fields. It provides context for nested fields and should not be used as a standalone component. It is designed to be used as a foundation for creating custom `FormArrayControls` components that contain a set of fields and buttons to add/remove/replace/update new entries.

### Props
| Name                   | Type                | Default | Required | Description                                                                 |
|------------------------|---------------------|---------|----------|-----------------------------------------------------------------------------|
| `name`                 | `string`            | N/A     | Yes      | The name of the form array field.                                           |
| `minLength`            | `number`            | N/A     | No       | Minimum number of items in the array.                                       |
| `maxLength`            | `number`            | N/A     | No       | Maximum number of items in the array.                                       |
| `required`             | `boolean`           | N/A     | No       | Whether the field is required.                                              |
| `validate`             | `Validate<any, any>`| N/A     | No       | Validation function.                                                        |
| `initialValue`         | `any`               | N/A     | No       | Initial value for new entries in the `FormArray`, not the existing ones.    |
| `setInitialValueOnMount`| `boolean`          | N/A     | No       | Whether to set initial value on mount. If true, the form will be rendered with one empty entry taken from the `initialValue` prop. |

### Usage
The `FormArray` component is used to manage an array of form fields within a form. It provides context for nested fields and should be used as a foundation for creating custom `FormArrayControls` components.

```tsx
import React from 'react';
import { Form, FormArray, FormArrayControls, FormInput } from '@dawiidio/form';
import Input from './Input';
import * as yup from 'yup';

export interface MyFormValues {
    items: Array<{
        myField: string;
    }>;
}

const schema = yup.object({
    items: yup.array().of(
        yup.object({
            myField: yup.string().required(),
        })
    ),
});

const defaultValues = {
    items: [
        { myField: 'defaultValue1' },
        { myField: 'defaultValue2' },
    ],
};

export const MyForm = () => {
    const handleSubmit = (data: MyFormValues) => {
        console.log(data);
    };

    return (
        <Form<MyFormValues>
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            schema={schema}
        >
            <FormArray name="items" initialValue={{ myField: 'Default value for new entry' }} setInitialValueOnMount>
                <FormArrayControls>
                    {() => (
                        <FormInput name="myField" component={Input} />
                    )}
                </FormArrayControls>
            </FormArray>
        </Form>
    );
};
```

## FormArrayControls
The `FormArrayControls` component is used to manage an array of form fields within a form. It provides context for nested fields and should be used as a foundation for creating custom `FormArrayControls` components.

### Props
| Name            | Type                                                                 | Default                              | Required | Description                                                                 |
|-----------------|----------------------------------------------------------------------|--------------------------------------|----------|-----------------------------------------------------------------------------|
| `children`      | `(controls: Omit<UseFieldArrayReturn, 'fields'>) => ReactNode`       | N/A                                  | Yes      | Form fields wrapped into `FormInput`, or your raw input components ported with `useFormInputController` hook. |
| `entryContainer`| `FC<PropsWithChildren>`                                              | `DefaultEntryContainer`              | No       | Container that wraps collection of items (fields), includes also action buttons if `actionsVisible` is true. |
| `fieldsContainer`| `FC<ContainerWithDeleteButtonInfo>`                                 | `DefaultFieldsContainer`             | No       | Container that wraps only fields passed as children.                       |
| `renderActions` | `(props: UseFieldArrayReturn & { removeEntry: () => void }) => ReactNode` | `DefaultRenderActions`               | No       | Render function for action buttons.                                         |
| `container`     | `FormArrayControlsContainer`                                         | `DefaultFormArrayControlsContainer`  | No       | Root container that wraps all the `FormArrayControls` component.            |
| `actionsVisible`| `boolean`                                                            | `true`                               | No       | If true, action buttons will be rendered.                                   |
| `addButton`     | `FormArrayControlsAddButton`                                         | `DefaultFormArrayControlsAddButton`  | No       | Add button component.                                                       |

### Usage
The `FormArrayControls` component is used to manage an array of form fields within a form. It provides context for nested fields and should be used as a foundation for creating custom `FormArrayControls` components.

```tsx
import React from 'react';
import { Form, FormArray, FormArrayControls, FormInput } from '@dawiidio/form';
import Input from './Input';
import * as yup from 'yup';

export interface MyFormValues {
    items: Array<{
        myField: string;
    }>;
}

const schema = yup.object({
    items: yup.array().of(
        yup.object({
            myField: yup.string().required(),
        })
    ),
});

const defaultValues = {
    items: [
        { myField: 'defaultValue1' },
        { myField: 'defaultValue2' },
    ],
};

export const MyForm = () => {
    const handleSubmit = (data: MyFormValues) => {
        console.log(data);
    };

    return (
        <Form<MyFormValues>
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            schema={schema}
        >
            <FormArray name="items" initialValue={{ myField: 'Default value for new entry' }} setInitialValueOnMount>
                <FormArrayControls>
                    {() => (
                        <FormInput name="myField" component={Input} />
                    )}
                </FormArrayControls>
            </FormArray>
        </Form>
    );
};
```

## FormInput
The `FormInput` component is used to create a form input field within a form. It integrates with `react-hook-form` to manage form state and validation.

### Props
| Name          | Type                                                                 | Default | Required | Description                                                                 |
|---------------|----------------------------------------------------------------------|---------|----------|-----------------------------------------------------------------------------|
| `name`        | `string`                                                             | N/A     | Yes      | The name of the form input field.                                           |
| `label`       | `string`                                                             | N/A     | No       | The label for the form input field.                                          |
| `component`   | `FC<CommonFormInputProps<T>> \| ForwardRefExoticComponent<CommonFormInputProps<T>>` | N/A     | Yes      | The input component to be rendered.                                         |
| `defaultValue`| `T`                                                                  | N/A     | No       | The default value for the form input field.                                 |
| `value`       | `T`                                                                  | N/A     | No       | The value of the form input field.                                          |
| `disabled`    | `boolean`                                                            | N/A     | No       | Whether the form input field is disabled.                                   |
| `error`       | `string`                                                             | N/A     | No       | The error message for the form input field.                                 |

### Usage
The `FormInput` component is used to create a form input field within a form. It integrates with `react-hook-form` to manage form state and validation.

Below I'm showing how to use it with a custom input component, this is real implementation I use in one of my projects.

```tsx
import React, {forwardRef, useId} from "react";
import styles from './Input.module.css';
import classNames from "classnames";
import {CommonFormInputProps} from "@dawiidio/form";

export interface InputProps extends CommonFormInputProps<string> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, disabled, ...rest }, ref) => {
    const id = useId();

    return (
        <div className={classNames({
            [styles.container]: true,
            [styles.inputError]: Boolean(error),
        })}>
            <label htmlFor={id} className={classNames('body2', styles.label)}>{label}</label>
            <input id={id} className={classNames(styles.root)} {...rest} ref={ref}/>
            {error && <div className={classNames('caption1', styles.error)}>{error}</div>}
        </div>
    );
});
```

```tsx
import React from 'react';
import { Form, FormInput } from '@dawiidio/form';
import Input from './Input';
import * as yup from 'yup';

export interface MyFormValues {
    firstName: string;
    lastName: string;
}

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
});

const defaultValues = {
    firstName: 'John',
    lastName: 'Doe',
};

export const MyForm = () => {
    const handleSubmit = (data: MyFormValues) => {
        console.log(data);
    };

    return (
        <Form<MyFormValues>
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            schema={schema}
        >
            <FormInput name="firstName" component={Input} />
            <FormInput name="lastName" component={Input} />
        </Form>
    );
};
```

## useFormInputController
The `useFormInputController` hook is used to create a form input controller within a nested form context. It integrates with `react-hook-form` to manage form state and validation, and it supports nested form structures by using the `FormObjectContext`.

### Props
| Name   | Type                                      | Default | Required | Description                                                                 |
|--------|-------------------------------------------|---------|----------|-----------------------------------------------------------------------------|
| `name` | `FieldPath<TFieldValues>`                 | N/A     | Yes      | The name of the form input field.                                           |
| `control` | `Control<TFieldValues>`                | N/A     | Yes      | The control object from `react-hook-form`.                                  |
| `rules` | `RegisterOptions<TFieldValues, TName>`   | N/A     | No       | Validation rules for the form input field.                                  |
| `defaultValue` | `TFieldValues[TName]`             | N/A     | No       | The default value for the form input field.                                 |

### Usage
The `useFormInputController` hook is used to create a form input controller within a nested form context. It integrates with `react-hook-form` to manage form state and validation, and it supports nested form structures by using the `FormObjectContext`.
It is useful for porting custom (fancy) inputs to the form.


```tsx
import React from 'react';
import {useForm, FormProvider, useFormContext} from 'react-hook-form';
import {FormObjectContext} from '@dawiidio/form';
import {useFormInputController, Form} from '@dawiidio/form';
import SomeFancyComponent from './SomeFancyComponent';

const SomeFancyComponentAsInput = ({name}) => {
    const {
        control
    } = useFormContext();
    const {field, fieldState} = useFormInputController({name, control});
    
    return <SomeFancyComponent
        // on change like that, because react-hooks-form operates on events and takes value from them    
        onChange={(value) => ({target: {value}})} 
        value={field.value}
        error={fieldState.error}
        // ... other props
    />;
};

const MyForm = () => {
    return (
        <Form>
            <SomeFancyComponentAsInput name='field'/>
        </Form>
    );
};

export default MyForm;
```