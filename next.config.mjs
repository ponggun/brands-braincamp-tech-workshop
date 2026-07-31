/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ให้ /demo เปิดหน้าเดโม 3 ชิ้นได้เลย ไม่ต้องพิมพ์ /demo/index.html
  // (QR ที่น้องสแกนหน้างานจะได้สั้น จำง่าย และพิมพ์ตามได้ถ้าสแกนไม่ติด)
  async rewrites() {
    return [
      { source: "/demo", destination: "/demo/index.html" },
      { source: "/demo/", destination: "/demo/index.html" },
    ];
  },
};

export default nextConfig;
