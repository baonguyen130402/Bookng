import { useState } from "react";

export function useForm(initialValue) {
  const [formValues, setFormValues] = useState(initialValue);

  return [
    formValues,
    (event) =>
      setFormValues({
        ...formValues,
        [event.currentTarget.name]: event.currentTarget.value,
      }),
  ];
}
