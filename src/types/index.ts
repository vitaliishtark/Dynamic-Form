export type FormField = {
    label: string;
    step: number;
    placeholder: string;
    default_value?: string | number | boolean;
    value?: string | number | boolean;
    validation?: string;
    min_value?: number;
    max_value?: number;
    options?: (string | number)[];
    type: 'text' | 'longtext' | 'dropdown' | 'number' | 'radio' | 'checkbox' | 'textarea' | 'date';
};
