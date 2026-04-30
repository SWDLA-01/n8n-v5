# `no-composable-outside-setup` Violations

**Total: 269 violations across 67 files**

| Category | Violations | Files |
|---|---|---|
| Other (utils, routes, init) | 172 | 39 |
| Push connection handlers | 75 | 18 |
| Composables | 14 | 6 |
| Test files | 7 | 3 |
| Stores | 1 | 1 |

## Other (utils, routes, init) (172 violations, 39 files)

- **`app/init.ts`** (31): `useSettingsStore`, `useUsersStore`, `useSSOStore`, `useToast`, `useI18n`, `useExternalHooks`, `useSourceControlStore`, `useRootStore`, `useNodeTypesStore`, `useCloudPlanStore`, `useProjectsStore`, `useRolesStore`, `useBannersStore`, `useVersionsStore`, `useDataTableStore`, `useFavoritesStore`, `usePostHog`, `useNpsSurveyStore`, `useTelemetry`, `useRBACStore`
- **`app/router.ts`** (28): `useSettingsStore`, `useTemplatesStore`, `usePostHog`, `useDynamicCredentials`, `useEnvFeatureFlag`, `useSSOStore`, `useTelemetry`, `useUIStore`, `useExternalHooks`, `useRecentResources`
- **`features/shared/editors/plugins/codemirror/completions/utils.ts`** (12): `useNDVStore`, `useUIStore`, `useWorkflowsStore`, `useWorkflowDocumentStore`
- **`features/shared/nodeCreator/views/viewsData.ts`** (10): `useI18n`, `useNodeTypesStore`, `useTemplatesStore`, `useEvaluationStore`, `useSettingsStore`
- **`app/plugins/telemetry/index.ts`** (9): `useRootStore`, `useSettingsStore`, `usePostHog`, `useUIStore`, `useNDVStore`
- **`app/utils/nodeIcon.ts`** (8): `useUIStore`, `useRootStore`, `useNodeTypesStore`
- **`features/execution/insights/chartjs.utils.ts`** (8): `useCssVar`
- **`features/ndv/parameters/utils/buttonParameter.utils.ts`** (8): `useNDVStore`, `useWorkflowsStore`, `useWorkflowDocumentStore`, `useDataSchema`, `useRootStore`, `useSettingsStore`
- **`experiments/utils.ts`** (5): `usePostHog`, `useCloudPlanStore`, `useTelemetry`, `useWorkflowsListStore`
- **`app/moduleInitializer/moduleInitializer.ts`** (4): `useUIStore`, `useSettingsStore`
- **`features/collaboration/projects/projects.routes.ts`** (4): `useProjectsStore`, `useSettingsStore`, `useInsightsStore`
- **`features/execution/executions/executions.utils.ts`** (4): `useNodeTypesStore`, `useWorkflowsStore`, `useRootStore`
- **`features/shared/editors/plugins/codemirror/completions/datatype.completions.ts`** (4): `useEnvironmentsStore`, `useExternalSecretsStore`, `useSettingsStore`
- **`features/shared/nodeCreator/nodeCreator.utils.ts`** (4): `useSettingsStore`, `useAiGatewayStore`, `useNodeTypesStore`
- **`app/utils/rbac/checks/isAuthenticated.ts`** (3): `useUsersStore`, `useSettingsStore`
- **`features/ai/assistant/builder.utils.ts`** (3): `useAIAssistantHelpers`, `usePostHog`, `useFocusedNodesStore`
- **`app/utils/expressions.ts`** (2): `useWorkflowsStore`, `useWorkflowDocumentStore`
- **`app/utils/nodeTypesUtils.ts`** (2): `useCredentialsStore`, `useNodeTypesStore`
- **`features/core/dataTable/module.descriptor.ts`** (2): `useI18n`, `useInsightsStore`
- **`features/settings/communityNodes/communityNodes.utils.ts`** (2): `useCommunityNodesStore`, `useNodeTypesStore`
- **`app/plugins/components.ts`** (1): `useMessage`
- **`app/utils/nodes/nodeTransforms.ts`** (1): `useNodeTypesStore`
- **`app/utils/rbac/checks/hasRole.ts`** (1): `useUsersStore`
- **`app/utils/rbac/checks/hasScope.ts`** (1): `useRBACStore`
- **`app/utils/rbac/checks/isDefaultUser.ts`** (1): `useUsersStore`
- **`app/utils/rbac/checks/isEnterpriseFeatureEnabled.ts`** (1): `useSettingsStore`
- **`app/utils/rbac/checks/isGuest.ts`** (1): `useUsersStore`
- **`app/utils/rbac/checks/isInstanceOwner.ts`** (1): `useUsersStore`
- **`app/utils/typeGuards.ts`** (1): `useI18n`
- **`features/ai/assistant/assistant.api.ts`** (1): `useAIAssistantHelpers`
- **`features/ai/mcpAccess/module.descriptor.ts`** (1): `useI18n`
- **`features/execution/insights/insights.utils.ts`** (1): `useI18n`
- **`features/execution/insights/module.descriptor.ts`** (1): `useInsightsStore`
- **`features/integrations/sourceControl.ee/sourceControl.utils.ts`** (1): `useI18n`
- **`features/ndv/parameters/utils/fromAIOverride.utils.ts`** (1): `useNodeTypesStore`
- **`features/shared/editors/plugins/codemirror/completions/dollar.completions.ts`** (1): `useExternalSecretsStore`
- **`features/shared/editors/plugins/codemirror/dragAndDrop.ts`** (1): `useNDVStore`
- **`features/workflows/workflowDiff/useWorkflowDiff.ts`** (1): `useCanvasMapping`
- **`features/workflows/workflowHistory/utils.ts`** (1): `useI18n`

## Push connection handlers (75 violations, 18 files)

- **`app/composables/usePushConnection/handlers/executionFinished.ts`** (36): `useWorkflowsStore`, `useWorkflowsListStore`, `useUIStore`, `useAITemplatesStarterCollectionStore`, `useReadyToRunStore`, `useTelemetry`, `useRunWorkflow`, `useI18n`, `useSettingsStore`, `useWorkflowSaving`, `useWorkflowDocumentStore`, `useDocumentTitle`, `useToast`, `useWorkflowHelpers`, `useBuilderStore`, `useNodeTypesStore`, `useNodeHelpers`, `useExternalHooks`
- **`app/composables/usePushConnection/handlers/workflowActivated.ts`** (5): `useCanvasOperations`, `useWorkflowsStore`, `useWorkflowsListStore`, `useBannersStore`, `useUIStore`
- **`app/composables/usePushConnection/handlers/workflowAutoDeactivated.ts`** (5): `useWorkflowsStore`, `useWorkflowsListStore`, `useCanvasOperations`, `useBannersStore`, `useUIStore`
- **`app/composables/usePushConnection/handlers/workflowDeactivated.ts`** (4): `useCanvasOperations`, `useWorkflowsStore`, `useWorkflowsListStore`, `useUIStore`
- **`app/composables/usePushConnection/handlers/workflowFailedToActivate.ts`** (4): `useWorkflowsStore`, `useToast`, `useI18n`, `useActivationError`
- **`app/composables/usePushConnection/handlers/workflowSettingsUpdated.ts`** (3): `useWorkflowsStore`, `useWorkflowsListStore`, `useWorkflowDocumentStore`
- **`app/composables/usePushConnection/handlers/executionRecovered.ts`** (2): `useWorkflowsStore`, `useUIStore`
- **`app/composables/usePushConnection/handlers/executionStarted.ts`** (2): `useWorkflowsStore`, `useWorkflowDocumentStore`
- **`app/composables/usePushConnection/handlers/nodeDescriptionUpdated.ts`** (2): `useNodeTypesStore`, `useCredentialsStore`
- **`app/composables/usePushConnection/handlers/nodeExecuteAfter.ts`** (2): `useWorkflowsStore`, `useAssistantStore`
- **`app/composables/usePushConnection/handlers/nodeExecuteAfterData.ts`** (2): `useWorkflowsStore`, `useSchemaPreviewStore`
- **`app/composables/usePushConnection/handlers/removeNodeType.ts`** (2): `useNodeTypesStore`, `useCredentialsStore`
- **`app/composables/usePushConnection/handlers/builderCreditsUpdated.ts`** (1): `useBuilderStore`
- **`app/composables/usePushConnection/handlers/nodeExecuteBefore.ts`** (1): `useWorkflowsStore`
- **`app/composables/usePushConnection/handlers/reloadNodeType.ts`** (1): `useNodeTypesStore`
- **`app/composables/usePushConnection/handlers/sendWorkerStatusMessage.ts`** (1): `useOrchestrationStore`
- **`app/composables/usePushConnection/handlers/testWebhookDeleted.ts`** (1): `useWorkflowsStore`
- **`app/composables/usePushConnection/handlers/testWebhookReceived.ts`** (1): `useWorkflowsStore`

## Composables (14 violations, 6 files)

- **`app/composables/useWorkflowHelpers.ts`** (7): `useWorkflowsStore`, `useWorkflowDocumentStore`, `useEnvironmentsStore`, `useNDVStore`
- **`features/ai/assistant/composables/useBuilderStreamingGuard.ts`** (3): `useBuilderStore`, `useMessage`, `useI18n`
- **`app/composables/useDataSchema.ts`** (1): `useI18n`
- **`app/composables/useExternalHooks.ts`** (1): `useWebhooksStore`
- **`app/composables/useWorkflowState.ts`** (1): `useWorkflowState`
- **`features/ai/assistant/composables/useExecutionWatcher.ts`** (1): `useWorkflowsStore`

## Test files (7 violations, 3 files)

- **`app/composables/useBackendStatus.spec.ts`** (3): `useBackendConnectionStore`, `useSettingsStore`, `useRootStore`
- **`features/ai/instanceAi/__tests__/createInstanceAiHarness.ts`** (3): `useExecutionPushEvents`, `useCanvasPreview`, `useEventRelay`
- **`__tests__/utils.ts`** (1): `useStore`

## Stores (1 violations, 1 files)

- **`features/settings/orchestration.ee/orchestration.store.ts`** (1): `useRootStore`
