---
title: AI 大模型 Token 与 API 计费
publishDate: 2026-08-10 15:00:00
description: 'Token 是大模型计费的基本单位。本文系统梳理 Token、输入/缓存/输出/推理 Token、上下文窗口、限流指标与完整成本框架，帮你算清一次 AI 业务的真实花销。'
tags:
  - AI
  - 大模型
  - Token
  - API计费
heroImage: { src: './thumbnail.png' }
language: '中文'
---

> **一句话理解：** Token 是模型处理内容时使用的基本计量单位。大模型 API 通常分别统计输入、缓存输入和输出 Token，再按各自单价计费；真正值得关注的不是"每百万 Token 多少钱"，而是"完成一次业务任务总共花多少钱"。

## 1. Token 是什么

模型不会直接按"汉字数""字符数"或"英文单词数"处理文本。文本会先经过 **Tokenizer（分词器）**，被切成若干 Token，再转换成 Token ID 序列交给模型。

例如：

```text
请帮我写一份请假申请。
        ↓ Tokenizer
[48392, 19283, 583, 9281, ...]
```

需要牢记：

- `Token ≠ 汉字`
- `Token ≠ 英文单词`
- `Token ≠ 字符`
- 相同文本在不同模型、不同 Tokenizer 下，Token 数可能不同
- JSON、代码、Base64、随机字符串通常比自然语言更耗 Token
- `len(text)` 统计的是字符或字符串长度，不能代替 Token 计数

一些粗略估算只能用于预算，不能用于结算：

| 内容 | 粗略 Token 数 |
|---|---:|
| 1 个英文单词 | 约 1～2 Token |
| 1000 个英文单词 | 约 1300～1800 Token |
| 1 个汉字 | 约 0.5～2 Token |
| 1000 个汉字 | 约 600～1500 Token |

> **准确计数：** 真正计费应以 API 返回的 `usage` 为准；调用前需要估算时，应使用目标模型对应的 Tokenizer。

## 2. 为什么按 Token 收费

Token 可以近似表示模型处理了多少内容。阅读十万字合同再总结，显然比回答一句短问题需要更多计算，因此厂商通常按下面的单位报价：

```text
$/1M tokens
元 / 百万 Token
```

这与云服务器按小时、对象存储按 GB 计费类似。

## 3. 一次请求包含哪些 Token

用户发出的那句话，通常只占输入的一小部分。一次 Agent 请求的输入可能包括：

```text
System Prompt
+ Developer Prompt
+ 用户消息
+ 历史聊天记录
+ 工具定义与 JSON Schema
+ RAG 检索文档
+ 之前的工具返回结果
= Input Tokens
```

例如：

| 输入组成 | Token 数 |
|---|---:|
| System Prompt | 2,000 |
| 工具定义 | 3,000 |
| 历史消息 | 4,000 |
| RAG 文档 | 5,000 |
| 用户问题 | 20 |
| **总输入** | **14,020** |

即使用户只输入了 20 Token，本次请求仍可能产生 14,020 个输入 Token。

## 4. 基本计费公式

多数文本模型至少区分：

- **Input Tokens**：模型读入的内容
- **Output Tokens**：模型生成的内容

输出通常比输入贵，因为模型要以自回归方式逐个预测输出 Token。生成下一个 Token 时，还要结合输入和此前已经生成的内容继续计算。

最基本的费用公式为：

$$
Cost = \frac{InputTokens}{1{,}000{,}000} \times InputPrice
+ \frac{OutputTokens}{1{,}000{,}000} \times OutputPrice
$$

假设模型价格为：

```text
输入：$2 / 1M Token
输出：$10 / 1M Token
```

一次调用使用 100,000 输入 Token、20,000 输出 Token：

```text
输入费用 = 100,000 / 1,000,000 × $2  = $0.20
输出费用 =  20,000 / 1,000,000 × $10 = $0.20
总费用   = $0.40
```

## 5. 上下文窗口与长对话

### Context Window

`128K Context`、`200K Context` 或 `1M Context` 表示模型一次最多能看到的 Token 总量。这个总量通常需要同时容纳：

```text
输入内容 + 聊天历史 + 工具结果 + 模型输出
```

因此，支持 128K 上下文不等于可以输入完整的 128K，还要给输出预留空间。上下文上限也不等于固定费用：模型支持 1M Context，但实际只使用 10,000 Token，通常只按实际用量收费。

### 为什么越聊越贵

许多聊天 API 每一轮都会重新发送必要的历史消息：

```text
第 1 轮处理 1,000 Token
第 2 轮处理 2,000 Token
第 3 轮处理 3,000 Token
第 4 轮处理 4,000 Token
累计处理 10,000 Token
```

虽然最终对话内容只有约 4,000 Token，但历史内容被多次读入，累计计费输入可能达到 10,000 Token。

## 6. Cached Tokens：重复输入的缓存

Agent 往往包含很大的固定内容，例如 System Prompt、业务规则和工具 Schema。如果这些前缀在多次请求中完全一致，部分厂商可以通过 Prompt Cache 复用计算结果，并以更低的缓存输入价格计费。

带缓存的公式为：

$$
Cost = \frac{UncachedInput}{1M} \times InputPrice
+ \frac{CachedInput}{1M} \times CachePrice
+ \frac{Output}{1M} \times OutputPrice
$$

假设：

```text
普通输入：$2.00 / 1M
缓存输入：$0.20 / 1M
输出：    $8.00 / 1M

普通输入： 5,000 Token
缓存输入：15,000 Token
输出：     1,000 Token
```

则：

```text
普通输入 =  5,000 / 1M × $2.00 = $0.010
缓存输入 = 15,000 / 1M × $0.20 = $0.003
输出     =  1,000 / 1M × $8.00 = $0.008
总费用   = $0.021 / 次
```

缓存优化的常见做法：

- 把稳定、重复的内容放在 Prompt 前部
- 避免在固定前缀中加入时间戳、随机 ID 等动态内容
- 减少不必要的 Prompt 变体
- 监控 `cached_tokens` 和 Cache Hit Rate

> **厂商差异：** 缓存的命中条件、最小长度、有效期和价格都由具体厂商决定，不能假设所有模型都采用同一规则。

## 7. Reasoning Tokens：内部推理消耗

推理模型在给出最终答案前，可能进行分析、规划、验证和计算。这些内部计算可被记录为 **Reasoning Tokens**。

```json
{
  "input_tokens": 1000,
  "output_tokens": 500,
  "output_tokens_details": {
    "reasoning_tokens": 300
  }
}
```

"用户看不见"不等于"不计费"。最终答案可能只有几个 Token，但模型内部可能使用了大量推理 Token。不同厂商可能将它计入输出 Token、单独统计，或采用其他方式，必须查看对应模型的官方价格与 usage 定义。

## 8. Agent 中常见的隐藏成本

### 工具定义

函数名、描述、参数和 JSON Schema 都要提供给模型，因此属于输入 Token。若有 30 个工具，每个平均 500 Token，仅工具定义就可能占 15,000 Token。

工具不是越多越好。应按场景只提供可能用到的工具，或采用分层路由。

### RAG

向量检索本身不一定贵，但检索出的原文送入模型后会产生输入 Token。RAG 优化目标不是"召回越多越好"，而是召回最相关、最少且足够回答问题的内容。

### Embedding

知识库文本向量化通常按输入 Token 计费：

- 首次把资料转成向量属于索引阶段成本
- 内容未变化时通常不需要重复向量化
- 每次查询还需要把用户问题做一次 Embedding

### 图片、PDF 和语音

- **图片**：通常经过缩放、切片和视觉编码，消耗取决于尺寸、分辨率、模型和 `detail` 等设置，文件 MB 数不能直接换算成 Token
- **PDF**：纯文本 PDF 可能按提取后的文字计费；扫描版或视觉读取可能产生视觉 Token
- **语音**：有些服务按分钟收费，有些区分 Audio Input/Output Tokens

多模态计价差异很大，应以具体 API 文档和返回的 usage 为准。

## 9. API usage：结算与监控依据

典型返回示例：

```json
{
  "usage": {
    "input_tokens": 12583,
    "output_tokens": 932,
    "total_tokens": 13515,
    "input_tokens_details": {
      "cached_tokens": 10000
    },
    "output_tokens_details": {
      "reasoning_tokens": 500
    }
  }
}
```

字段名称会随厂商和 API 不同而变化，但 `usage` 是进行成本监控、账单核对和架构优化的核心数据。

## 10. 限流指标不是价格

| 指标 | 含义 |
|---|---|
| RPM | Requests Per Minute，每分钟请求数 |
| TPM | Tokens Per Minute，每分钟 Token 数 |
| RPD | Requests Per Day，每日请求数 |
| TPD | Tokens Per Day，每日 Token 数 |

假设 `TPM = 1,000,000`，每次请求平均使用 10,000 Token，那么理论上最多只能处理约 100 次/分钟。即使 `RPM = 1000`，也会先达到 TPM 上限。

`429 Too Many Requests` 可能表示：

- RPM 超限
- TPM 超限
- 套餐或账户配额耗尽
- 服务端对并发或其他资源进行了限制

因此遇到 429 时要查看错误码、响应体和响应头，不能只凭 HTTP 状态码断定原因。

## 11. 几个容易误解的参数

### `max_output_tokens`

它表示"最多允许输出多少 Token"，不是"预先按这个数量收费"。设置为 4096，而模型实际只输出 300 Token，通常按实际输出量计费。

### `temperature`、`top_p` 等

这些采样参数通常不直接改变 Token 单价，但可能间接改变回答长度、重试次数和最终 Token 用量。

### 模型规模

旗舰模型通常比 Mini、Flash、Haiku、Nano 等小模型昂贵。分类、字段提取、简单 JSON、改写和关键词提取等任务，往往可以先评估小模型是否足够。

## 12. 企业应计算 Cost Per Task

一次"申请明天下午年假"的业务可能包含多次模型调用：

```text
调用 1：意图识别与字段提取
调用 2：规则判断与工具选择
调用 3：确认内容与结果反馈
```

假设三次调用合计：

```text
Input  = 24,000 Token
Output =  1,700 Token
```

这才是完成一次请假业务的真实 LLM 用量。企业更应该记录：

- 一次请假、报销、合同分析的平均成本
- 平均 Input、Cached Input、Output 和 Reasoning Token
- P50、P95 Token 用量与响应时延
- Cache Hit Rate
- 每用户日均 AI Cost
- 每类任务的成功率、重试率和 Cost Per Successful Task

## 13. 完整成本框架

一个 AI 系统的总成本可能包括：

```text
AI Cost
= Input Token Cost
+ Cached Token Cost
+ Output Token Cost
+ Reasoning Cost
+ Embedding Cost
+ Image / Audio Cost
+ 搜索、数据库、OCR 等外部工具成本
+ 重试与失败调用成本
```

## 14. 降低 Token 成本的实用方法

1. 压缩过长的 System Prompt，删除重复规则和无效示例。
2. 长对话定期摘要，只保留完成当前任务所需的历史信息。
3. 工具按场景动态加载，避免每次发送全部 Schema。
4. RAG 控制召回数量和片段长度，先去重再拼接。
5. 稳定 Prompt 前缀以提高缓存命中率。
6. 设置合理的 `max_output_tokens`，并在提示词中约束回答长度。
7. 简单任务使用更便宜的小模型，复杂任务再升级到旗舰或推理模型。
8. 从 API `usage` 记录实际用量，不用字符数代替 Token 数。
9. 以业务任务为单位统计多次调用、工具和重试的总成本。

## 15. 术语速查

| 概念 | 通俗理解 |
|---|---|
| Token | 模型处理内容的基本计量单位 |
| Tokenizer | 把内容切分并转换为 Token ID 的工具 |
| Input Token | 模型读入的内容 |
| Output Token | 模型生成的内容 |
| Cached Token | 命中缓存的重复输入，通常更便宜 |
| Reasoning Token | 推理模型内部用于分析和推导的 Token |
| Context Window | 一次请求中模型最多能看到的 Token 总量 |
| Max Output Tokens | 一次最多允许生成的 Token 数 |
| `$/1M Token` | 每 100 万 Token 的价格 |
| RPM / TPM | 每分钟请求数 / Token 数限制 |
| Embedding Token | 文本向量化时消耗的 Token |
| Vision / Audio Token | 图片或音频编码后的计量单位 |
| Prompt Cache | 复用重复 Prompt 计算结果的机制 |
| Usage | API 返回的实际 Token 使用统计 |

## 最后记住 6 点

1. **Token 不是字数。**
2. **用户消息不是全部输入。** Prompt、历史、Tools 和 RAG 都算。
3. **输出通常比输入贵。** 不需要长回答时应主动限制长度。
4. **长对话会越来越贵。** 因为历史内容可能被反复发送。
5. **Agent 的隐藏消耗常来自 Tools、Prompt 和 RAG。**
6. **真正要优化的是完成一次业务任务的总成本。**
