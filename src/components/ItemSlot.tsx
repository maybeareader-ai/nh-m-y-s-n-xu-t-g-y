import React, { useState } from 'react';
import { CraftItem } from '../types';
import { MinecraftTooltip } from './MinecraftTooltip';
import { playItemClick } from '../utils/audio';
import { Edit2, Trash2 } from 'lucide-react';

interface ItemSlotProps {
  id?: string;
  item?: CraftItem | null;
  size?: 'sm' | 'md' | 'lg' | 'craft_out';
  isSelected?: boolean;
  isEmptySlot?: boolean;
  emptyLabel?: string;
  emptyIcon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
  onDropItem?: (item: CraftItem) => void;
  onEdit?: (item: CraftItem) => void;
  onDelete?: (item: CraftItem) => void;
  draggable?: boolean;
  showActionsOnHover?: boolean;
  allowEmptyDrop?: boolean;
}

export const ItemSlot: React.FC<ItemSlotProps> = ({
  id,
  item,
  size = 'md',
  isSelected = false,
  isEmptySlot = false,
  emptyLabel,
  emptyIcon,
  badge,
  onClick,
  onDropItem,
  onEdit,
  onDelete,
  draggable = true,
  showActionsOnHover = false,
  allowEmptyDrop = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16 sm:w-[72px] sm:h-[72px]',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    craft_out: 'w-20 h-20 sm:w-24 sm:h-24',
  }[size];

  const imgSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    craft_out: 'w-14 h-14 sm:w-16 sm:h-16',
  }[size];

  const handleDragStart = (e: React.DragEvent) => {
    if (!item) return;
    playItemClick();
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!allowEmptyDrop && !onDropItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!onDropItem) return;
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const droppedItem: CraftItem = JSON.parse(dataStr);
        onDropItem(droppedItem);
      }
    } catch (err) {
      console.error('Error handling drop:', err);
    }
  };

  const handleClick = () => {
    if (onClick) {
      playItemClick();
      onClick();
    }
  };

  return (
    <div
      id={id}
      className="relative inline-block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`mc-slot ${sizeClasses} flex items-center justify-center cursor-pointer select-none relative transition-transform active:scale-95 ${
          isSelected ? 'ring-2 ring-yellow-400 bg-[#a0a0a0]' : ''
        } ${isDragOver ? 'ring-2 ring-emerald-400 bg-[#8cb67a]' : ''} ${
          size === 'craft_out' && item ? 'shadow-[0_0_15px_rgba(234,179,8,0.5)]' : ''
        }`}
        draggable={draggable && !!item}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {item ? (
          <div className="relative flex items-center justify-center w-full h-full p-1.5">
            <img
              src={item.image}
              alt={item.name}
              className={`${imgSizes} object-contain pixelated pointer-events-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]`}
              referrerPolicy="no-referrer"
            />
            {badge && (
              <span className="absolute bottom-0.5 right-1 font-pixel text-lg font-bold text-white drop-shadow-[0_2px_0_#000]">
                {badge}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-1 text-[#555555]">
            {emptyIcon}
            {emptyLabel && (
              <span className="font-pixel text-xs leading-none text-[#555555]">
                {emptyLabel}
              </span>
            )}
          </div>
        )}

        {/* Hover quick action buttons for editing / deleting when in tray */}
        {showActionsOnHover && item && isHovered && (
          <div
            className="absolute top-0 right-0 z-20 flex gap-0.5 p-0.5 bg-black/80 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                id={`edit-${item.id}`}
                type="button"
                title="Chỉnh sửa vật phẩm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-1 hover:bg-blue-600 text-white rounded text-xs transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                id={`delete-${item.id}`}
                type="button"
                title="Xoá vật phẩm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="p-1 hover:bg-red-600 text-white rounded text-xs transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Minecraft Tooltip on hover */}
      {isHovered && item && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
          <MinecraftTooltip item={item} />
        </div>
      )}
    </div>
  );
};
