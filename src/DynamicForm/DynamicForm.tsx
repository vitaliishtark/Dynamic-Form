import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormField } from '../types/index';

interface FormProps {
    formData: FormField[];
    setResultOfDynamicForm: (values: FormField[]) => void;
    resultOfDynamicForm: FormField[];
}

const Form: React.FC<FormProps> = ({ formData, setResultOfDynamicForm, resultOfDynamicForm }) => {
    const validationSchema = Yup.object().shape(
        formData.reduce((acc, field) => {
            if (field.validation) {
                acc[field.type] = Yup.string().matches(new RegExp(field.validation), 'Invalid value');
            }
            if (field.type === 'number') {
                acc[field.type] = Yup.number()
                    .min(field.min_value!, `Min ${field.min_value}`)
                    .max(field.max_value!, `Max ${field.max_value}`)
                    .required('Required');
            }
            return acc;
        }, {} as any)
    );

    const formik = useFormik({
        initialValues: formData.reduce((acc, field) => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                acc[field.type] = [];
            } else {
                acc[field.type] = field.default_value || '';
            }
            return acc;
        }, {} as Record<string, any>),
        validationSchema,
        onSubmit: (values: any) => {
            setResultOfDynamicForm([...resultOfDynamicForm, values]);
        }
    });

    const forMicErrors: any = formik.errors;

    return (
        <form onSubmit={formik.handleSubmit}>
            {formData.map((field, index) => (
                <div key={index}>
                    <label>
                        {field.label || field.type.charAt(0).toUpperCase() + field.type.slice(1)}:
                        {field.type === 'text' || field.type === 'textarea' ? (
                            <input
                                type="text"
                                name={field.type}
                                onChange={formik.handleChange}
                                value={formik.values[field.type]}
                                placeholder={field.placeholder || ''}
                            />
                        ) : field.type === 'number' ? (
                            <input
                                type="number"
                                name={field.type}
                                onChange={formik.handleChange}
                                value={formik.values[field.type]}
                                min={field.min_value}
                                max={field.max_value}
                                step={field.step || 1}
                            />
                        ) : field.type === 'dropdown' ? (
                            <select
                                name={field.type}
                                onChange={formik.handleChange}
                                value={formik.values[field.type]}
                            >
                                {field.options?.map((option, idx) => (
                                    <option key={idx} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'checkbox' ? (
                            <div>
                                {field.options?.map((option, idx) => (
                                    <label key={idx}>
                                        <input
                                            type="checkbox"
                                            name={field.type}
                                            value={option}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                const currentValues = formik.values[field.type] || [];
                                                if (e.target.checked) {
                                                    formik.setFieldValue(field.type, [...currentValues, value]);
                                                } else {
                                                    formik.setFieldValue(
                                                        field.type,
                                                        currentValues.filter((val: string) => val !== value)
                                                    );
                                                }
                                            }}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        ) : field.type === 'radio' ? (
                            <div>
                                {field.options?.map((option, idx) => (
                                    <label key={idx}>
                                        <input
                                            type="radio"
                                            name={field.type}
                                            value={option}
                                            checked={formik.values[field.type] === option}
                                            onChange={formik.handleChange}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        ) : field.type === 'date' ? (
                            <input
                                type="date"
                                name={field.type}
                                onChange={formik.handleChange}
                                value={formik.values[field.type]}
                                placeholder={field.placeholder || ''}
                            />
                        ) : null}
                    </label>
                    {formik.errors[field.type] && (
                        <div className="error-container">
                            <div className="error-message">
                                {forMicErrors[field.type]}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;
