export default {
    async fetch(request, env, ctx) {
        try {
            let { pathname } = new URL(request.url);
            let result;

            if (pathname === "/api" && request.method === "POST") { // HTTP连接方式 
                // 获取POST参数
                let { username, password, database, sql, params } = await request.json();

                // 鉴权验证并查询
                result = await authAndQuery(env, username, password, database, sql, params);

                // 返回SQL结果
                return Response.json(result);
            } else if (pathname === "/ws" && request.headers.get("Upgrade") === "websocket") { // WebSocket连接方式 
                let [client, server] = Object.values(new WebSocketPair());
                server.accept();

                // 监听消息
                server.addEventListener("message", async (event) => {
                    // 获取消息参数
                    let { username, password, database, sql, params } = JSON.parse(event.data);

                    // 鉴权验证并查询
                    result = await authAndQuery(env, username, password, database, sql, params);

                    // 给客户端发送消息
                    server.send(JSON.stringify(result));
                });

                // 持续监听
                return new Response(null, {
                    status: 101,
                    webSocket: client
                });
            }
        } catch (e) {
        }

        // 返回404
        return new Response("", {
            status: 404,
        });
    },
};

async function authAndQuery(env, username, password, database, sql, params) {
    let json;

    try {
        // 判断用户名密码是否正确
        if (username !== env.USERNAME || password !== env.PASSWORD) {
            return {
                "error": "用户名或密码无效",
            };
        }

        // 判断数据库是否绑定
        let binding_key = Object.keys(env).find(
            (key) => key.toLowerCase() === database.toLowerCase()
        );
        let d1_db = binding_key ? env[binding_key] : null;
        if (!d1_db) {
            return {
                "error": "数据库不存在",
            };
        }

        // 执行d1数据库SQL查询
        json = await d1_db.prepare(sql).bind(...params || []).all();
    } catch (e) {
        // 捕获错误信息
        json = {
            "error": e.message,
        };
    }

    return json;
}