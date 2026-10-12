import React from 'react';
import { DirectProjectIntake, DirectProjectIntakeProps } from './DirectProjectIntake';

export const ContactSection: React.FC<DirectProjectIntakeProps> = (props) => {
  return <DirectProjectIntake {...props} />;
};

export default ContactSection;
