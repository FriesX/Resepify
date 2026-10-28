export interface AuditEvent {
  id: string;
  actor_user_id: string;
  actor_name: string;
  action: "create" | "update" | "publish" | "unpublish" | "archive" | "restore" | "delete" | "backup" | "restore_backup";
  entity_type: "recipe" | "category" | "system";
  entity_id: string;
  entity_title?: string;
  metadata_minimal?: Record<string, unknown>;
  created_at: string;
}
