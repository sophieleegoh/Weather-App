export type DisplayTextProps = {
  text: string;
};

function DisplayText({ text }: DisplayTextProps) {
  return <p className="py-10">{text}</p>;
}

export default DisplayText;
