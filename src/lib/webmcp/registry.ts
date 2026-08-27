import { WebMCPToolDefinition } from './types';
import { studentTools } from './tools/studentTools';
import { instructorTools } from './tools/instructorTools';
import { eventBus } from './eventBus';
import { lmsClient } from '../lms/lmsClient';
import { UserRole } from '../../types/lms';

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: {
        name: string;
        description: string;
        inputSchema: Record<string, unknown>;
        execute: (args: any) => Promise<unknown>;
      }) => void;
      unregisterTool?: (name: string) => void;
      listTools?: () => unknown[];
    };
  }
  interface Window {
    modelContext?: Document['modelContext'];
    __MOODLE_WEBMCP_REGISTERED_TOOLS__?: Map<string, WebMCPToolDefinition>;
  }
}

export class WebMCPRegistry {
  private registeredTools = new Map<string, WebMCPToolDefinition>();
  private currentRole: UserRole | null = null;
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (typeof document !== 'undefined' && !document.modelContext) {
      const mockStore = new Map<string, unknown>();
      document.modelContext = {
        registerTool: (tool) => {
          mockStore.set(tool.name, tool);
          console.log(`[WebMCP Polyfill] Registered tool: ${tool.name}`);
        },
        unregisterTool: (name) => {
          mockStore.delete(name);
          console.log(`[WebMCP Polyfill] Unregistered tool: ${name}`);
        },
        listTools: () => Array.from(mockStore.values())
      };
    }

    const role = lmsClient.getActivePersona().role;
    this.syncToolsForRole(role);
  }

  public syncToolsForRole(role: UserRole): void {
    this.currentRole = role;
    this.registeredTools.clear();

    const toolsToRegister: WebMCPToolDefinition[] = role === 'instructor' 
      ? [...studentTools, ...instructorTools]
      : [...studentTools];

    for (const tool of toolsToRegister) {
      this.registerTool(tool);
    }

    if (typeof window !== 'undefined') {
      window.__MOODLE_WEBMCP_REGISTERED_TOOLS__ = this.registeredTools;
    }
  }

  private registerTool(tool: WebMCPToolDefinition): void {
    const wrappedExecute = async (args: any) => {
      const eventId = Math.random().toString(36).slice(2, 9);
      const startTime = performance.now();

      eventBus.emit({
        id: eventId,
        timestamp: new Date().toLocaleTimeString(),
        toolName: tool.name,
        role: this.currentRole || 'student',
        status: 'running',
        args: args || {}
      });

      try {
        const result = await tool.execute(args);
        const elapsed = Math.round(performance.now() - startTime);

        let summary = 'Success';
        if (result && typeof result === 'object') {
          const resObj = result as Record<string, unknown>;
          if (resObj.count !== undefined) summary = `${resObj.count} items returned`;
          else if (resObj.percentageScore !== undefined) summary = `Score: ${resObj.percentageScore}%`;
          else if (resObj.status) summary = `Status: ${resObj.status}`;
          else if (resObj.title) summary = `"${resObj.title}"`;
        }

        eventBus.emit({
          id: eventId,
          timestamp: new Date().toLocaleTimeString(),
          toolName: tool.name,
          role: this.currentRole || 'student',
          status: 'success',
          args: args || {},
          resultSummary: summary,
          fullResult: result,
          executionTimeMs: elapsed
        });

        return result;
      } catch (err: any) {
        const elapsed = Math.round(performance.now() - startTime);
        eventBus.emit({
          id: eventId,
          timestamp: new Date().toLocaleTimeString(),
          toolName: tool.name,
          role: this.currentRole || 'student',
          status: 'error',
          args: args || {},
          resultSummary: err?.message || 'Error executing tool',
          fullResult: { error: err?.message },
          executionTimeMs: elapsed
        });
        throw err;
      }
    };

    this.registeredTools.set(tool.name, {
      ...tool,
      execute: wrappedExecute
    });

    if (typeof document !== 'undefined' && document.modelContext?.registerTool) {
      document.modelContext.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        execute: wrappedExecute
      });
    }
  }

  public getRegisteredTools(): WebMCPToolDefinition[] {
    return Array.from(this.registeredTools.values());
  }
}

export const webmcpRegistry = new WebMCPRegistry();



