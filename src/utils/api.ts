import { CraftItem, CraftedRecipe, TrayConfig } from '../types';
import {
  loadStoredItems,
  saveStoredItems,
  loadStoredRecipes,
  saveStoredRecipes,
  loadStoredTrays,
  saveStoredTrays,
  DEFAULT_TRAYS,
} from '../data/defaultData';

const ADMIN_TOKEN_KEY = 'nhamay_admin_token';

export function getStoredAdminToken(): string | null {
  try {
    // Check URL params first (e.g. ?admin=matkhau or #admin=matkhau)
    const urlParams = new URLSearchParams(window.location.search);
    const queryToken = urlParams.get('admin');
    if (queryToken) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, queryToken);
      return queryToken;
    }

    const hash = window.location.hash;
    if (hash && hash.includes('admin=')) {
      const match = hash.match(/admin=([^&]+)/);
      if (match && match[1]) {
        const hashToken = decodeURIComponent(match[1]);
        sessionStorage.setItem(ADMIN_TOKEN_KEY, hashToken);
        return hashToken;
      }
    }

    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string | null, remember: boolean = true) {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      if (remember) {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
      }
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {}
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['x-admin-token'] = token;
  }
  return headers;
}

export interface SharedDataResponse {
  items: CraftItem[];
  recipes: CraftedRecipe[];
  trays: TrayConfig[];
}

export async function fetchSharedData(retries = 2, delayMs = 300): Promise<SharedDataResponse> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const data: SharedDataResponse = await res.json();
        // Update local cache
        if (Array.isArray(data.items)) saveStoredItems(data.items);
        if (Array.isArray(data.recipes)) saveStoredRecipes(data.recipes);
        if (Array.isArray(data.trays) && data.trays.length >= 2) saveStoredTrays(data.trays);
        return data;
      }
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // If server request couldn't complete, fallback to cached data safely
  return {
    items: loadStoredItems(),
    recipes: loadStoredRecipes(),
    trays: loadStoredTrays().length >= 2 ? loadStoredTrays() : DEFAULT_TRAYS,
  };
}

export async function apiLoginAdmin(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (res.ok && data.success) {
    setStoredAdminToken(data.token, true);
    return { success: true, token: data.token };
  }
  return { success: false, message: data.message || 'Mật khẩu không chính xác.' };
}

export async function apiChangePassword(newPassword: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword }),
  });
  const data = await res.json();
  if (res.ok) {
    setStoredAdminToken(newPassword, true);
    return { success: true };
  }
  return { success: false, message: data.error || 'Đổi mật khẩu thất bại.' };
}

export async function apiSaveItem(item: CraftItem): Promise<CraftItem[]> {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền tạo / sửa vật phẩm.');
  }
  const data = await res.json();
  return data.items;
}

export async function apiDeleteItem(id: string): Promise<CraftItem[]> {
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền xoá vật phẩm.');
  }
  const data = await res.json();
  return data.items;
}

export async function apiClearTray(trayId: 'tray1' | 'tray2'): Promise<CraftItem[]> {
  const res = await fetch(`/api/trays/${trayId}/clear`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền dọn khay.');
  }
  const data = await res.json();
  return data.items;
}

export async function apiUpdateTrayTitle(trayId: 'tray1' | 'tray2', title: string): Promise<TrayConfig[]> {
  const res = await fetch(`/api/trays/${trayId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền đổi tên khay.');
  }
  const data = await res.json();
  return data.trays;
}

export async function apiSaveRecipe(recipe: CraftedRecipe): Promise<CraftedRecipe[]> {
  const res = await fetch('/api/recipes', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(recipe),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền tạo công thức kết quả.');
  }
  const data = await res.json();
  return data.recipes;
}

export async function apiUpdateRecipe(recipe: CraftedRecipe): Promise<CraftedRecipe[]> {
  const res = await fetch(`/api/recipes/${recipe.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(recipe),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền sửa trang công thức.');
  }
  const data = await res.json();
  return data.recipes;
}

export async function apiDeleteRecipe(id: string): Promise<CraftedRecipe[]> {
  const res = await fetch(`/api/recipes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền xoá công thức.');
  }
  const data = await res.json();
  return data.recipes;
}

export async function apiResetAll(): Promise<{ items: CraftItem[]; recipes: CraftedRecipe[]; trays: TrayConfig[] }> {
  const res = await fetch('/api/reset', {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Chỉ Quản trị viên mới có quyền đặt lại dữ liệu.');
  }
  return res.json();
}
