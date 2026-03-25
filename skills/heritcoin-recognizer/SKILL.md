---
name: heritcoin-recognizer
description: 识别、鉴定、估价单枚硬币、古钱币、纪念币。用户提供聊天附件图片、图片 URL 或本地图片路径，并希望返回币名、年份、国家或地区、版别、铸记、铸币工艺、品相、价格等信息时使用。一次请求只处理同一枚钱币，最多 2 张图。
---

# Heritcoin Recognizer

## 工作流

把一次识别视为“同一枚钱币的一次请求”。不要在 prompt 里手工累计图片、补图状态或语言；统一交给脚本。

1. 先在 `scripts/` 目录运行：

   ```bash
   node resolve-request.ts
   ```

2. 读取脚本返回的 JSON：
   - `status = "no_images"`：直接返回 `reply`
   - `status = "need_images"`：直接返回 `reply`
   - `status = "too_many"`：直接返回 `reply`
   - `status = "ready"`：使用返回的 `images[0]`、`images[1]` 和 `locale` 调用识别脚本

3. 仅在 `status = "ready"` 时运行：

   ```bash
   node recognize.ts <img1> <img2> --locale <locale>
   ```

   如果用户明确提供了 token，再追加：

   ```bash
   --token <token>
   ```

4. `recognize.ts` 成功时，直接把它输出的最终文本作为回复返回。

## 约束

- 不要直接用模型原生视觉识别。
- 不要绕过 `resolve-request.ts` 自己在 prompt 里重建“还差一张图”“是否是补图”“历史任务是否已完成”。
- 一次请求最多只处理 2 张同一枚钱币的图片；超过 2 张时直接返回脚本给出的拒绝文案。
- 不要改写、摘要、重排 `recognize.ts` 的成功输出；不要丢任何非空字段。
- 最终回复保持普通纯文本，不要输出 Markdown 表格、代码块或管道对齐文本。
- 字段缺失时省略，不要臆造版别、铸记、铸币工艺、品相等接口未返回字段。

## 调试

只在修改脚本、字段映射或 eval 时再读取：

- [references/runtime.md](references/runtime.md)
- [references/evaluation.md](references/evaluation.md)
