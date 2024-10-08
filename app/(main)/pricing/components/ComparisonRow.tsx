interface ComparisonRowProps {
  name: string;
  col1?: boolean;
  col2?: boolean;
  col3?: boolean;
  col1Text?: string;
  col2Text?: string;
  col3Text?: string;
  isGreen?: boolean;
}

export default function ComparisonRow({
  name,
  col1 = false,
  col2 = false,
  col3 = false,
  isGreen = false,
  col1Text,
  col2Text,
  col3Text,
}: ComparisonRowProps) {
  return (
    <div
      className=" w-[100%] h-[10%] flex-row flex "
      style={{
        backgroundColor: isGreen ? "rgba(115, 208, 141, .2)" : "",
      }}
    >
      <div className="justify-center py-4 w-1/4 pl-8">
        <span className="">{name}</span>
      </div>
      <div className="justify-center w-1/4 items-center flex align-middle">
        {col1 && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
              fill="#73D08D"
            />
            <path
              d="M15.7724 6.83337L10.0683 14.5742C9.93221 14.7547 9.72936 14.873 9.50527 14.9024C9.28118 14.9319 9.05465 14.8701 8.87659 14.7309L4.80325 11.4742C4.44381 11.1866 4.3856 10.662 4.67325 10.3025C4.9609 9.94309 5.48547 9.88489 5.84492 10.1725L9.24159 12.89L14.4308 5.84754C14.6009 5.5922 14.8976 5.45103 15.2031 5.48007C15.5086 5.50912 15.7734 5.70368 15.8923 5.98652C16.0113 6.26935 15.9653 6.59469 15.7724 6.83337Z"
              fill="#0D0F0E"
            />
          </svg>
        )}
        {col1Text && (
          <p className="text-center font-bold justify-center w-full my-auto">
            {col1Text}
          </p>
        )}
      </div>
      <div className="justify-center w-1/4 items-center flex align-middle">
        {col2 && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
              fill="#73D08D"
            />
            <path
              d="M15.7724 6.83337L10.0683 14.5742C9.93221 14.7547 9.72936 14.873 9.50527 14.9024C9.28118 14.9319 9.05465 14.8701 8.87659 14.7309L4.80325 11.4742C4.44381 11.1866 4.3856 10.662 4.67325 10.3025C4.9609 9.94309 5.48547 9.88489 5.84492 10.1725L9.24159 12.89L14.4308 5.84754C14.6009 5.5922 14.8976 5.45103 15.2031 5.48007C15.5086 5.50912 15.7734 5.70368 15.8923 5.98652C16.0113 6.26935 15.9653 6.59469 15.7724 6.83337Z"
              fill="#0D0F0E"
            />
          </svg>
        )}
        {col2Text && (
          <p className="text-center font-bold justify-center w-full my-auto">
            {col2Text}
          </p>
        )}
      </div>
      <div className="justify-center w-1/4 items-center flex align-middle">
        {col3 && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C19.9936 4.47982 15.5202 0.00642897 10 0Z"
              fill="#73D08D"
            />
            <path
              d="M15.7724 6.83337L10.0683 14.5742C9.93221 14.7547 9.72936 14.873 9.50527 14.9024C9.28118 14.9319 9.05465 14.8701 8.87659 14.7309L4.80325 11.4742C4.44381 11.1866 4.3856 10.662 4.67325 10.3025C4.9609 9.94309 5.48547 9.88489 5.84492 10.1725L9.24159 12.89L14.4308 5.84754C14.6009 5.5922 14.8976 5.45103 15.2031 5.48007C15.5086 5.50912 15.7734 5.70368 15.8923 5.98652C16.0113 6.26935 15.9653 6.59469 15.7724 6.83337Z"
              fill="#0D0F0E"
            />
          </svg>
        )}
        {col3Text && (
          <p className="text-center font-bold justify-center w-full my-auto">
            {col3Text}
          </p>
        )}
      </div>
    </div>
  );
}
