export default function ArrowPointingDown({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      onClick={onClick}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="32pt"
      height="32pt"
      version="1.1"
      viewBox="0 0 1200 1200"
    >
      <path
        d="m598.35 267.25c-3.7539 0.41406-7.2227 2.2188-9.7148 5.0586-2.4883 2.8438-3.8281 6.5156-3.7461 10.293v601.03l-178.77-158.93c-3.0039-2.7891-7.0078-4.2383-11.098-4.0156-4.0273 0.20703-7.8086 2.0117-10.496 5.0156-2.6914 3.0039-4.0664 6.9609-3.8242 10.984 0.23828 4.0273 2.0781 7.7891 5.1094 10.449l204.04 181.37c2.7812 2.5234 6.3984 3.9219 10.152 3.9219 3.7578 0 7.375-1.3984 10.156-3.9219l204.04-181.37c3.9805-3.6328 5.7266-9.1133 4.5859-14.379-1.1445-5.2695-5.0039-9.5312-10.133-11.191-5.125-1.6602-10.75-0.46484-14.762 3.1367l-178.77 158.93v-601.03c0.09375-4.3516-1.6953-8.5352-4.9062-11.477-3.2109-2.9375-7.5352-4.3516-11.863-3.875z"
        fill="#fff"
      />
    </svg>
  );
}