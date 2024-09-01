import { createContext } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';

export type FormArrayContextValue = UseFieldArrayReturn & {
    name: string;
    initialValue: any;
};

// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
const NOOP = () => {};

export const FormArrayContext = createContext<FormArrayContextValue>({
    append: NOOP,
    move: NOOP,
    insert: NOOP,
    remove: NOOP,
    prepend: NOOP,
    swap: NOOP,
    update: NOOP,
    replace: NOOP,
    name: '',
    fields: [],
    initialValue: {},
});