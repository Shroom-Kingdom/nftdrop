import React, { AnchorHTMLAttributes } from "react";

const ExternalLink: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  ...props
}) => (
  <a target="_blank" rel="noopener" {...props}>
    {children}
  </a>
);

export default ExternalLink;
