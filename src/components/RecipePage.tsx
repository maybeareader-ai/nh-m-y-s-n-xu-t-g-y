import React, { useState } from 'react';
import { CraftedRecipe, CraftItem } from '../types';
import { playItemClick, playPageTurn } from '../utils/audio';
import {
  ArrowLeft,
  Edit,
  Save,
  Plus,
  Trash,
  Upload,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface RecipePageProps {
  recipe: CraftedRecipe;
  itemA: CraftItem | null;
  itemB: CraftItem | null;
  isAdmin: boolean;
  onBack: () => void;
  onUpdateRecipe: (updatedRecipe: CraftedRecipe) => void;
}

export const RecipePage: React.FC<RecipePageProps> = ({
  recipe,
  itemA,
  itemB,
  isAdmin,
  onBack,
  onUpdateRecipe,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(recipe.doc.title || recipe.resultItem.name);
  const [subtitle, setSubtitle] = useState(recipe.doc.subtitle || '');
  const [story, setStory] = useState(recipe.doc.story || '');
  const [formulaSteps, setFormulaSteps] = useState<string[]>(recipe.doc.formulaSteps || []);
  const [newStep, setNewStep] = useState('');
  const [images, setImages] = useState<string[]>(recipe.doc.images || [recipe.resultItem.image]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [notes, setNotes] = useState(recipe.doc.notes || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sound effect on open
  React.useEffect(() => {
    playPageTurn();
  }, []);

  const handleAddStep = () => {
    if (newStep.trim()) {
      setFormulaSteps([...formulaSteps, newStep.trim()]);
      setNewStep('');
    }
  };

  const handleRemoveStep = (idx: number) => {
    setFormulaSteps(formulaSteps.filter((_, i) => i !== idx));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImages([...images, event.target.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length <= 1) return; // Keep at least one
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    playItemClick();
    const updated: CraftedRecipe = {
      ...recipe,
      doc: {
        ...recipe.doc,
        title: title.trim(),
        subtitle: subtitle.trim(),
        story: story.trim(),
        formulaSteps,
        images,
        notes: notes.trim(),
        updatedAt: Date.now(),
      },
    };

    onUpdateRecipe(updated);
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const copyRecipeShare = () => {
    const text = `Sách Công Thức Minecraft: ${recipe.resultItem.name}\nNguyên liệu: ${itemA?.name || 'Vật phẩm 1'} + ${itemB?.name || 'Vật phẩm 2'}\n${story}`;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép công thức vào bộ nhớ đệm!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-3 sm:px-6 space-y-6">
      {/* Navigation & Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#242424] p-3 border-2 border-[#444] rounded shadow-md">
        <button
          id="back-to-crafting-btn"
          type="button"
          onClick={() => {
            playPageTurn();
            onBack();
          }}
          className="mc-button px-4 py-1.5 font-pixel text-lg sm:text-xl text-gray-800 flex items-center gap-2 hover:bg-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>← Quay Lại Bàn Chế Tạo</span>
        </button>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="text-emerald-400 font-pixel text-base flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu thành công!
            </span>
          )}

          <button
            type="button"
            onClick={copyRecipeShare}
            className="mc-button px-3 py-1.5 font-pixel text-base text-gray-800 flex items-center gap-1.5"
            title="Sao chép tóm tắt công thức"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia Sẻ</span>
          </button>

          {isAdmin && (
            isEditing ? (
              <button
                id="save-recipe-page-btn"
                type="button"
                onClick={handleSave}
                className="mc-button-green px-4 py-1.5 font-pixel text-lg flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Trang Công Thức</span>
              </button>
            ) : (
              <button
                id="edit-recipe-page-btn"
                type="button"
                onClick={() => {
                  playItemClick();
                  setIsEditing(true);
                }}
                className="mc-button px-4 py-1.5 font-pixel text-lg text-gray-900 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh Sửa Văn Bản & Ảnh</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Recipe Book / Document Page */}
      <div className="mc-window p-5 sm:p-8 text-[#222222] shadow-2xl relative overflow-hidden">
        {/* Parchment / Tome Watermark Accent */}
        <div className="absolute top-2 right-4 opacity-10 pointer-events-none">
          <BookOpen className="w-44 h-44 text-black" />
        </div>

        {/* Recipe Visual Formula Bar */}
        <div className="bg-[#b3b3b3] mc-panel p-4 sm:p-5 mb-8">
          <div className="text-xs uppercase tracking-widest font-pixel text-gray-700 font-bold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>SƠ ĐỒ CÔNG THỨC CHẾ TẠO (CRAFTING FORMULA)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-[#d1d1d1] p-4 border-2 border-[#888]">
            {/* Ingredient A */}
            <div className="flex items-center gap-3 bg-[#e5e5e5] p-2.5 border border-[#999] shadow-sm">
              <div className="mc-slot w-14 h-14 flex items-center justify-center shrink-0">
                <img
                  src={itemA?.image || recipe.doc.images[1] || recipe.resultItem.image}
                  alt={itemA?.name || 'Nguyên liệu 1'}
                  className="w-10 h-10 object-contain pixelated"
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-blue-700 font-pixel">NGUYÊN LIỆU 1 (KHAY 1)</div>
                <div className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                  {itemA?.name || 'Vật phẩm A'}
                </div>
              </div>
            </div>

            <span className="font-pixel text-3xl font-bold text-gray-700">+</span>

            {/* Ingredient B */}
            <div className="flex items-center gap-3 bg-[#e5e5e5] p-2.5 border border-[#999] shadow-sm">
              <div className="mc-slot w-14 h-14 flex items-center justify-center shrink-0">
                <img
                  src={itemB?.image || recipe.doc.images[2] || recipe.resultItem.image}
                  alt={itemB?.name || 'Nguyên liệu 2'}
                  className="w-10 h-10 object-contain pixelated"
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-purple-700 font-pixel">NGUYÊN LIỆU 2 (KHAY 2)</div>
                <div className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                  {itemB?.name || 'Vật phẩm B'}
                </div>
              </div>
            </div>

            <span className="font-pixel text-3xl font-bold text-amber-600">➔</span>

            {/* Result Item */}
            <div className="flex items-center gap-3 bg-[#fef9c3] p-2.5 border-2 border-amber-500 shadow-md">
              <div className="mc-slot w-16 h-16 flex items-center justify-center shrink-0 bg-[#ffd700]/20">
                <img
                  src={recipe.resultItem.image}
                  alt={recipe.resultItem.name}
                  className="w-12 h-12 object-contain pixelated animate-pulse"
                />
              </div>
              <div className="text-left">
                <div className="text-xs text-amber-800 font-pixel font-bold">KẾT QUẢ THÀNH PHẨM</div>
                <div className="font-bold text-amber-950 text-base sm:text-lg leading-tight">
                  {recipe.resultItem.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="border-b-2 border-gray-400 pb-4 mb-6">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-pixel font-bold text-gray-700 uppercase mb-1">
                  Tiêu Đề Trang Công Thức:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#555] font-pixel text-2xl sm:text-3xl text-gray-900 font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-pixel font-bold text-gray-700 uppercase mb-1">
                  Phụ Đề / Tóm Lược:
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="VD: Cổ vật huyền thoại với sức mạnh đóng băng ngàn năm..."
                  className="w-full px-3 py-1.5 bg-white border-2 border-[#555] text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-pixel text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-wide leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-700 text-sm sm:text-base mt-1.5 italic">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Content Section: Story Lore, Formula Steps, Stats, Gallery, Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2/3): Story & Step-by-step Formula & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section: Giới thiệu & Cốt truyện / Văn bản */}
            <div className="bg-[#dedede] p-4 sm:p-5 border-2 border-[#888]">
              <h3 className="font-pixel text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Cốt Truyện & Mô Tả Chi Tiết (Lore)</span>
              </h3>
              {isEditing ? (
                <textarea
                  rows={6}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Viết văn bản, cốt truyện, nguồn gốc hoặc lịch sử sáng chế của vật phẩm này..."
                  className="w-full p-3 bg-white border-2 border-[#555] text-gray-900 text-sm leading-relaxed focus:outline-none"
                />
              ) : (
                <div className="text-gray-800 leading-relaxed text-sm sm:text-base whitespace-pre-line font-serif italic bg-white/70 p-4 border border-gray-300">
                  {story || 'Chưa có cốt truyện nào được ghi chép. Hãy bấm Chỉnh Sửa để viết văn bản.'}
                </div>
              )}
            </div>

            {/* Section: Các bước tiến hành công thức (Formula Steps) */}
            <div className="bg-[#dedede] p-4 sm:p-5 border-2 border-[#888]">
              <h3 className="font-pixel text-2xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                <span>Quy Trình & Các Bước Chế Tác</span>
                {isEditing && (
                  <span className="text-xs font-sans text-gray-600 font-normal">
                    (Thêm các bước theo trình tự)
                  </span>
                )}
              </h3>

              <div className="space-y-2">
                {formulaSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 bg-white p-2.5 border border-gray-400 text-sm"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-pixel text-lg font-bold text-amber-700 shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-gray-900 leading-snug">{step}</span>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Nhập bước chế tạo mới (VD: Bước 3: Nung nóng hỗn hợp...)"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStep();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-[#555] text-sm text-gray-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="mc-button px-3 py-1 font-pixel text-base text-gray-800 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Thêm Bước
                  </button>
                </div>
              )}
            </div>

            {/* Section: Ghi Chú Riêng Của Người Dùng (Personal Notes) */}
            <div className="bg-[#dedede] p-4 sm:p-5 border-2 border-[#888]">
              <h3 className="font-pixel text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>Ghi Chú & Lưu Ý Đặc Biệt</span>
              </h3>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú kinh nghiệm chiến đấu, cảnh báo hoặc lưu ý khi dùng..."
                  className="w-full p-3 bg-white border-2 border-[#555] text-gray-900 text-sm focus:outline-none"
                />
              ) : (
                <div className="text-gray-800 text-sm bg-yellow-50 p-3 border-l-4 border-yellow-500 italic">
                  {notes || 'Không có ghi chú bổ sung.'}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1/3): Image Gallery & Stats Properties */}
          <div className="space-y-6">
            {/* Section: Hình Ảnh Minh Hoạ (Images Gallery) */}
            <div className="bg-[#dedede] p-4 border-2 border-[#888]">
              <h3 className="font-pixel text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-700" />
                <span>Hình Ảnh Minh Hoạ ({images.length})</span>
              </h3>

              {/* Main Featured Image */}
              <div className="bg-black/90 p-4 border-2 border-[#444] flex flex-col items-center justify-center rounded-none mb-3">
                <img
                  src={images[0]}
                  alt="Featured illustration"
                  className="max-h-48 object-contain pixelated drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)]"
                />
                <span className="font-pixel text-xs text-gray-400 mt-2">
                  Hình ảnh biểu trưng chính
                </span>
              </div>

              {/* Secondary Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group bg-[#ccc] p-1 border border-gray-500">
                      <img
                        src={img}
                        alt={`Thumnail ${idx}`}
                        className="w-full h-16 object-contain pixelated"
                      />
                      {isEditing && idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-0 right-0 bg-red-600 text-white p-0.5 text-xs hover:bg-red-700 shadow"
                          title="Xoá ảnh này"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Image in Edit Mode */}
              {isEditing && (
                <div className="space-y-2 pt-2 border-t border-gray-400">
                  <div className="flex gap-1">
                    <input
                      type="url"
                      placeholder="Dán link ảnh (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-[#555] text-xs text-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="mc-button px-2 py-1 text-xs font-pixel text-gray-800"
                    >
                      Thêm
                    </button>
                  </div>

                  <label className="mc-button w-full py-1.5 text-xs font-pixel text-gray-800 flex items-center justify-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy tính</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
