import React from 'react';

interface IssueLabelProps {
  name: string;
  color: string;
}

const IssueLabel: React.FC<IssueLabelProps> = ({ name, color }) => {
  // color가 유효한 hex 색상 코드인지 확인 (3자리 또는 6자리 허용)
  const isValidColor = /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
  const backgroundColor = isValidColor ? color : '#CCCCCC'; // 기본 색상

  return (
    <span
      className="inline-block px-2 py-1 text-xs font-semibold rounded-full mr-2 mb-2"
      style={{
        backgroundColor: backgroundColor,
        color: getContrastColor(backgroundColor),
      }}
    >
      {name}
    </span>
  );
};

// 배경색에 따라 텍스트 색상을 자동으로 조정하는 함수
function getContrastColor(hexColor: string): string {
  // hexColor에서 '#' 제거
  const hex = hexColor.replace('#', '');

  // 3자리 hex 코드를 6자리로 변환
  const fullHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('')
    : hex;

  // Convert hex to RGB
  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white depending on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default IssueLabel;