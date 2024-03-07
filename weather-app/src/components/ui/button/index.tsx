export type ButtonProps = {
  buttonLabel: string;
  onUpdate: () => void;
};

function Button({ buttonLabel, onUpdate }: ButtonProps) {
  return (
    <div className="py-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={onUpdate}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default Button;
