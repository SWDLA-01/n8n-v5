import type { IWorkflowBase } from 'n8n-workflow';

export type ExecutionRef = {
	workflowId: string;
	executionId: string;
};

export function createExecutionRef(workflowId: string, executionId: string): ExecutionRef {
	return { workflowId, executionId };
}

export type WorkflowSnapshot = Pick<
	IWorkflowBase,
	'id' | 'name' | 'nodes' | 'connections' | 'settings'
>;

export type ExecutionDataPayload = {
	data: string;
	workflowData: WorkflowSnapshot;
	workflowVersionId: string | null;
};

export type ExecutionDataBundle = ExecutionDataPayload & {
	version: 1;
};

export interface ExecutionDataStore {
	init?(): Promise<void>;
	write(ref: ExecutionRef, payload: ExecutionDataPayload): Promise<void>;
	read(ref: ExecutionRef): Promise<ExecutionDataBundle | null>;
	/**
	 * Read multiple bundles by ref. Returns a map keyed by `executionId`.
	 * Missing entries are omitted from the map — they are not treated as errors here;
	 * callers can detect misses by comparing requested ids against the returned keys.
	 */
	readMany(refs: ExecutionRef[]): Promise<Map<string, ExecutionDataBundle>>;
	delete(ref: ExecutionRef | ExecutionRef[]): Promise<void>;
}
