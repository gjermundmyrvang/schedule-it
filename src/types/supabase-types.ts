export type Calendar = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
};

export type CalendarMember = {
  calendar_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
};

export type Event = {
  id: string;
  calendar_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  created_by: string;
  created_at: string;
};

export type EventAssignee = {
  event_id: string;
  user_id: string;
};

export type EventWithAssignees = Event & {
  assignees: EventAssignee[];
};
