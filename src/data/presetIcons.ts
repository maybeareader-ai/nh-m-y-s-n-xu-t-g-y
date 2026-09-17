// Crisp pixel art SVG icons for Minecraft items with sharp pixel rendering

export interface PresetItemIcon {
  id: string;
  name: string;
  category: 'mineral' | 'magic' | 'weapon' | 'element';
  svg: string;
}

export const PRESET_ICONS: PresetItemIcon[] = [
  {
    id: 'diamond',
    name: 'Kim Cương',
    category: 'mineral',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%232cbaaa" d="M6 3h4v1H6zM4 4h8v2H4zM3 6h10v2H3zM4 8h8v2H4zM5 10h6v2H5zM7 12h2v1H7z"/><path fill="%23bbf6ed" d="M6 4h3v1H6zM5 5h2v1H5zM4 6h2v2H4zM6 8h1v1H6z"/><path fill="%23177771" d="M9 5h3v1H9zM10 6h3v2h-3zM8 8h4v2H8zM7 10h4v2H7z"/></svg>`,
  },
  {
    id: 'netherite',
    name: 'Thỏi Netherite',
    category: 'mineral',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%23473f3d" d="M4 6h8v6H4z"/><path fill="%232f2826" d="M3 7h10v4H3zM4 11h8v2H4z"/><path fill="%235a514d" d="M5 5h6v1H5zM5 7h5v2H5z"/><path fill="%237b716c" d="M5 6h4v1H5zM6 8h2v1H6z"/></svg>`,
  },
  {
    id: 'redstone',
    name: 'Bụi Redstone',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%23a80f01" d="M4 7h8v5H4zM7 4h2v8H7z"/><path fill="%23ff3a2d" d="M5 8h4v2H5zM7 5h2v2H7z"/><path fill="%236e0500" d="M3 9h10v2H3zM5 11h6v2H5z"/><circle cx="7" cy="8" r="1" fill="%23ffc5c2"/></svg>`,
  },
  {
    id: 'emerald',
    name: 'Ngọc Lục Bảo',
    category: 'mineral',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%2317dd62" d="M5 3h6v10H5zM4 5h8v6H4z"/><path fill="%2385f5aa" d="M6 4h4v2H6zM5 6h2v3H5z"/><path fill="%230b7e36" d="M9 6h2v4H9zM7 10h4v2H7z"/></svg>`,
  },
  {
    id: 'ender_pearl',
    name: 'Ngọc Ender',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><circle cx="8" cy="8" r="6" fill="%23083e37"/><circle cx="8" cy="8" r="4" fill="%231b796d"/><ellipse cx="7" cy="7" rx="2" ry="2" fill="%2339d3c3"/><ellipse cx="6" cy="6" rx="1" ry="1" fill="%23b6fbf2"/></svg>`,
  },
  {
    id: 'blaze_rod',
    name: 'Que Lửa Blaze',
    category: 'element',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path stroke="%23e85f00" stroke-width="2" d="M4 12L12 4"/><path stroke="%23ffc800" stroke-width="1.5" d="M4 12L12 4"/><circle cx="11" cy="5" r="1.5" fill="%23ffea85"/><circle cx="5" cy="11" r="1.5" fill="%23ff8c00"/><circle cx="8" cy="8" r="2" fill="%23ffb200"/></svg>`,
  },
  {
    id: 'golden_apple',
    name: 'Táo Vàng Ma Thuật',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%23533816" d="M8 2h2v2H8z"/><path fill="%23ecc026" d="M5 4h6v9H5zM4 6h8v5H4z"/><path fill="%23fff58f" d="M6 5h2v2H6zM5 7h2v2H5z"/><path fill="%23ab7f00" d="M8 10h4v2H8zM10 7h2v4h-2z"/></svg>`,
  },
  {
    id: 'enchanted_book',
    name: 'Sách Phù Phép',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%23842c16" d="M3 3h9v10H3z"/><path fill="%23e1b782" d="M12 4h1v8h-1z"/><path fill="%239c36ba" d="M3 8h10v2H3zM7 3h2v10H7z"/><path fill="%23d664f7" d="M7 8h2v2H7z"/><rect x="5" y="5" width="2" height="2" fill="%23ffde59"/></svg>`,
  },
  {
    id: 'amethyst',
    name: 'Mảnh Thạch Anh Tím',
    category: 'mineral',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%238549bd" d="M7 2h2v3H7zM5 5h6v3H5zM4 8h8v3H4zM6 11h4v3H6z"/><path fill="%23c295f1" d="M6 5h2v4H6zM5 8h2v3H5z"/><path fill="%234d1c80" d="M9 6h2v4H9zM8 10h2v2H8z"/></svg>`,
  },
  {
    id: 'ice_crystal',
    name: 'Tinh Thể Băng Vĩnh Cửu',
    category: 'element',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%237fe3ff" d="M7 1h2v14H7zM1 7h14v2H1z"/><path fill="%23b8f2ff" d="M3 3h3v3H3zM10 3h3v3h-3zM3 10h3v3H3zM10 10h3v3h-3z"/><circle cx="8" cy="8" r="2" fill="%23ffffff"/></svg>`,
  },
  {
    id: 'fire_sword',
    name: 'Thanh Kiếm Lửa',
    category: 'weapon',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path stroke="%23ff3a00" stroke-width="2" d="M5 11L13 3"/><path stroke="%23ffd530" stroke-width="1.2" d="M6 10L12 4"/><path fill="%23533816" d="M3 13h2v-2H3zM2 14h2v-2H2z"/><path fill="%23a07038" d="M4 11h3v1H4zM3 12h1v3H3z"/></svg>`,
  },
  {
    id: 'frost_sword',
    name: 'Kiếm Băng Cực Hàn',
    category: 'weapon',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path stroke="%2352d1ff" stroke-width="2.5" d="M5 11L13 3"/><path stroke="%23ffffff" stroke-width="1.2" d="M6 10L12 4"/><path fill="%232c4558" d="M3 13h2v-2H3zM2 14h2v-2H2z"/><path fill="%230095d9" d="M4 11h3v1H4zM3 12h1v3H3z"/></svg>`,
  },
  {
    id: 'nether_star',
    name: 'Sao Địa Ngục',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%23f6f3cc" d="M7 2h2v12H7zM2 7h12v2H2z"/><path fill="%23ffffff" d="M5 5h6v6H5z"/><circle cx="8" cy="8" r="2.5" fill="%23ffe46b"/><circle cx="8" cy="8" r="1" fill="%23ffffff"/></svg>`,
  },
  {
    id: 'teleporter',
    name: 'Bộ Dịch Chuyển Không Gian',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><rect x="3" y="3" width="10" height="10" rx="1" fill="%231a1a24" stroke="%23ff2a2a" stroke-width="1"/><circle cx="8" cy="8" r="3" fill="%2313a89e"/><circle cx="8" cy="8" r="1.5" fill="%23a4fff8"/></svg>`,
  },
  {
    id: 'potion',
    name: 'Bình Độc Dược Cổ Đại',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%237e5d3b" d="M7 2h2v2H7z"/><path fill="%23bfdbfe" d="M6 4h4v2H6z"/><path fill="%239333ea" d="M4 7h8v6H4zM5 6h6v1H5z"/><path fill="%23c084fc" d="M5 9h3v2H5z"/><circle cx="9" cy="11" r="1" fill="%23f3e8ff"/></svg>`,
  },
  {
    id: 'totem',
    name: 'Vật Tổ Bất Tử',
    category: 'magic',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="none"/><path fill="%23eab308" d="M5 3h6v4H5zM3 6h10v3H3zM6 7h4v7H6z"/><path fill="%2322c55e" d="M6 4h1v1H6zM9 4h1v1H9z"/><circle cx="8" cy="9" r="1.5" fill="%23f97316"/></svg>`,
  }
];

export function getIconById(id?: string): string {
  if (!id) return PRESET_ICONS[0].svg;
  const found = PRESET_ICONS.find((icon) => icon.id === id);
  return found ? found.svg : id;
}
