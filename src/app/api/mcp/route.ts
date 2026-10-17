import { callTool, tools } from "@/site/mcp-tools";

/**
 * A read-only MCP server over streamable HTTP (stateless JSON responses).
 * Connect with: claude mcp add --transport http textlab <site>/api/mcp
 */
const PROTOCOL = "2025-06-18";

type RpcRequest = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, GET, OPTIONS",
  "access-control-allow-headers": "content-type, mcp-protocol-version, mcp-session-id, authorization",
};

async function handle(message: RpcRequest) {
  const { id, method, params = {} } = message;
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id, result });
  const fail = (code: number, msg: string) => ({ jsonrpc: "2.0", id, error: { code, message: msg } });

  switch (method) {
    case "initialize":
      return ok({
        protocolVersion: typeof params.protocolVersion === "string" ? params.protocolVersion : PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "textlab", version: "1.0.0" },
        instructions: "Textlab is a library of React text effects. Search by intent, read get_component before using one, install with get_install_command.",
      });
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools });
    case "tools/call":
      try {
        return ok(await callTool(String(params.name), (params.arguments ?? {}) as Record<string, unknown>));
      } catch (error) {
        return fail(-32603, error instanceof Error ? error.message : "Tool failed");
      }
    default:
      if (method.startsWith("notifications/")) return null;
      return fail(-32601, `Method not found: ${method}`);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400, headers: cors });
  }
  const batch = Array.isArray(body);
  const messages = (batch ? body : [body]) as RpcRequest[];
  const results = (await Promise.all(messages.map(handle))).filter(Boolean);
  if (!results.length) return new Response(null, { status: 202, headers: cors });
  return Response.json(batch ? results : results[0], { headers: cors });
}

export function GET() {
  return new Response("Textlab MCP server. POST JSON-RPC here; streaming over GET is not offered.", { status: 405, headers: { ...cors, allow: "POST, OPTIONS" } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}
