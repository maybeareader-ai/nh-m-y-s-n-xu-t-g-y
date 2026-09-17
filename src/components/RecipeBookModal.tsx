import React from 'react';
import { CraftedRecipe, CraftItem } from '../types';
import { BookOpen, X, Sparkles, ChevronRight } from 'lucide-react';
import { playPageTurn } from '../utils/audio';

interface RecipeBookModalProps {
  isOpen: boolean;
  recipes: CraftedRecipe[];
  items: CraftItem[];
  onSelectRecipe: (recipe: CraftedRecipe) => void;
  onClose: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  isOpen,
  recipes,
  items,
  onSelectRecipe,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="mc-window w-full max-w-2xl max-h-[85vh] flex flex-col text-[#222] my-8 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#2d572c] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#193318]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-300" />
            <h2 className="font-pixel text-2xl tracking-wide">
              SÁCH CÔNG THỨC (RECIPE BOOK)
            </h2>
            <span className="text-xs bg-[#1e4513] px-2 py-0.5 rounded text-green-200">
              {recipes.length} Công thức
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 hover:bg-[#193318] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipe List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-[#b8b8b8]">
          {recipes.length === 0 ? (
            <div className="text-center py-12 text-gray-600 font-pixel text-xl">
              Chưa có công thức nào. Hãy kết hợp 2 vật phẩm trên Bàn Chế Tạo!
            </div>
          ) : (
            recipes.map((recipe) => {
              const itemA = items.find((i) => i.id === recipe.itemAId);
              const itemB = items.find((i) => i.id === recipe.itemBId);

              return (
                <div
                  key={recipe.id}
                  onClick={() => {
                    playPageTurn();
                    onSelectRecipe(recipe);
                  }}
                  className="bg-[#d6d6d6] hover:bg-[#e6e6e6] p-3 border-2 border-[#777] flex items-center justify-between cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    {/* Result Slot */}
                    <div className="mc-slot w-14 h-14 flex items-center justify-center shrink-0 bg-[#ffd700]/20">
                      <img
                        src={recipe.resultItem.image}
                        alt={recipe.resultItem.name}
                        className="w-10 h-10 object-contain pixelated group-hover:scale-110 transition-transform"
                      />
                    </div>

                    <div>
                      <div className="font-pixel text-xl font-bold text-gray-900 group-hover:text-blue-700 transition">
                        {recipe.resultItem.name}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
                        <span>{itemA?.name || 'Nguyên liệu A'}</span>
                        <span className="font-bold text-gray-500">+</span>
                        <span>{itemB?.name || 'Nguyên liệu B'}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-1 italic mt-0.5">
                        {recipe.doc.subtitle || recipe.resultItem.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-pixel text-emerald-700 bg-emerald-100 px-2 py-0.5 border border-emerald-300 hidden sm:inline">
                      Xem Sách Chi Tiết
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#a3a3a3] p-3 border-t-2 border-[#777] flex items-center justify-between text-xs text-gray-700">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Nhấp vào bất kỳ công thức nào để mở trang ghi chép & chỉnh sửa chi tiết</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mc-button px-3 py-1 font-pixel text-sm text-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
