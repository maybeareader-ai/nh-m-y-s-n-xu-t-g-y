import React, { useState } from 'react';
import { apiChangePassword } from '../utils/api';
import { KeyRound, X, Check } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPass: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setError('Mật khẩu mới phải từ 4 ký tự trở lên.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiChangePassword(newPassword.trim());
      if (res.success) {
        onSuccess(newPassword.trim());
        onClose();
      } else {
        setError(res.message || 'Không thể đổi mật khẩu.');
      }
    } catch {
      setError('Lỗi khi cập nhật mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="mc-window w-full max-w-md p-5 bg-[#c6c6c6] text-gray-900 shadow-2xl relative border-4 border-[#333]">
        <div className="flex items-center justify-between border-b-2 border-[#555] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-700" />
            <h2 className="font-pixel text-xl font-bold text-gray-900">
              ĐỔI MẬT KHẨU CHỦ PHÒNG
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixel text-sm text-gray-800 mb-1">
              Mật khẩu mới:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới..."
              className="w-full px-3 py-2 bg-white border-2 border-[#555] text-gray-900 font-pixel text-base focus:outline-none focus:border-purple-600"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-pixel text-sm text-gray-800 mb-1">
              Nhập lại mật khẩu mới:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận lại..."
              className="w-full px-3 py-2 bg-white border-2 border-[#555] text-gray-900 font-pixel text-base focus:outline-none focus:border-purple-600"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-100 border border-red-500 text-red-800 text-xs font-pixel rounded">
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
              <Check className="w-4 h-4" />
              <span>{loading ? 'Đang lưu...' : 'Lưu Mật Khẩu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
