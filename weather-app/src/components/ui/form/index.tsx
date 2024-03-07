import { FormProvider, useForm } from "react-hook-form";

export type FormProps = {
  children?: React.ReactNode;
};

function Form({ children }: FormProps) {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
      </form>
    </FormProvider>
  );
}

export default Form;
