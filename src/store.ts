export type AccessStatus = "allowed" | "blocked";

export type MemberRecord = {
  discordId: string;
  username: string;
  status: AccessStatus;
  role: string;
  addedAt: string;
};

export type ExecutionRecord = {
  script: string;
  userId: string;
  username: string;
  status: "success" | "denied" | "failed";
  createdAt: string;
};

const members = new Map<string, MemberRecord>();
const executions: ExecutionRecord[] = [];
const redeemedKeys = new Set<string>();

export function getMember(discordId: string) {
  return members.get(discordId);
}

export function setMember(
  discordId: string,
  username: string,
  status: AccessStatus,
  role: string,
) {
  const record: MemberRecord = {
    discordId,
    username,
    status,
    role,
    addedAt: new Date().toISOString(),
  };
  members.set(discordId, record);
  return record;
}

export function listMembers() {
  return [...members.values()];
}

export function addExecution(record: ExecutionRecord) {
  executions.unshift(record);
  executions.splice(100);
}

export function listExecutions() {
  return executions;
}

export function redeemKey(key: string) {
  if (!key.startsWith("BUYER-") || redeemedKeys.has(key)) return false;
  redeemedKeys.add(key);
  return true;
}

export function resetHwid(discordId: string) {
  return Boolean(getMember(discordId));
}