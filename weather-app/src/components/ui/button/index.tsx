export type ButtonProps = {
  buttonLabel: string;
  onUpdate: () => void;
}

function Button({ buttonLabel, onUpdate }: ButtonProps) {
  return (
    <button onClick={onUpdate} >
      {buttonLabel}
    </button>
  )
}

export default Button