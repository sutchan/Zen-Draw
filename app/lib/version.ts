// app/lib/version.ts v5.7.10 —— 应用版本单一事实来源
// 与 package.json 的 version 字段保持一致；页脚等 UI 从此处读取，避免硬编码漂移。
export const APP_VERSION = "5.7.10";

// 构建标识由 next.config.ts 在构建期注入（10 位 yymmddhhmm），非法或缺失时留空以便回退
const RAW_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? "";
export const BUILD_ID = /^\d{10}$/.test(RAW_BUILD_ID) ? RAW_BUILD_ID : "";

// 页脚唯一展示位：V主.次.修 · build yymmddhhmm；注入缺失时仅展示版本号
export const FOOTER_VERSION = BUILD_ID
  ? `V${APP_VERSION} · build ${BUILD_ID}`
  : `V${APP_VERSION}`;

