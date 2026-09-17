import React from 'react';
import { CraftItem, CraftedRecipe } from '../types';
import { ItemSlot } from './ItemSlot';
import { playCraftSuccess, playItemDrop } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, Plus, RotateCcw, BookOpen } from 'lucide-react';

interface CraftingTableProps {
  slotA: CraftItem | null;
  slotB: CraftItem | null;
  isAdmin: boolean;
  onSetSlotA: (item: CraftItem | null) => void;
  onSetSlotB: (item: CraftItem | null) => void;
  recipes: CraftedRecipe[];
  onOpenRecipeDoc: (recipe: CraftedRecipe) => void;
  onCreateRecipeForItems: (itemA: CraftItem, itemB: CraftItem) => void;
  onClearTable: () => void;
}

export const CraftingTable: React.FC<CraftingTableProps> = ({
  slotA,
  slotB,
  isAdmin,
  onSetSlotA,
  onSetSlotB,
  recipes,
  onOpenRecipeDoc,
  onCreateRecipeForItems,
  onClearTable,
}) => {
  // Check if matching recipe exists
  const matchedRecipe = React.useMemo(() => {
    if (!slotA || !slotB) return null;
    return recipes.find(
      (r) =>
        (r.itemAId === slotA.id && r.itemBId === slotB.id) ||
        (r.itemAId === slotB.id && r.itemBId === slotA.id)
    );
  }, [slotA, slotB, recipes]);

  // Handle result click
  const handleResultClick = () => {
    if (matchedRecipe) {
      playCraftSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#a855f7', '#fbbf24', '#4ade80'],
        });
      } catch {
        // ignore
      }
      onOpenRecipeDoc(matchedRecipe);
    } else if (slotA && slotB) {
      onCreateRecipeForItems(slotA, slotB);
    }
  };

  const handleDropSlotA = (item: CraftItem) => {
    playItemDrop();
    onSetSlotA(item);
  };

  const handleDropSlotB = (item: CraftItem) => {
    playItemDrop();
    onSetSlotB(item);
  };

  return (
    <div className="mc-window p-4 sm:p-6 w-full max-w-2xl mx-auto shadow-2xl relative">
      {/* Table Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#555] pb-2 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#7a5839] border border-[#3d2919] shadow-inner" />
          <h2 className="font-pixel text-2xl sm:text-3xl font-bold tracking-wider text-[#222222] uppercase">
            Nhà máy sản xuất gây
          </h2>
        </div>

        {(slotA || slotB) && (
          <button
            id="clear-crafting-btn"
            type="button"
            onClick={onClearTable}
            className="mc-button px-2.5 py-1 text-sm text-gray-800 flex items-center gap-1 hover:bg-gray-200"
            title="Dọn sạch bàn chế tạo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-pixel text-base">Thu Dọn</span>
          </button>
        )}
      </div>

      {/* Crafting Grid & Arrow & Output */}
      <div className="bg-[#a8a8a8] mc-panel p-4 sm:p-6 rounded-none flex flex-col sm:flex-row items-center justify-between gap-6 relative">
        {/* Left: 2 Crafting Input Slots */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Slot 1 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <ItemSlot
                id="craft-slot-a"
                item={slotA}
                size="lg"
                onDropItem={handleDropSlotA}
                onClick={() => {
                  if (slotA) onSetSlotA(null);
                }}
              />
              {slotA && (
                <button
                  type="button"
                  onClick={() => onSetSlotA(null)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold hover:bg-red-700 shadow"
                  title="Gỡ bỏ"
                >
                  ×
                </button>
              )}
            </div>
            {slotA && (
              <span className="text-[11px] text-gray-800 font-medium mt-1 max-w-[90px] truncate text-center">
                {slotA.name}
              </span>
            )}
          </div>

          {/* Slot 2 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <ItemSlot
                id="craft-slot-b"
                item={slotB}
                size="lg"
                onDropItem={handleDropSlotB}
                onClick={() => {
                  if (slotB) onSetSlotB(null);
                }}
              />
              {slotB && (
                <button
                  type="button"
                  onClick={() => onSetSlotB(null)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold hover:bg-red-700 shadow"
                  title="Gỡ bỏ"
                >
                  ×
                </button>
              )}
            </div>
            {slotB && (
              <span className="text-[11px] text-gray-800 font-medium mt-1 max-w-[90px] truncate text-center">
                {slotB.name}
              </span>
            )}
          </div>
        </div>

        {/* Center: Minecraft Crafting Arrow */}
        <div className="flex flex-col items-center justify-center py-2">
          <div
            className={`p-2 transition-transform duration-300 ${
              matchedRecipe ? 'scale-110 text-amber-500' : 'text-gray-600'
            }`}
          >
            <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </div>
        </div>

        {/* Right: Crafting Output Result Slot */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {matchedRecipe ? (
              <div
                id="craft-result-slot"
                className="cursor-pointer group transform hover:scale-105 transition-transform"
                onClick={handleResultClick}
              >
                <ItemSlot
                  item={matchedRecipe.resultItem as CraftItem}
                  size="craft_out"
                  isSelected={true}
                  badge="★"
                />
                {/* Glowing ring animation */}
                <div className="absolute inset-0 rounded-none border-2 border-yellow-400 animate-pulse pointer-events-none" />
              </div>
            ) : slotA && slotB ? (
              /* If both items placed but no recipe exists yet */
              isAdmin ? (
                <button
                  id="create-new-recipe-btn"
                  type="button"
                  onClick={handleResultClick}
                  className="mc-slot w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center p-2 bg-[#9c8458] hover:bg-[#b09768] text-amber-100 transition group cursor-pointer"
                  title="Bấm để tự tay tạo vật phẩm kết quả"
                >
                  <Plus className="w-7 h-7 text-yellow-300 group-hover:scale-125 transition-transform" />
                  <span className="font-pixel text-xs text-center text-yellow-200 mt-1 leading-tight font-bold">
                    Tạo Kết Quả
                  </span>
                </button>
              ) : (
                <div className="mc-slot w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center p-2 bg-[#555] text-gray-300">
                  <span className="font-pixel text-xl text-yellow-400 font-bold">?</span>
                  <span className="font-pixel text-[10px] text-center text-gray-300 mt-1 leading-tight">
                    Chưa có công thức
                  </span>
                </div>
              )
            ) : (
              /* Empty result slot */
              <div className="mc-slot w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center p-2 bg-[#757575] opacity-75">
                <Sparkles className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>

          {matchedRecipe && (
            <div className="flex flex-col items-center mt-1">
              <span className="text-xs font-bold text-gray-900 max-w-[130px] truncate text-center">
                {matchedRecipe.resultItem.name}
              </span>
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slotA && slotB) onCreateRecipeForItems(slotA, slotB);
                  }}
                  className="mt-1 mc-button px-2 py-0.5 font-pixel text-xs text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                  title="Tự định nghĩa lại vật phẩm kết quả cho 2 nguyên liệu này"
                >
                  <Plus className="w-3 h-3 text-amber-700" />
                  <span>Đổi Kết Quả</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Button to explicitly create result when 2 items are on the table and no recipe yet */}
      {slotA && slotB && !matchedRecipe && (
        <div className="mt-3 flex justify-center">
          {isAdmin ? (
            <button
              id="manual-create-result-btn"
              type="button"
              onClick={() => onCreateRecipeForItems(slotA, slotB)}
              className="mc-button-green px-4 py-2 font-pixel text-lg flex items-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Tự Tạo Vật Phẩm Kết Quả</span>
            </button>
          ) : (
            <div className="bg-[#2a2a2a] border border-[#444] px-4 py-2 font-pixel text-sm text-yellow-400/90 text-center rounded">
              Chưa có công thức kết hợp cho 2 vật phẩm này. Hãy thử kết hợp các vật phẩm khác!
            </div>
          )}
        </div>
      )}

      {/* Action Banner / Prompt when recipe is found */}
      {matchedRecipe && (
        <div
          id="crafting-success-banner"
          onClick={handleResultClick}
          className="mt-4 p-3 bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-2 border-yellow-400 text-yellow-200 flex items-center justify-between cursor-pointer hover:brightness-110 transition shadow-lg"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-yellow-300 animate-bounce" />
            <div>
              <div className="font-pixel text-xl sm:text-2xl font-bold text-white tracking-wide">
                ĐÃ CHẾ TẠO: {matchedRecipe.resultItem.name}!
              </div>
              <div className="text-xs text-yellow-300">
                Ấn vào đây (hoặc vào vật phẩm) để mở Sổ Tay Công Thức, ghi chép văn bản & hình ảnh!
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mc-button-green px-3 py-1 font-pixel text-lg shrink-0 hidden sm:block"
          >
            Mở Trang Ghi Chép →
          </button>
        </div>
      )}
    </div>
  );
};
