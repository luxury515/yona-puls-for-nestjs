import React from 'react';

interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

function Avatar({ name, imageUrl, size, ...props }: Readonly<AvatarProps>) {
  const initials = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div {...props}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className={`avatar-${size}`} />
      ) : (
        initials
      )}
    </div>
  );
}

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