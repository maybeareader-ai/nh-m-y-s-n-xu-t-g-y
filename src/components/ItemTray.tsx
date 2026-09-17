import React, { useState } from 'react';
import { CraftItem, TrayConfig } from '../types';
import { ItemSlot } from './ItemSlot';
import { Plus, Search, Layers, Edit3, Check, Trash2, Edit2 } from 'lucide-react';

interface ItemTrayProps {
  trays: TrayConfig[];
  items: CraftItem[];
  selectedItem: CraftItem | null;
  isAdmin: boolean;
  onSelectItem: (item: CraftItem | null) => void;
  onQuickSlot: (item: CraftItem) => void;
  onAddNewItem: (trayId: 'tray1' | 'tray2') => void;
  onEditItem: (item: CraftItem) => void;
  onDeleteItem: (item: CraftItem) => void;
  onClearTray?: (trayId: 'tray1' | 'tray2') => void;
  onUpdateTrayTitle?: (trayId: 'tray1' | 'tray2', newTitle: string) => void;
  onOpenAdminLogin?: () => void;
}

export const ItemTray: React.FC<ItemTrayProps> = ({
  trays,
  items,
  selectedItem,
  isAdmin,
  onSelectItem,
  onQuickSlot,
  onAddNewItem,
  onEditItem,
  onDeleteItem,
  onClearTray,
  onUpdateTrayTitle,
  onOpenAdminLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tray1' | 'tray2'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTrayId, setEditingTrayId] = useState<string | null>(null);
  const [trayTitleInput, setTrayTitleInput] = useState('');

  const handleStartEditTray = (tray: TrayConfig) => {
    setEditingTrayId(tray.id);
    setTrayTitleInput(tray.title);
  };

  const handleSaveTrayTitle = (trayId: 'tray1' | 'tray2') => {
    if (trayTitleInput.trim() && onUpdateTrayTitle) {
      onUpdateTrayTitle(trayId, trayTitleInput.trim());
    }
    setEditingTrayId(null);
  };

  const renderTraySection = (trayConfig: TrayConfig) => {
    const trayItems = items
      .filter((item) => item.tray === trayConfig.id)
      .filter((item) =>
        searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );

    // Calculate empty filler slots to maintain classic Minecraft chest inventory appearance
    const minSlots = 8;
    const emptyCount = Math.max(0, minSlots - trayItems.length);
    const emptyPlaceholders = Array.from({ length: emptyCount });

    return (
      <div
        key={trayConfig.id}
        className="mc-window p-3 sm:p-4 flex-1 flex flex-col justify-between"
      >
        {/* Tray Header */}
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-700" />
            {isAdmin && editingTrayId === trayConfig.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={trayTitleInput}
                  onChange={(e) => setTrayTitleInput(e.target.value)}
                  className="px-2 py-0.5 bg-white border border-gray-600 font-pixel text-lg text-gray-900 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTrayTitle(trayConfig.id);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleSaveTrayTitle(trayConfig.id)}
                  className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                className={`flex items-center gap-1.5 ${isAdmin ? 'group cursor-pointer' : ''}`}
                onClick={() => isAdmin && handleStartEditTray(trayConfig)}
                title={isAdmin ? 'Bấm để đổi tên khay' : undefined}
              >
                <h3 className="font-pixel text-xl sm:text-2xl font-bold text-gray-900 tracking-wide">
                  {trayConfig.title}
                </h3>
                {isAdmin && (
                  <Edit3 className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-pixel text-base text-gray-600">
              ({trayItems.length} vật phẩm)
            </span>

            {/* Nút Thêm Mới - Chỉ Admin */}
            {isAdmin && (
              <button
                id={`add-btn-${trayConfig.id}`}
                type="button"
                onClick={() => onAddNewItem(trayConfig.id)}
                className="mc-button-green px-2.5 py-1 text-sm font-pixel flex items-center gap-1 hover:brightness-105"
                title="Thêm vật phẩm mới vào khay này"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Mới</span>
              </button>
            )}

            {/* Nút Xoá Hết Khay - Chỉ Admin */}
            {isAdmin && trayItems.length > 0 && onClearTray && (
              <button
                type="button"
                onClick={() => onClearTray(trayConfig.id)}
                className="mc-button px-2 py-1 text-xs text-red-700 hover:bg-red-100 flex items-center gap-1"
                title="Xoá tất cả vật phẩm trong khay này"
              >
                <Trash2 className="w-3 h-3 text-red-600" />
                <span className="font-pixel text-xs">Xoá Hết</span>
              </button>
            )}
          </div>
        </div>

        {/* Item Grid (Inventory Slots) */}
        <div className="bg-[#9c9c9c] mc-panel p-2.5 sm:p-3 grid grid-cols-4 gap-2 sm:gap-2.5 flex-1 min-h-[170px] content-start relative">
          {trayItems.length === 0 ? (
            <div className="col-span-4 flex flex-col items-center justify-center py-8 text-center">
              <span className="font-pixel text-lg text-gray-700">Khay chưa có vật phẩm</span>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => onAddNewItem(trayConfig.id)}
                  className="mt-2 mc-button-green px-3 py-1 font-pixel text-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Vật Phẩm Đầu Tiên
                </button>
              ) : (
                <span className="text-xs text-gray-500 mt-1">Chủ phòng chưa thêm vật phẩm nào vào khay này.</span>
              )}
            </div>
          ) : (
            trayItems.map((item) => (
              <div key={item.id} className="flex justify-center">
                <ItemSlot
                  id={`item-slot-${item.id}`}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  showActionsOnHover={isAdmin}
                  onClick={() => {
                    onSelectItem(item);
                    onQuickSlot(item);
                  }}
                  onEdit={isAdmin ? onEditItem : undefined}
                  onDelete={isAdmin ? onDeleteItem : undefined}
                />
              </div>
            ))
          )}

          {/* Empty slot placeholders */}
          {trayItems.length > 0 &&
            emptyPlaceholders.map((_, index) => (
              <div key={`empty-${index}`} className="flex justify-center">
                <ItemSlot
                  isEmptySlot={true}
                  draggable={false}
                  allowEmptyDrop={false}
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Controls: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#2b2b2b] p-1 border-2 border-[#444] rounded">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`font-pixel px-3 py-1 text-base transition ${
              activeTab === 'all'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Hiện Cả 2 Khay
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tray1')}
            className={`font-pixel px-3 py-1 text-base transition ${
              activeTab === 'tray1'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {trays[0]?.title || 'Khay 1'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tray2')}
            className={`font-pixel px-3 py-1 text-base transition ${
              activeTab === 'tray2'
                ? 'bg-purple-600 text-white font-bold shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {trays[1]?.title || 'Khay 2'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm vật phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#262626] border-2 border-[#555] text-white placeholder-gray-400 text-sm font-pixel focus:outline-none focus:border-yellow-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Selected Item Dedicated Action Bar (Prominent Delete / Edit / Info) */}
      {selectedItem && (
        <div className="mc-window p-3 bg-[#c0c0c0] flex flex-wrap items-center justify-between gap-3 border-2 border-yellow-500 shadow-md">
          <div className="flex items-center gap-3">
            <div className="mc-slot w-12 h-12 flex items-center justify-center bg-gray-200">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-8 h-8 object-contain pixelated"
              />
            </div>
            <div>
              <div className="font-pixel text-xl font-bold text-gray-900 leading-tight">
                {selectedItem.name}
              </div>
              <div className="text-xs text-gray-600">
                {selectedItem.description}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => onEditItem(selectedItem)}
                  className="mc-button px-3 py-1.5 font-pixel text-base text-gray-800 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chỉnh Sửa</span>
                </button>

                {/* Nút Xoá Bỏ Vật Phẩm Rõ Ràng & Nổi Bật */}
                <button
                  id="delete-selected-item-btn"
                  type="button"
                  onClick={() => onDeleteItem(selectedItem)}
                  className="mc-button px-3.5 py-1.5 font-pixel text-base text-white bg-red-700 hover:bg-red-800 border-red-900 flex items-center gap-1.5 shadow"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                  <span>Xoá Bỏ Vật Phẩm</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onQuickSlot(selectedItem)}
                className="mc-button-green px-3.5 py-1.5 font-pixel text-base flex items-center gap-1.5 shadow"
              >
                <span>Đặt Lên Bàn Chế Tạo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trays layout: side-by-side or tabbed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeTab === 'all' || activeTab === 'tray1') && renderTraySection(trays[0])}
        {(activeTab === 'all' || activeTab === 'tray2') && renderTraySection(trays[1])}
      </div>
    </div>
  );
};
