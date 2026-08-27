import { UserRole } from '../../types/lms';

export interface WebMCPToolDefinition<TArgs = any, TResult = any> {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (args: TArgs) => Promise<TResult>;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  toolName: string;
  role: UserRole;
  status: 'running' | 'success' | 'error';
  args: Record<string, unknown>;
  resultSummary?: string;
  fullResult?: unknown;
  executionTimeMs?: number;
}

