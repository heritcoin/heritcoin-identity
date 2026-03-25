# Runtime Notes

仅在调试或修改脚本时读取本文件。

## 架构

- `resolve-request.ts`
  负责从当前 Codex session 日志重建“最后一个仍可执行的识别请求”。
  它统一处理聊天附件、显式图片 URL、本地图片路径、补图语义、任务关闭和 locale 推断。
- `recognize.ts`
  只负责接收 2 张图片和一个 locale，调用 Heritcoin 接口并输出最终纯文本结果。

## 执行顺序

1. 运行：

   ```bash
   node resolve-request.ts
   ```

2. 读取 JSON：
   - `status = "no_images"`：没有可执行图片，直接返回 `reply`
   - `status = "need_images"`：当前任务只有 1 张图，直接返回 `reply`
   - `status = "too_many"`：当前任务超过 2 张图，直接返回 `reply`
   - `status = "ready"`：当前任务正好 2 张图，继续调用 `recognize.ts`

3. 仅在 `ready` 时运行：

   ```bash
   node recognize.ts <img1> <img2> --locale <locale> [--token <token>]
   ```

## `resolve-request.ts` 输出契约

返回固定 JSON：

```json
{
  "status": "ready",
  "locale": "zh-CN",
  "images": ["/tmp/a.jpg", "/tmp/b.jpg"],
  "reply": null
}
```

说明：

- `images`
  - 聊天附件中的 `data:image/...` 会先落成临时文件路径
  - 显式 URL 直接原样返回
  - 本地路径会先展开 `~/`
- `locale`
  - 来自当前线程最近一条有实际文字内容的用户消息
  - 未识别到时回退到系统 locale
- `reply`
  - 仅在非 `ready` 状态下返回给用户

## `recognize.ts` 约束

- 不再读取 session 日志，也不再在脚本内部推断对话任务状态。
- 结果语言只取 `--locale`；如果未显式传入，则回退到系统 locale。
- 成功输出必须保持普通纯文本逐行字段。
- 脚本负责保留接口返回的全部非空字段，并把“名称/估价”排在前面，结尾追加 1 行轻量收藏建议。

## 变更规则

修改任务解析、接口调用或字段映射时，同时更新：

- [scripts/resolve-request.ts](../scripts/resolve-request.ts)
- [scripts/recognize.ts](../scripts/recognize.ts)
- [evals/evals.json](../evals/evals.json)
- 本文件
