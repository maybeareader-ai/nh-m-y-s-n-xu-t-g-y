import React, { useState } from 'react';
import { apiLoginAdmin } from '../utils/api';
import { playCraftSuccess, playItemClick } from '../utils/audio';
import { Shield, Key, X, Check, Lock } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiLoginAdmin(password.trim());
      if (result.success) {
        playCraftSuccess();
        onLoginSuccess();
        onClose();
      } else {
        setError(result.message || 'Mật khẩu quản trị viên không đúng.');
      }
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="mc-window w-full max-w-md p-5 bg-[#c6c6c6] text-gray-900 shadow-2xl relative border-4 border-[#333]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600" />
            <h2 className="font-pixel text-xl sm:text-2xl font-bold text-gray-900">
              ĐĂNG NHẬP VỚI TƯ CÁCH CHỦ PHÒNG
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-300 text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4 font-sans leading-relaxed">
          Chỉ có chủ phòng mới có quyền tạo vật phẩm, sửa khay và thêm công thức.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-sm text-gray-800 mb-1">
              Mật khẩu:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#555] text-gray-900 font-pixel text-lg focus:outline-none focus:border-amber-600"
                autoFocus
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-100 border-2 border-red-500 text-red-800 text-xs font-pixel rounded">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#555]">
            <button
              type="button"
              onClick={onClose}
              className="mc-button px-4 py-1.5 font-pixel text-base text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="mc-button-green px-5 py-1.5 font-pixel text-base text-white flex items-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Đang kiểm tra...' : 'Đăng Nhập'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
