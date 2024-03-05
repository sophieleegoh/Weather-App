import { Dispatch, SetStateAction } from "react";

export type InputFieldProps = {
  placeholder: string;
  inputText: string;
  onUpdate: Dispatch<SetStateAction<string>>;
};

function InputField({ placeholder, inputText, onUpdate }: InputFieldProps) {
  return (
    <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder={placeholder}
        value={inputText}
        onChange={(e) => onUpdate(e.target.value)}
      />
  );
}

export default InputField;
