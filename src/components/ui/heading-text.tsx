const HeadingText = ({
  headingStyles,
  paragraphStyles,
  heading,
  paragraph,
  boxStyles
}: {
  headingStyles?: string;
  paragraphStyles?: string;
  paragraph: string;
  heading: string;
  boxStyles?: string;
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center ${boxStyles}`}
    >
      <h1
        className={` ${headingStyles} mb-2 text-center text-2xl leading-[52px] font-bold text-white lg:text-4xl`}
      >
        {heading}
      </h1>
      <p
        className={`${paragraphStyles} font-manrope mt-3 px-10 text-center text-sm text-[#ffffff99] lg:px-80`}
      >
        {paragraph}
      </p>
    </div>
  );
};

export default HeadingText;
