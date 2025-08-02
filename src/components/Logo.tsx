
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
        <div className="h-4 w-4 rounded-sm bg-primary-foreground"></div>
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Ungu BookFlow
      </span>
    </Link>
  );
};

export default Logo;
