import React, { useState, useEffect, useCallback } from 'react';
import { CraftItem, CraftedRecipe, TrayConfig } from './types';
import {
  DEFAULT_TRAYS,
  loadStoredItems,
  loadStoredRecipes,
  loadStoredTrays,
} from './data/defaultData';
import {
  fetchSharedData,
  apiSaveItem,
  apiDeleteItem,
  apiClearTray,
  apiUpdateTrayTitle,
  apiSaveRecipe,
  apiUpdateRecipe,
  apiResetAll,
  getStoredAdminToken,
  setStoredAdminToken,
  apiLoginAdmin,
} from './utils/api';
import { CraftingTable } from './components/CraftingTable';
import { ItemTray } from './components/ItemTray';
import { ItemEditorModal } from './components/ItemEditorModal';
import { RecipePage } from './components/RecipePage';
import { NewRecipeModal } from './components/NewRecipeModal';
import { RecipeBookModal } from './components/RecipeBookModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import {
  BookOpen,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  Share2,
  Key,
  LogOut,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  // Shared state from server (with instant local cache fallback)
  const [items, setItems] = useState<CraftItem[]>(() => loadStoredItems());
  const [recipes, setRecipes] = useState<CraftedRecipe[]>(() => loadStoredRecipes());
  const [trays, setTrays] = useState<TrayConfig[]>(() => {
    const stored = loadStoredTrays();
    return stored.length >= 2 ? stored : DEFAULT_TRAYS;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Admin status
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(getStoredAdminToken());

  // Crafting Table Slots (local to current user session)
  const [slotA, setSlotA] = useState<CraftItem | null>(null);
  const [slotB, setSlotB] = useState<CraftItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<CraftItem | null>(null);

  // Views & Modals
  const [viewMode, setViewMode] = useState<'crafting' | 'recipe_page'>('crafting');
  const [activeRecipe, setActiveRecipe] = useState<CraftedRecipe | null>(null);

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CraftItem | null>(null);
  const [editorDefaultTray, setEditorDefaultTray] = useState<'tray1' | 'tray2'>('tray1');

  const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);
  const [recipeCandidates, setRecipeCandidates] = useState<{ a: CraftItem; b: CraftItem } | null>(null);

  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Verify stored token on boot
  useEffect(() => {
    const token = getStoredAdminToken();
    if (token) {
      apiLoginAdmin(token).then((res) => {
        if (res.success) {
          setIsAdmin(true);
          setAdminToken(token);
        } else {
          setIsAdmin(false);
          setAdminToken(null);
          setStoredAdminToken(null);
        }
      }).catch(() => {
        setIsAdmin(false);
      });
    }
  }, []);

  // Fetch shared data from server
  const loadData = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    setIsSyncing(true);
    try {
      const data = await fetchSharedData();
      if (data) {
        setItems(data.items || []);
        setRecipes(data.recipes || []);
        if (data.trays && data.trays.length >= 2) {
          setTrays(data.trays);
        }
      }
    } catch (err) {
      // Gracefully silent fallback; UI remains interactive with cached data
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Periodic polling to sync with all users having the link
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 4000);

    const handleFocus = () => loadData(false);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadData]);

  // Reset to empty state (Admin only)
  const handleResetData = async () => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    if (window.confirm('Bạn có chắc muốn xoá sạch toàn bộ vật phẩm và công thức trên máy chủ để bắt đầu lại từ đầu? Mọi người có link đều sẽ thấy khay trống.')) {
      try {
        const res = await apiResetAll();
        setItems(res.items);
        setRecipes(res.recipes);
        setTrays(res.trays);
        setSlotA(null);
        setSlotB(null);
        setSelectedItem(null);
        setViewMode('crafting');
        setActiveRecipe(null);
        showToast('Đã đặt lại toàn bộ dữ liệu trên máy chủ thành công!');
      } catch (err: any) {
        alert(err.message || 'Lỗi khi đặt lại dữ liệu.');
      }
    }
  };

  // Quick slotting when clicking an item from tray
  const handleQuickSlot = (item: CraftItem) => {
    if (!slotA) {
      setSlotA(item);
    } else if (!slotB) {
      setSlotB(item);
    } else {
      if (item.tray === 'tray1') {
        setSlotA(item);
      } else {
        setSlotB(item);
      }
    }
  };

  // Open Add Item modal (Admin only)
  const handleAddNewItem = (trayId: 'tray1' | 'tray2') => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setItemToEdit(null);
    setEditorDefaultTray(trayId);
    setIsEditorOpen(true);
  };

  // Open Edit Item modal (Admin only)
  const handleEditItem = (item: CraftItem) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setItemToEdit(item);
    setEditorDefaultTray(item.tray);
    setIsEditorOpen(true);
  };

  // Save Item (add or update) - Sends to server
  const handleSaveItem = async (savedItem: CraftItem) => {
    try {
      const updatedItems = await apiSaveItem(savedItem);
      setItems(updatedItems);
      if (slotA?.id === savedItem.id) setSlotA(savedItem);
      if (slotB?.id === savedItem.id) setSlotB(savedItem);
      showToast(`Đã lưu "${savedItem.name}" và đồng bộ tới tất cả người xem!`);
    } catch (err: any) {
      alert(err.message || 'Không thể lưu vật phẩm.');
    }
  };

  // Delete Item - Sends to server
  const handleDeleteItem = async (itemToDelete: CraftItem) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    if (window.confirm(`Xoá bỏ vật phẩm "${itemToDelete.name}" khỏi máy chủ?`)) {
      try {
        const updatedItems = await apiDeleteItem(itemToDelete.id);
        setItems(updatedItems);
        if (slotA?.id === itemToDelete.id) setSlotA(null);
        if (slotB?.id === itemToDelete.id) setSlotB(null);
        if (selectedItem?.id === itemToDelete.id) setSelectedItem(null);
        showToast(`Đã xoá vật phẩm "${itemToDelete.name}".`);
      } catch (err: any) {
        alert(err.message || 'Không thể xoá vật phẩm.');
      }
    }
  };

  // Clear all items in a tray - Sends to server
  const handleClearTray = async (trayId: 'tray1' | 'tray2') => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    const trayName = trayId === 'tray1' ? trays[0]?.title || 'Khay 1' : trays[1]?.title || 'Khay 2';
    if (window.confirm(`Bạn có chắc muốn xoá toàn bộ vật phẩm trong ${trayName}?`)) {
      try {
        const updatedItems = await apiClearTray(trayId);
        setItems(updatedItems);
        if (slotA?.tray === trayId) setSlotA(null);
        if (slotB?.tray === trayId) setSlotB(null);
        if (selectedItem?.tray === trayId) setSelectedItem(null);
        showToast(`Đã làm sạch ${trayName}.`);
      } catch (err: any) {
        alert(err.message || 'Không thể làm sạch khay.');
      }
    }
  };

  // Update Tray Title - Sends to server
  const handleUpdateTrayTitle = async (trayId: 'tray1' | 'tray2', newTitle: string) => {
    if (!isAdmin) return;
    try {
      const updatedTrays = await apiUpdateTrayTitle(trayId, newTitle);
      setTrays(updatedTrays);
      showToast(`Đã đổi tên thành "${newTitle}".`);
    } catch (err: any) {
      alert(err.message || 'Không thể đổi tên khay.');
    }
  };

  // Open Recipe Document page
  const handleOpenRecipeDoc = (recipe: CraftedRecipe) => {
    setActiveRecipe(recipe);
    setViewMode('recipe_page');
  };

  // Update Recipe Doc - Sends to server
  const handleUpdateRecipe = async (updatedRecipe: CraftedRecipe) => {
    try {
      const updatedRecipes = await apiUpdateRecipe(updatedRecipe);
      setRecipes(updatedRecipes);
      setActiveRecipe(updatedRecipe);
      showToast('Đã lưu nội dung và ảnh cho công thức!');
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật công thức.');
    }
  };

  // Triggered when 2 items placed have no recipe yet
  const handleCreateRecipeForItems = (itemA: CraftItem, itemB: CraftItem) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setRecipeCandidates({ a: itemA, b: itemB });
    setIsNewRecipeModalOpen(true);
  };

  // Save new custom recipe created by admin - Sends to server
  const handleSaveNewRecipe = async (newRecipe: CraftedRecipe) => {
    try {
      const updatedRecipes = await apiSaveRecipe(newRecipe);
      setRecipes(updatedRecipes);
      setIsNewRecipeModalOpen(false);
      setActiveRecipe(newRecipe);
      setViewMode('recipe_page');
      showToast(`Đã tạo công thức mới: ${newRecipe.resultItem.name}!`);
    } catch (err: any) {
      alert(err.message || 'Không thể lưu công thức.');
    }
  };

  // Clear Crafting Table
  const handleClearTable = () => {
    setSlotA(null);
    setSlotB(null);
  };

  // Copy shareable links
  const copyViewerLink = () => {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    navigator.clipboard.writeText(cleanUrl);
    showToast('Đã sao chép Link Người Xem! Người nhận chỉ xem & chế tạo, không thể tạo hay xoá vật phẩm.');
  };

  const copyAdminLink = () => {
    const currentToken = adminToken || 'admin123';
    const adminUrl = `${window.location.origin}${window.location.pathname}#admin=${encodeURIComponent(currentToken)}`;
    navigator.clipboard.writeText(adminUrl);
    showToast('Đã sao chép Link Quản Trị Viên! Hãy giữ riêng link này để tự động mở quyền chủ phòng trên mọi thiết bị.');
  };

  const handleLogout = () => {
    setStoredAdminToken(null);
    setIsAdmin(false);
    setAdminToken(null);
    showToast('Đã chuyển về Chế độ Người xem.');
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-[#ececec] flex flex-col font-sans selection:bg-[#5b8731] selection:text-white relative">
      {/* Subtle ambient background pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #1c1917 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1e293b] border-2 border-yellow-400 text-yellow-200 px-4 py-2.5 rounded shadow-2xl font-pixel text-sm sm:text-base flex items-center gap-2 max-w-lg text-center animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#292524]/95 backdrop-blur border-b-2 border-[#44403c] shadow-lg px-3 sm:px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* App Title */}
          <div
            className="cursor-pointer select-none flex items-center gap-2"
            onClick={() => setViewMode('crafting')}
          >
            <h1 className="font-pixel text-xl sm:text-2xl font-bold tracking-wider text-white drop-shadow leading-none">
              NHÀ MÁY SẢN XUẤT GÂY
            </h1>

            {/* Sync live status indicator */}
            <span
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-pixel bg-emerald-950/80 text-emerald-400 border border-emerald-700/60"
              title="Dữ liệu được lưu trữ trên máy chủ và đồng bộ với tất cả mọi người có link"
            >
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isSyncing ? 'animate-ping' : ''}`} />
              Đồng bộ máy chủ
            </span>
          </div>

          {/* Action Tools & User Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role indicator badge */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 bg-amber-950/70 border border-amber-600/70 px-2.5 py-1 rounded">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span className="font-pixel text-xs sm:text-sm text-yellow-300 font-bold">
                  Chủ Phòng
                </span>

                {/* Share Viewer Link */}
                <button
                  type="button"
                  onClick={copyViewerLink}
                  className="mc-button px-2 py-0.5 text-[11px] font-pixel text-gray-800 flex items-center gap-1 ml-1"
                  title="Sao chép link cho người khác xem & chế tạo (không được tạo hay xoá vật phẩm)"
                >
                  <Share2 className="w-3 h-3 text-blue-600" />
                  <span>Link Người Xem</span>
                </button>

                {/* Copy Admin link */}
                <button
                  type="button"
                  onClick={copyAdminLink}
                  className="mc-button px-2 py-0.5 text-[11px] font-pixel text-gray-800 flex items-center gap-1"
                  title="Sao chép link có mã quản trị riêng của bạn"
                >
                  <Key className="w-3 h-3 text-purple-600" />
                  <span>Link Admin</span>
                </button>

                {/* Change password button */}
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(true)}
                  className="mc-button p-1 text-gray-800 hover:text-purple-700"
                  title="Đổi mật khẩu chủ phòng"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>

                {/* Logout button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mc-button p-1 text-gray-800 hover:text-red-600"
                  title="Thoát quyền chủ phòng về chế độ người xem"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] px-2.5 py-1 rounded">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-pixel text-xs text-sky-300">
                  Người Xem
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="mc-button-green px-2 py-0.5 font-pixel text-xs flex items-center gap-1 ml-1 text-white shadow"
                  title="Đăng nhập với vai trò chủ phòng để tạo và chỉnh sửa vật phẩm"
                >
                  <Key className="w-3 h-3" />
                  <span>Đăng Nhập</span>
                </button>
              </div>
            )}

            {/* Sách công thức Button */}
            <button
              id="open-recipe-book-btn"
              type="button"
              onClick={() => setIsRecipeBookOpen(true)}
              className="mc-button-green px-2.5 py-1 font-pixel text-sm sm:text-base flex items-center gap-1.5 shadow"
              title="Mở Sách Công Thức"
            >
              <BookOpen className="w-3.5 h-3.5 text-yellow-200" />
              <span>Sách Công Thức ({recipes.length})</span>
            </button>

            {/* Reset data (Admin only) */}
            {isAdmin && (
              <button
                id="reset-data-btn"
                type="button"
                onClick={handleResetData}
                className="mc-button p-1.5 text-gray-800 hover:text-red-700"
                title="Xoá bỏ toàn bộ vật phẩm và công thức trên máy chủ"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-6 relative z-10">
        {viewMode === 'recipe_page' && activeRecipe ? (
          /* Dedicated Recipe & Lore Document View */
          <RecipePage
            recipe={activeRecipe}
            itemA={items.find((i) => i.id === activeRecipe.itemAId) || null}
            itemB={items.find((i) => i.id === activeRecipe.itemBId) || null}
            isAdmin={isAdmin}
            onBack={() => setViewMode('crafting')}
            onUpdateRecipe={handleUpdateRecipe}
          />
        ) : (
          /* Crafting Table & 2 Item Trays */
          <div className="space-y-6">
            {/* Crafting Table section */}
            <CraftingTable
              slotA={slotA}
              slotB={slotB}
              isAdmin={isAdmin}
              onSetSlotA={setSlotA}
              onSetSlotB={setSlotB}
              recipes={recipes}
              onOpenRecipeDoc={handleOpenRecipeDoc}
              onCreateRecipeForItems={handleCreateRecipeForItems}
              onClearTable={handleClearTable}
            />

            {/* 2 Item Trays Section */}
            <ItemTray
              trays={trays}
              items={items}
              selectedItem={selectedItem}
              isAdmin={isAdmin}
              onSelectItem={setSelectedItem}
              onQuickSlot={handleQuickSlot}
              onAddNewItem={handleAddNewItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onClearTray={handleClearTray}
              onUpdateTrayTitle={handleUpdateTrayTitle}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#333] bg-[#171413] py-4 px-4 text-center text-xs text-gray-500 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1 font-pixel text-sm text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Nhà máy sản xuất gây
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-xs">
            {isAdmin
              ? '👑 Bạn đang ở chế độ Chủ phòng. Mọi thay đổi sẽ tự động đồng bộ tới người khác có link.'
              : '👁️ Chế độ Người xem: Bạn có thể tự do kéo ghép các vật phẩm vào bàn chế tạo.'}
          </span>
        </div>
      </footer>

      {/* Item Editor Modal (Admin Only) */}
      <ItemEditorModal
        isOpen={isEditorOpen}
        itemToEdit={itemToEdit}
        defaultTray={editorDefaultTray}
        trays={trays}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        onClose={() => setIsEditorOpen(false)}
      />

      {/* New Recipe Forge Modal (Admin Only) */}
      {recipeCandidates && (
        <NewRecipeModal
          isOpen={isNewRecipeModalOpen}
          itemA={recipeCandidates.a}
          itemB={recipeCandidates.b}
          onSaveRecipe={handleSaveNewRecipe}
          onClose={() => {
            setIsNewRecipeModalOpen(false);
            setRecipeCandidates(null);
          }}
        />
      )}

      {/* Recipe Book Modal */}
      <RecipeBookModal
        isOpen={isRecipeBookOpen}
        recipes={recipes}
        items={items}
        onSelectRecipe={(recipe) => {
          setIsRecipeBookOpen(false);
          handleOpenRecipeDoc(recipe);
        }}
        onClose={() => setIsRecipeBookOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setAdminToken(getStoredAdminToken());
          showToast('Đăng nhập Chủ phòng thành công! Bạn hiện có quyền tạo, sửa, xoá vật phẩm.');
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
        onSuccess={(newPass) => {
          setAdminToken(newPass);
          showToast('Đã đổi mật khẩu thành công! Hãy lưu lại link admin mới.');
        }}
      />
    </div>
  );
}
