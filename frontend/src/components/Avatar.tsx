import React from 'react';

interface AvatarProps {
  name: string | null | undefined;
  size?: number;
}

export function Avatar({ name, size = 24 }: Readonly<AvatarProps>) {
  const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';

  return (
    <div 
      className="rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold"
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size / 2}px` }}
    >
      {initial}
    </div>
  );
}

interface AvatarGroupProps {
  users: { name: string | null | undefined }[];
  max?: number;
}

export function AvatarGroup({ users, max = 3 }: Readonly<AvatarGroupProps>) {
  const visibleUsers = users.filter(user => user?.name).slice(0, max);
  const remainingCount = Math.max(users.length - max, 0);

  return (
    <div className="flex justify-end -space-x-2 overflow-hidden">
      {visibleUsers.map((user, index) => (
        <Avatar key={index} name={user.name} size={24} />
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-xs text-white">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default Avatar;