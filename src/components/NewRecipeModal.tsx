import React, { useState } from 'react';
import { CraftItem, CraftedRecipe } from '../types';
import { Sparkles, X, Upload, Image as ImageIcon } from 'lucide-react';

interface NewRecipeModalProps {
  isOpen: boolean;
  itemA: CraftItem | null;
  itemB: CraftItem | null;
  onSaveRecipe: (newRecipe: CraftedRecipe) => void;
  onClose: () => void;
}

const DEFAULT_RESULT_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="64" height="64"><rect width="16" height="16" fill="%23b45309"/><rect x="4" y="4" width="8" height="8" fill="%23fde047"/></svg>';

export const NewRecipeModal: React.FC<NewRecipeModalProps> = ({
  isOpen,
  itemA,
  itemB,
  onSaveRecipe,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(DEFAULT_RESULT_IMAGE);
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!isOpen || !itemA || !itemB) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customImageUrl.trim()) {
      setImage(customImageUrl.trim());
      setCustomImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const resultId = `result_${Date.now()}`;
    const recipeId = `recipe_${Date.now()}`;

    const newRecipe: CraftedRecipe = {
      id: recipeId,
      itemAId: itemA.id,
      itemBId: itemB.id,
      resultItem: {
        id: resultId,
        name: name.trim(),
        image,
        description: description.trim(),
      },
      doc: {
        title: name.trim(),
        subtitle: '',
        story: story.trim(),
        formulaSteps: [],
        images: [image],
        notes: '',
        updatedAt: Date.now(),
      },
    };

    onSaveRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="mc-window w-full max-w-xl text-[#222] my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#3e3e3e] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#222]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="font-pixel text-2xl tracking-wide">
              TẠO VẬT PHẨM KẾT QUẢ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Combination Preview */}
        <div className="bg-[#b0b0b0] p-3 border-b-2 border-[#888] flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-[#d9d9d9] px-2.5 py-1.5 border border-gray-500">
            <img src={itemA.image} alt={itemA.name} className="w-7 h-7 object-contain pixelated" />
            <span className="text-xs font-bold text-gray-800">{itemA.name}</span>
          </div>
          <span className="font-pixel text-xl font-bold">+</span>
          <div className="flex items-center gap-2 bg-[#d9d9d9] px-2.5 py-1.5 border border-gray-500">
            <img src={itemB.image} alt={itemB.name} className="w-7 h-7 object-contain pixelated" />
            <span className="text-xs font-bold text-gray-800">{itemB.name}</span>
          </div>
          <span className="font-pixel text-xl font-bold text-amber-600">➔</span>
          <div className="w-9 h-9 mc-slot flex items-center justify-center bg-[#c0c0c0]">
            <img src={image} alt="Preview" className="w-7 h-7 object-contain pixelated" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
              Tên Vật Phẩm Kết Quả *
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên vật phẩm bạn muốn tạo ra..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#ededed] border-2 border-[#555] text-gray-900 font-medium focus:outline-none"
              autoFocus
            />
          </div>

          {/* Image Upload or URL */}
          <div>
            <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
              Hình Ảnh Kết Quả
            </label>

            <div className="space-y-2">
              <label className="mc-button w-full py-2 text-sm font-pixel text-gray-800 flex items-center justify-center gap-2 cursor-pointer bg-gray-200 hover:bg-gray-100">
                <Upload className="w-4 h-4" />
                <span>Tải ảnh từ máy tính</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Hoặc dán URL ảnh (https://...)"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#ededed] border-2 border-[#666] text-gray-900"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="mc-button px-3 py-1 font-pixel text-xs text-gray-800 flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Dùng URL
                </button>
              </div>
            </div>

            {/* Preview Selected Image */}
            <div className="mt-2 flex items-center gap-3 p-2 bg-[#9c9c9c] mc-panel">
              <div className="w-12 h-12 mc-slot flex items-center justify-center bg-[#c0c0c0] shrink-0">
                <img src={image} alt="Preview" className="w-9 h-9 object-contain pixelated" />
              </div>
              <span className="text-xs text-gray-800 font-medium">Hình ảnh thành phẩm đang chọn</span>
            </div>
          </div>

          <div>
            <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
              Chú Thích / Mô Tả
            </label>
            <input
              type="text"
              placeholder="Nhập chú thích ngắn cho vật phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#ededed] border-2 border-[#555] text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
              Văn Bản / Giới Thiệu (Lore)
            </label>
            <textarea
              rows={3}
              placeholder="Nhập nội dung văn bản trên trang công thức (tuỳ chọn)..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#ededed] border-2 border-[#555] text-sm text-gray-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t-2 border-gray-400">
            <button
              type="button"
              onClick={onClose}
              className="mc-button px-4 py-1.5 font-pixel text-lg text-gray-800"
            >
              Hủy
            </button>
            <button
              id="submit-create-result-btn"
              type="submit"
              className="mc-button-green px-5 py-1.5 font-pixel text-xl flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tạo Kết Quả Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
