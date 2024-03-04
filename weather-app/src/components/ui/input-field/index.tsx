import { Dispatch, SetStateAction } from "react";

export type InputFieldProps = {
  placeholder: string;
  inputText: string;
  onUpdate: Dispatch<SetStateAction<string>>
}

function InputField({ placeholder, inputText, onUpdate }: InputFieldProps) {
  return (
    <input type="text" placeholder={placeholder} value={inputText} onChange={e => onUpdate(e.target.value)}/>
  )
}

export default InputField