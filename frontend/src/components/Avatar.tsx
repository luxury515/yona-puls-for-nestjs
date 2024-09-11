import React from 'react';

interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white bg-gray-300 overflow-hidden`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
};

interface AvatarGroupProps {
  users: Array<{
    name: string;
    imageUrl?: string;
  }>;
  max?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 5 }) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className="flex -space-x-2 justify-end">
      {visibleUsers.map((user, index) => (
        <Avatar key={index} name={user.name} imageUrl={user.imageUrl} size="sm" />
      ))}
      {remainingCount > 0 && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-gray-400">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;