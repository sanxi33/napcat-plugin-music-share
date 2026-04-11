var EventType = ((EventType2) => {
  EventType2.MESSAGE = "message";
  return EventType2;
})(EventType || {});

const DEFAULT_CONFIG = {
  enabled: true,
  commandPrefix: "球鳖",
  requestTimeoutMs: 8000
};

export let plugin_config_ui = [];
let currentConfig = { ...DEFAULT_CONFIG };
let logger = null;

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function sanitizeConfig(raw) {
  if (!isObject(raw)) return { ...DEFAULT_CONFIG };
  const out = { ...DEFAULT_CONFIG, ...raw };
  out.enabled = Boolean(out.enabled);
  out.commandPrefix = String(out.commandPrefix || "").trim();
  const timeout = Number(out.requestTimeoutMs);
  out.requestTimeoutMs = Number.isFinite(timeout)
    ? Math.max(1000, Math.min(30000, timeout))
    : DEFAULT_CONFIG.requestTimeoutMs;
  return out;
}

function stripPrefix(text) {
  const trimmed = String(text || "").trim();
  if (!currentConfig.commandPrefix) return trimmed;
  if (trimmed.startsWith(currentConfig.commandPrefix)) {
    return trimmed.slice(currentConfig.commandPrefix.length).trim();
  }
  return trimmed;
}

function normalizeText(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[！!。,.，？?；;：:“”"'`~·]/g, "")
    .replace(/\s+/g, "");
}

function extractByKeywords(text, keywords) {
  const raw = String(text || "").trim();
  const compact = raw.replace(/\s+/g, "");
  for (const keyword of keywords) {
    const compactIndex = compact.indexOf(keyword);
    if (compactIndex >= 0) {
      const rawIndex = raw.indexOf(keyword);
      if (rawIndex >= 0) return raw.slice(rawIndex + keyword.length).trim();
    }
  }
  return "";
}

async function withTimeoutFetch(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), currentConfig.requestTimeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function searchSong(keyword) {
  const url = `https://music.163.com/api/search/get/web?type=1&offset=0&limit=1&s=${encodeURIComponent(keyword)}`;
  const response = await withTimeoutFetch(url, {
    method: "GET",
    headers: {
      Referer: "https://music.163.com/"
    }
  });
  if (!response.ok) throw new Error(`search_failed_${response.status}`);

  const data = await response.json();
  const song = data?.result?.songs?.[0];
  if (!song) return null;

  return {
    id: String(song.id),
    name: String(song.name || ""),
    artist: String(song.artists?.[0]?.name || "未知歌手")
  };
}

async function fetchLyric(songId) {
  const url = `https://music.163.com/api/song/lyric?id=${encodeURIComponent(songId)}&lv=-1&kv=-1&tv=-1`;
  const response = await withTimeoutFetch(url, {
    method: "GET",
    headers: {
      Referer: "https://music.163.com/"
    }
  });
  if (!response.ok) throw new Error(`lyric_failed_${response.status}`);

  const data = await response.json();
  const lyric = String(data?.lrc?.lyric || "").trim();
  return lyric || null;
}

function buildMusicCQ(song) {
  return `[CQ:music,type=163,id=${song.id}]`;
}

async function sendMsg(ctx, event, message) {
  const params = {
    message,
    message_type: event.message_type,
    ...(event.message_type === "group" && event.group_id ? { group_id: String(event.group_id) } : {}),
    ...(event.message_type === "private" && event.user_id ? { user_id: String(event.user_id) } : {})
  };
  await ctx.actions.call("send_msg", params, ctx.adapterName, ctx.pluginManager.config);
}

function parseCommand(rawText) {
  const text = stripPrefix(rawText);
  const normalized = normalizeText(text);

  const musicKeys = ["点歌", "来首", "来一首", "播一首", "放一首", "播放"];
  const lyricKeys = ["查看歌词", "歌词", "查歌词", "搜歌词"];

  const hasMusic = musicKeys.some((keyword) => normalized.includes(keyword));
  const hasLyric = lyricKeys.some((keyword) => normalized.includes(keyword));

  if (!hasMusic && !hasLyric) return null;

  if (hasLyric) {
    return { type: "lyric", keyword: extractByKeywords(text, lyricKeys) };
  }

  return { type: "music", keyword: extractByKeywords(text, musicKeys) };
}

export const plugin_init = async (ctx) => {
  logger = ctx.logger;
  plugin_config_ui = ctx.NapCatConfig.combine(
    ctx.NapCatConfig.boolean("enabled", "启用插件", true, "总开关"),
    ctx.NapCatConfig.text("commandPrefix", "命令前缀", "球鳖", "例如：球鳖 点歌 稻香；留空表示无前缀"),
    ctx.NapCatConfig.number("requestTimeoutMs", "请求超时(ms)", 8000, "1000-30000")
  );

  try {
    if (ctx.configPath) {
      const fs = await import("fs");
      if (fs.existsSync(ctx.configPath)) {
        const saved = JSON.parse(fs.readFileSync(ctx.configPath, "utf-8"));
        currentConfig = sanitizeConfig(saved);
      }
    }
  } catch (error) {
    logger?.warn("music-share 加载配置失败，使用默认值", error);
  }

  logger?.info("music-share 已初始化");
};

export const plugin_onmessage = async (ctx, event) => {
  if (!currentConfig.enabled) return;
  if (event.post_type !== EventType.MESSAGE) return;

  const rawMessage = String(event.raw_message || "").trim();
  if (!rawMessage) return;

  const command = parseCommand(rawMessage);
  if (!command) return;

  if (!command.keyword) {
    await sendMsg(
      ctx,
      event,
      command.type === "music"
        ? "要点啥歌呀？示例：球鳖 点歌 稻香"
        : "要查哪首歌的歌词？示例：球鳖 查看歌词 稻香"
    );
    return;
  }

  try {
    const song = await searchSong(command.keyword);
    if (!song) {
      await sendMsg(ctx, event, "没找到这首歌，换个关键词试试～");
      return;
    }

    if (command.type === "music") {
      await sendMsg(ctx, event, buildMusicCQ(song));
      return;
    }

    const lyric = await fetchLyric(song.id);
    if (!lyric) {
      await sendMsg(ctx, event, `《${song.name}》暂时没抓到歌词`);
      return;
    }

    const preview = lyric.length > 1800
      ? `${lyric.slice(0, 1800)}\n\n（歌词过长，已截断）`
      : lyric;
    await sendMsg(ctx, event, `《${song.name}》- ${song.artist}\n\n${preview}`);
  } catch (error) {
    logger?.error("music-share 处理失败", error);
    await sendMsg(ctx, event, "点歌服务开小差了，稍后再试试");
  }
};

export const plugin_get_config = async () => currentConfig;
export const plugin_on_config_change = async (ctx, ui, key, value, current) => {
  currentConfig = sanitizeConfig(current);
};
export const plugin_onevent = async () => {};
export const plugin_cleanup = async () => {};
