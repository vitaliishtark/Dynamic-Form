import React, { useEffect, useState } from 'react';
import Form from './DynamicForm/DynamicForm';
import data from './data.json';
import './App.css'
import { FormField } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormField[] | any>([]);
  const [resultOfDynamicForm, setResultOfDynamicForm] = useState<FormField[]>([])

  useEffect(() => {
    setFormData(data);
  }, []);

  return (
    <div>
      <h1>Dynamic Form</h1>
      {formData.length > 0 && <Form formData={formData} setResultOfDynamicForm={setResultOfDynamicForm} resultOfDynamicForm={resultOfDynamicForm} />}
      <h2>Results</h2>
      {resultOfDynamicForm.map((it, index) => (
        <div key={index} className="entry-container">
          <h3>Result {index + 1}</h3>
          <hr />
          <code>
            {JSON.stringify(it)}
          </code>
        </div>
      ))}
    </div>
  );
};

export default App;
