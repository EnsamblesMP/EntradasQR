import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none';

const variantStyles = {
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-transparent shadow-sm',
  secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-transparent shadow-sm',
  danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border border-transparent shadow-sm',
  outline: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  to,
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  fullWidth = false,
  ...props
}) {
  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};
