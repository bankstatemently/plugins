import { McpServer, type CallToolResult, type ToolAnnotations, type JsonSchemaType } from '@modelcontextprotocol/server';
export interface StdioToolDefinition {
    readonly name: string;
    readonly title?: string;
    readonly description?: string;
    readonly inputSchema: JsonSchemaType;
    readonly annotations?: ToolAnnotations;
}
/**
 * Mirrors `packages/backend/src/routes/mcp/generateStdioToolDefinitions.ts`'s
 * own `StdioPromptDefinition` (#6316) — `text` is the unrendered template
 * (`Input: <argValue>\n\n` prepended when `argKey` is set and a value is
 * given); rendering happens locally, offline, in `renderPromptText` below —
 * no network call, since a prompt is static workflow text, never user data.
 */
export interface StdioPromptDefinition {
    readonly name: string;
    readonly title?: string;
    readonly description?: string;
    readonly text: string;
    readonly argKey?: string;
    readonly argsJsonSchema?: JsonSchemaType;
}
export interface StdioToolDefinitionsFile {
    readonly version: string;
    readonly instructions: string;
    readonly authErrorResult: CallToolResult;
    readonly tools: readonly StdioToolDefinition[];
    readonly prompts: readonly StdioPromptDefinition[];
}
/**
 * A real runtime narrowing guard for the SDK's `CallToolResult` wire shape —
 * a record whose `content` is an array, with `isError` boolean or absent.
 * Deliberately looser than the SDK's own full schema validator: this
 * package runs independently and may talk to a newer/older backend, so it
 * only checks the fields this file actually reads, never over-rejecting on
 * a content-block shape it doesn't otherwise care about.
 */
export declare function isCallToolResult(value: unknown): value is CallToolResult;
/**
 * `tool-definitions.json` is a generator-produced artifact of THIS package
 * (never external/user input crossing a network boundary) but IS a file on
 * disk that can be corrupted, partially written, or stale — `isStdioToolDefinitionsFile`
 * fails loudly at startup rather than serving a broken registry silently.
 */
export declare function readToolDefinitions(definitionsPath?: string): StdioToolDefinitionsFile;
/**
 * The ONE tool handler every registered tool shares (#6105 AC3) — dispatches
 * to `POST {apiBaseUrl}/v1/tools/{name}` with `X-API-Key` when a key is
 * configured, and returns the response body's `CallToolResult` verbatim.
 * With no key, `initialize`/`tools/list` need no network (this function is
 * never called for those methods) — a `tools/call` returns the SAME
 * auth-error result the hosted server emits (`authErrorResult`, sourced from
 * `buildToolAuthErrorResult()` at generation time — one literal, not two).
 * A REST 4xx/5xx surfaces as `isError: true` (#5049: tool failures are
 * results, never thrown).
 */
export declare function callHostedTool(name: string, args: unknown, authErrorResult: CallToolResult, apiBaseUrl?: string, apiKey?: string | undefined): Promise<CallToolResult>;
export declare function buildServer(definitions: StdioToolDefinitionsFile): McpServer;
/** True when this file is the process entrypoint (`node dist/stdio.js`), not
 *  merely imported (by a test, or by another package). */
export declare function isMainModule(): boolean;
