# 连接cloudflare d1数据库的SQL查询API，支持HTTP和WebSocket两种连接方式

## 主要功能

1. 支持多数据库连接
2. 安全凭证，验证用户名密码
3. WebSocket和HTTP方式

## 部署方法

1. Fork本仓库
2. 修改wrangler.jsonc，设置参数：用户名（USERNAME）和密码 （PASSWORD）
3. 修改参数：（d1_databases），支持绑定多个d1数据库
4. 创建workers部署即可

## 请求地址

1. WebSocket链接：wss://your-worker.workers.dev/ws
2. HTTP链接：https://your-worker.workers.dev/api，POST请求

## 请求响应体

### 1、请求体

```json
{
  "username":"root",
  "password":"root",
  "database":"d1_test",
  "sql": "SELECT * FROM table1 LIMIT 10",
  "params": []
}
```

或者

```json
{
  "username":"root",
  "password":"root",
  "database":"d1_test",
  "sql": "SELECT * FROM table1 WHERE name = ? OR name = ?",
  "params": ["test", "测试"]
}
```

### 2、响应体

```json
{
  "success": true,
  "meta": {
    "served_by": "v3-prod",
    "served_by_region": "APAC",
    "served_by_colo": "SIN",
    "served_by_primary": true,
    "timings": {
      "sql_duration_ms": 0.2807
    },
    "duration": 0.2807,
    "changes": 0,
    "last_row_id": 0,
    "changed_db": false,
    "size_after": 16384,
    "rows_read": 2,
    "rows_written": 0,
    "total_attempts": 1
  },
  "results": [
    {
      "name": "test",
      "description": "this is test"
    },
    {
      "name": "测试",
      "description": "这是测试"
    }
  ]
}
```
