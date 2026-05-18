import { createPinia, setActivePinia } from 'pinia';
import { mock } from 'vitest-mock-extended';
import type { FrontendSettings } from '@n8n/api-types';
import { useWorkflowHistoryStore } from './workflowHistory.store';
import { useSettingsStore } from '@/app/stores/settings.store';
import { useWorkflowsStore } from '@/app/stores/workflows.store';
import { useWorkflowsListStore } from '@/app/stores/workflowsList.store';
import { useRootStore } from '@n8n/stores/useRootStore';
import * as whApi from '@n8n/rest-api-client/api/workflowHistory';
import * as instanceVersionHistoryApi from '@n8n/rest-api-client/api/instance-version-history';
import { getNewWorkflow } from '@/app/api/workflows';
import { saveAs } from 'file-saver';
import type { IWorkflowDb } from '@/Interface';
import type { WorkflowNodeGroup } from '@n8n/rest-api-client/api/workflows';
import type { IConnections, INode } from 'n8n-workflow';
import { workflowVersionDataFactory } from './__tests__/utils';

vi.mock('@n8n/rest-api-client/api/workflowHistory');
vi.mock('@n8n/rest-api-client/api/instance-version-history');
vi.mock('@/app/api/workflows', () => ({
	getNewWorkflow: vi.fn(),
}));
vi.mock('file-saver', () => ({
	saveAs: vi.fn(),
}));

const workflowId = 'workflow-123';
const versionId = 'version-456';
const nodes: INode[] = [
	{
		id: 'node-1',
		name: 'Manual Trigger',
		type: 'n8n-nodes-base.manualTrigger',
		typeVersion: 1,
		position: [0, 0],
		parameters: {},
	},
	{
		id: 'node-2',
		name: 'Edit Fields',
		type: 'n8n-nodes-base.set',
		typeVersion: 3,
		position: [200, 0],
		parameters: {},
	},
];
const connections: IConnections = {
	'Manual Trigger': {
		main: [[{ node: 'Edit Fields', type: 'main', index: 0 }]],
	},
};
const nodeGroups: WorkflowNodeGroup[] = [
	{ id: 'group-1', name: 'Group 1', nodeIds: ['node-1', 'node-2'] },
];

const readBlobAsText = async (blob: Blob) =>
	await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsText(blob);
	});

describe('Workflow history store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	test.each([
		[true, 1, 1],
		[true, 2, 2],
		[false, 1, 2],
		[false, 2, 1],
		[false, -1, 2],
		[false, 2, -1],
		[false, -1, -1],
	])(
		'should set `shouldUpgrade` to %s when evaluatedPruneTime is %s and licensePruneTime is %s',
		(shouldUpgrade, evaluatedPruneTime, licensePruneTime) => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const settingsStore = useSettingsStore();

			settingsStore.settings = {
				workflowHistory: {
					pruneTime: evaluatedPruneTime,
					licensePruneTime,
				},
			} as FrontendSettings;

			expect(workflowHistoryStore.shouldUpgrade).toBe(shouldUpgrade);
		},
	);

	describe('version workflow data', () => {
		it('should restore node groups from the selected workflow version', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const workflowsStore = useWorkflowsStore();
			const restoredWorkflow = mock<IWorkflowDb>({ id: workflowId, checksum: 'checksum' });

			vi.mocked(whApi.getWorkflowVersion).mockResolvedValue(
				workflowVersionDataFactory({
					workflowId,
					versionId,
					nodes,
					connections,
					nodeGroups,
				}),
			);
			const updateWorkflowSpy = vi
				.spyOn(workflowsStore, 'updateWorkflow')
				.mockResolvedValue(restoredWorkflow);

			const result = await workflowHistoryStore.restoreWorkflow(workflowId, versionId);

			expect(result).toBe(restoredWorkflow);
			expect(updateWorkflowSpy).toHaveBeenCalledWith(
				workflowId,
				{ connections, nodes, nodeGroups },
				true,
			);
		});

		it('should clear node groups when restoring a workflow version without groups', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const workflowsStore = useWorkflowsStore();

			vi.mocked(whApi.getWorkflowVersion).mockResolvedValue(
				workflowVersionDataFactory({
					workflowId,
					versionId,
					nodes,
					connections,
				}),
			);
			const updateWorkflowSpy = vi
				.spyOn(workflowsStore, 'updateWorkflow')
				.mockResolvedValue(mock<IWorkflowDb>({ id: workflowId, checksum: 'checksum' }));

			await workflowHistoryStore.restoreWorkflow(workflowId, versionId);

			expect(updateWorkflowSpy).toHaveBeenCalledWith(
				workflowId,
				{ connections, nodes, nodeGroups: [] },
				true,
			);
		});

		it('should clone node groups from the selected workflow version', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const workflowsStore = useWorkflowsStore();
			const workflowsListStore = useWorkflowsListStore();
			const createdWorkflow = mock<IWorkflowDb>({ id: 'new-workflow' });

			vi.spyOn(workflowsListStore, 'fetchWorkflow').mockResolvedValue(
				mock<IWorkflowDb>({
					id: workflowId,
					name: 'Source Workflow',
				}),
			);
			vi.mocked(whApi.getWorkflowVersion).mockResolvedValue(
				workflowVersionDataFactory({
					workflowId,
					versionId,
					nodes,
					connections,
					nodeGroups,
				}),
			);
			vi.mocked(getNewWorkflow).mockResolvedValue({
				name: 'Source Workflow (2026-01-01)',
				settings: { executionOrder: 'v1' },
			});
			const createWorkflowSpy = vi
				.spyOn(workflowsStore, 'createNewWorkflow')
				.mockResolvedValue(createdWorkflow);

			const result = await workflowHistoryStore.cloneIntoNewWorkflow(workflowId, versionId, {
				formattedCreatedAt: '2026-01-01',
			});

			expect(result).toBe(createdWorkflow);
			expect(createWorkflowSpy).toHaveBeenCalledWith({
				nodes,
				connections,
				nodeGroups,
				name: 'Source Workflow (2026-01-01)',
			});
		});

		it('should download node groups from the selected workflow version', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const workflowsListStore = useWorkflowsListStore();

			vi.spyOn(workflowsListStore, 'fetchWorkflow').mockResolvedValue(
				mock<IWorkflowDb>({
					id: workflowId,
					name: 'Source Workflow',
					nodeGroups: [{ id: 'current-group', name: 'Current Group', nodeIds: [] }],
				}),
			);
			vi.mocked(whApi.getWorkflowVersion).mockResolvedValue(
				workflowVersionDataFactory({
					workflowId,
					versionId,
					nodes,
					connections,
					nodeGroups,
				}),
			);

			await workflowHistoryStore.downloadVersion(workflowId, versionId, {
				formattedCreatedAt: '2026-01-01',
			});

			const [blob, fileName] = vi.mocked(saveAs).mock.calls[0];
			const downloadedWorkflow = JSON.parse(await readBlobAsText(blob as Blob));

			expect(fileName).toBe('Source Workflow(2026-01-01).json');
			expect(downloadedWorkflow.nodes).toEqual(nodes);
			expect(downloadedWorkflow.connections).toEqual(connections);
			expect(downloadedWorkflow.nodeGroups).toEqual(nodeGroups);
		});
	});

	describe('updateWorkflowHistoryVersion', () => {
		it('should call API with correct parameters', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const rootStore = useRootStore();
			const workflowId = 'workflow-123';
			const versionId = 'version-456';
			const updateData = { name: 'Updated Version', description: 'Updated description' };

			vi.mocked(whApi.updateWorkflowHistoryVersion).mockResolvedValue(undefined);

			await workflowHistoryStore.updateWorkflowHistoryVersion(workflowId, versionId, updateData);

			expect(whApi.updateWorkflowHistoryVersion).toHaveBeenCalledWith(
				rootStore.restApiContext,
				workflowId,
				versionId,
				updateData,
			);
			expect(rootStore).toBeDefined();
		});

		it('should handle updating only name', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const rootStore = useRootStore();
			const workflowId = 'workflow-123';
			const versionId = 'version-456';
			const updateData = { name: 'Updated Version' };

			vi.mocked(whApi.updateWorkflowHistoryVersion).mockResolvedValue(undefined);

			await workflowHistoryStore.updateWorkflowHistoryVersion(workflowId, versionId, updateData);

			expect(whApi.updateWorkflowHistoryVersion).toHaveBeenCalledWith(
				rootStore.restApiContext,
				workflowId,
				versionId,
				updateData,
			);
		});

		it('should handle updating only description', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const rootStore = useRootStore();
			const workflowId = 'workflow-123';
			const versionId = 'version-456';
			const updateData = { description: 'Updated description' };

			vi.mocked(whApi.updateWorkflowHistoryVersion).mockResolvedValue(undefined);

			await workflowHistoryStore.updateWorkflowHistoryVersion(workflowId, versionId, updateData);

			expect(whApi.updateWorkflowHistoryVersion).toHaveBeenCalledWith(
				rootStore.restApiContext,
				workflowId,
				versionId,
				updateData,
			);
		});

		it('should handle setting description to null', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const rootStore = useRootStore();
			const workflowId = 'workflow-123';
			const versionId = 'version-456';
			const updateData = { description: null };

			vi.mocked(whApi.updateWorkflowHistoryVersion).mockResolvedValue(undefined);

			await workflowHistoryStore.updateWorkflowHistoryVersion(workflowId, versionId, updateData);

			expect(whApi.updateWorkflowHistoryVersion).toHaveBeenCalledWith(
				rootStore.restApiContext,
				workflowId,
				versionId,
				updateData,
			);
		});

		it('should propagate API errors', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const workflowId = 'workflow-123';
			const versionId = 'version-456';
			const updateData = { name: 'Updated Version' };
			const error = new Error('API Error');

			vi.mocked(whApi.updateWorkflowHistoryVersion).mockRejectedValue(error);

			await expect(
				workflowHistoryStore.updateWorkflowHistoryVersion(workflowId, versionId, updateData),
			).rejects.toThrow('API Error');
		});
	});

	describe('getPublishTimeline', () => {
		it('should call the API with the rest context and workflow id and return its result', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const rootStore = useRootStore();
			const workflowId = 'workflow-123';
			const events = [
				{
					id: 1,
					workflowId,
					versionId: 'v1',
					event: 'activated' as const,
					createdAt: '2026-01-01T00:00:00Z',
					userId: null,
					user: null,
					versionName: 'Release 1',
				},
			];

			vi.mocked(whApi.getPublishTimeline).mockResolvedValue(events);

			const result = await workflowHistoryStore.getPublishTimeline(workflowId);

			expect(whApi.getPublishTimeline).toHaveBeenCalledWith(rootStore.restApiContext, workflowId);
			expect(result).toBe(events);
		});

		it('should propagate API errors', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			vi.mocked(whApi.getPublishTimeline).mockRejectedValue(new Error('API Error'));

			await expect(workflowHistoryStore.getPublishTimeline('workflow-123')).rejects.toThrow(
				'API Error',
			);
		});
	});

	describe('getVersionFirstAdoptionDate', () => {
		it('should forward the rest context and version and return the date', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			const rootStore = useRootStore();
			const version = { major: 2, minor: 17, patch: 0 };

			vi.mocked(instanceVersionHistoryApi.getFirstAdoptionDate).mockResolvedValue(
				'2026-01-01T00:00:00Z',
			);

			const result = await workflowHistoryStore.getVersionFirstAdoptionDate(version);

			expect(instanceVersionHistoryApi.getFirstAdoptionDate).toHaveBeenCalledWith(
				rootStore.restApiContext,
				version,
			);
			expect(result).toBe('2026-01-01T00:00:00Z');
		});

		it('should return null when the API responds with null', async () => {
			const workflowHistoryStore = useWorkflowHistoryStore();
			vi.mocked(instanceVersionHistoryApi.getFirstAdoptionDate).mockResolvedValue(null);

			const result = await workflowHistoryStore.getVersionFirstAdoptionDate({
				major: 2,
				minor: 17,
				patch: 0,
			});

			expect(result).toBeNull();
		});
	});
});
