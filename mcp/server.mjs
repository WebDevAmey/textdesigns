#!/usr/bin/env node
/**
 * Textlab MCP over stdio, for clients that cannot speak HTTP.
 * It forwards each JSON-RPC message to the hosted server.
 *   claude mcp add textlab -- node mcp/server.mjs
 * Set TEXTLAB_URL to point at another deployment, for example http://localhost:3000.
 */
import { createInterface } from "node:readline";

const base = (process.env.TEXTLAB_URL ?? "https://textlab.dev").replace(/\/$/, "");
const endpoint = `${base}/api/mcp`;

const write = (message) => process.stdout.write(JSON.stringify(message) + "\n");

createInterface({ input: process.stdin }).on("line", async (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return write({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(message) });
    if (response.status === 202) return;
    write(await response.json());
  } catch (error) {
    if (message.id !== undefined) write({ jsonrpc: "2.0", id: message.id, error: { code: -32603, message: `Could not reach ${endpoint}: ${error.message}` } });
  }
});
