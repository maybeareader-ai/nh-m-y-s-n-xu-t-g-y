import React, { useState, useEffect } from 'react';
import { CraftItem, TrayConfig } from '../types';
import { MinecraftTooltip } from './MinecraftTooltip';
import { playItemClick } from '../utils/audio';
import { X, Upload, Sparkles, Image as ImageIcon, Trash } from 'lucide-react';

interface ItemEditorModalProps {
  isOpen: boolean;
  itemToEdit: CraftItem | null;
  defaultTray?: 'tray1' | 'tray2';
  trays: TrayConfig[];
  onSave: (item: CraftItem) => void;
  onDelete?: (item: CraftItem) => void;
  onClose: () => void;
}

const DEFAULT_FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="64" height="64"><rect width="16" height="16" fill="%237e22ce"/><rect x="4" y="4" width="8" height="8" fill="%23facc15"/></svg>';

export const ItemEditorModal: React.FC<ItemEditorModalProps> = ({
  isOpen,
  itemToEdit,
  defaultTray = 'tray1',
  trays,
  onSave,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(DEFAULT_FALLBACK_IMAGE);
  const [description, setDescription] = useState('');
  const [tray, setTray] = useState<'tray1' | 'tray2'>(defaultTray);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setImage(itemToEdit.image);
      setDescription(itemToEdit.description || '');
      setTray(itemToEdit.tray);
    } else {
      setName('');
      setImage(DEFAULT_FALLBACK_IMAGE);
      setDescription('');
      setTray(defaultTray);
    }
    setImageUrlInput('');
  }, [itemToEdit, defaultTray, isOpen]);

  if (!isOpen) return null;

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
    if (imageUrlInput.trim()) {
      setImage(imageUrlInput.trim());
      setImageUrlInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playItemClick();

    const finalItem: CraftItem = {
      id: itemToEdit ? itemToEdit.id : `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      image,
      description: description.trim(),
      tray,
      createdAt: itemToEdit ? itemToEdit.createdAt : Date.now(),
    };

    onSave(finalItem);
    onClose();
  };

  const previewItemData = {
    name: name || 'Tên Vật Phẩm',
    description: description || 'Chú thích của vật phẩm sẽ hiển thị tại đây.',
    tray,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="mc-window w-full max-w-2xl text-[#1e1e1e] my-8 overflow-hidden">
        {/* Window Header */}
        <div className="bg-[#484848] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#333333]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="font-pixel text-2xl tracking-wide uppercase">
              {itemToEdit ? 'Chỉnh Sửa Vật Phẩm' : 'Tạo Vật Phẩm Mới'}
            </h2>
          </div>
          <button
            id="close-item-editor"
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 hover:bg-[#666] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Form Controls */}
            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
                  Tên Vật Phẩm *
                </label>
                <input
                  id="item-name-input"
                  type="text"
                  required
                  placeholder="Nhập tên vật phẩm..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#ededed] border-2 border-[#555] text-gray-900 font-medium focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Tray Destination */}
              <div>
                <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
                  Khay Chứa Vật Phẩm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {trays.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTray(t.id)}
                      className={`p-2 border-2 text-left transition font-pixel text-base ${
                        tray === t.id
                          ? 'border-blue-600 bg-blue-100 font-bold text-blue-900 shadow-sm'
                          : 'border-gray-400 bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-bold">{t.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description / Chú thích */}
              <div>
                <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
                  Chú Thích / Mô Tả
                </label>
                <textarea
                  id="item-desc-input"
                  rows={4}
                  placeholder="Nhập chú thích hoặc mô tả cho vật phẩm..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#ededed] border-2 border-[#555] text-gray-900 font-sans text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column: Image Source & Preview */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block font-pixel text-lg font-bold text-gray-800 mb-1">
                  Hình Ảnh Vật Phẩm
                </label>

                {/* Upload File */}
                <div className="space-y-2">
                  <label className="cursor-pointer block border-2 border-dashed border-gray-600 hover:border-gray-900 p-4 bg-gray-200 hover:bg-gray-100 transition text-center">
                    <Upload className="w-6 h-6 mx-auto text-gray-700 mb-1" />
                    <span className="font-pixel text-base text-gray-800 block">
                      Tải ảnh từ máy tính
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, SVG hoặc GIF
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Hoặc dán URL ảnh (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-[#ededed] border-2 border-[#555] text-xs text-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="mc-button px-3 py-1 font-pixel text-xs text-gray-800 flex items-center gap-1"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Dùng
                    </button>
                  </div>
                </div>

                {/* Image Preview Box */}
                <div className="mt-3 flex items-center gap-3 p-2 bg-[#b0b0b0] border-2 border-[#777]">
                  <div className="w-14 h-14 mc-slot flex items-center justify-center bg-[#c0c0c0] shrink-0">
                    <img
                      src={image}
                      alt="Xem trước"
                      className="w-10 h-10 object-contain pixelated"
                    />
                  </div>
                  <div className="text-xs text-gray-700">
                    <span className="font-bold block">Hình ảnh đang chọn</span>
                    <span className="text-[11px] text-gray-600">Sẽ hiển thị trong khay và bàn chế tạo</span>
                  </div>
                </div>
              </div>

              {/* Tooltip Preview */}
              <div>
                <label className="block font-pixel text-sm font-bold text-gray-700 mb-1">
                  Hiển thị khi rê chuột (Tooltip Preview):
                </label>
                <div className="flex justify-center p-2 bg-[#2d2d2d] border-2 border-[#111]">
                  <MinecraftTooltip item={previewItemData} />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-gray-400">
            <div>
              {itemToEdit && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(itemToEdit);
                    onClose();
                  }}
                  className="mc-button px-4 py-2 font-pixel text-base text-red-700 hover:bg-red-100 flex items-center gap-1.5"
                >
                  <Trash className="w-4 h-4 text-red-600" />
                  <span>Xoá Bỏ Vật Phẩm</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="mc-button px-5 py-2 font-pixel text-xl text-gray-800 hover:bg-gray-300"
              >
                Hủy Bỏ
              </button>
              <button
                id="save-item-btn"
                type="submit"
                className="mc-button-green px-6 py-2 font-pixel text-xl tracking-wide flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {itemToEdit ? 'Lưu Thay Đổi' : 'Tạo Vật Phẩm Mới'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
