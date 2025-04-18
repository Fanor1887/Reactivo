// js/hooks/useForm.js
import useState from './useState.js';

const useForm = (initialValues, validate, onSubmit) => {
  const [getValues, setValues, subscribe] = useState(
    'formValues',
    initialValues
  );
  const [getErrors, setErrors, subscribeErrors] = useState('formErrors', {});

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValues = { ...getValues(), [name]: value };
    setValues(newValues);
    validateForm(newValues); // Validar el formulario después de cada cambio
  };

  const validateForm = (values) => {
    const errors = validate(values);
    setErrors(errors); // Actualizar los errores
    return Object.keys(errors).length === 0; // Retorna true si no hay errores
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm(getValues())) {
      onSubmit(getValues());
    } else {
      console.log('El formulario tiene errores');
    }
  };

  return {
    values: getValues(),
    errors: getErrors(),
    handleChange,
    handleSubmit,
    subscribe,
    subscribeErrors,
  };
};

export default useForm;
