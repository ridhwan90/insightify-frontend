import React from 'react';
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa';

interface CheckboxImageProps {
  checked: boolean;
}

const CheckboxImage: React.FC<CheckboxImageProps> = ({ checked }) => {
  return (
    checked ? <FaCheckSquare className="w-8 h-8" /> : <FaRegSquare className="w-8 h-8" />
  );
};

export default CheckboxImage;
