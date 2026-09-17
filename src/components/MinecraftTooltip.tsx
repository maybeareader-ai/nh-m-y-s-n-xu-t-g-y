import React from 'react';
import { CraftItem } from '../types';

interface MinecraftTooltipProps {
  item: CraftItem | {
    name: string;
    description: string;
    tray?: string;
  };
}

export const MinecraftTooltip: React.FC<MinecraftTooltipProps> = ({ item }) => {
  return (
    <div className="mc-tooltip p-3 min-w-[180px] max-w-[280px] rounded-none text-left select-none pointer-events-none">
      <div className="text-xl font-bold tracking-wide text-white leading-tight drop-shadow">
        {item.name}
      </div>

      {item.tray && (
        <div className="text-xs text-gray-400 mt-0.5 border-b border-purple-900/60 pb-1 mb-1.5">
          <span className="text-gray-300 bg-purple-950/80 px-1.5 py-0.5 border border-purple-800/50">
            {item.tray === 'tray1' ? 'Khay 1' : 'Khay 2'}
          </span>
        </div>
      )}

      {item.description ? (
        <div className="text-base text-gray-200 leading-snug break-words mt-1">
          {item.description}
        </div>
      ) : null}

      <div className="mt-2 text-xs text-emerald-400/90 pt-1 border-t border-purple-950 flex items-center gap-1">
        <span>✦</span> Kéo thả hoặc click để đặt vào bàn chế tạo
      </div>
    </div>
  );
};
