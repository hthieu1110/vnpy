type CenteredTextProps = {
  text: string;
};

export const CenteredText = ({ text }: CenteredTextProps) => {
  return (
    <div className="text-lg text-gray-500 h-100 flex items-center justify-center">
      {text}
    </div>
  );
};
