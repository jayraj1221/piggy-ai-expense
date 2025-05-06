export const Input = ({
  id,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  className = "",
  value,
  onChange,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-secondary focus:border-secondary ${className}`}
    />
  );
};
