import type { Action, AuthMe, CaslRule, Resource } from "~/services/api/types";

export type AppAbility = {
  can: (action: Action, resource: Resource, data?: Record<string, unknown>) => boolean;
  rules: CaslRule[];
};

function matches(value: Action | Action[] | Resource | Resource[], expected: string) {
  if (Array.isArray(value)) return value.includes(expected as never);
  return value === expected;
}

function ruleAllows(rule: CaslRule, action: Action, resource: Resource) {
  const actionOk = matches(rule.action, "manage") || matches(rule.action, action);
  const resourceOk = matches(rule.subject, "all") || matches(rule.subject, resource);
  return actionOk && resourceOk;
}

function conditionsMatch(
  conditions: Record<string, unknown> | undefined,
  data: Record<string, unknown> | undefined,
) {
  if (!conditions) return true;
  if (!data) return true;
  return Object.entries(conditions).every(([key, value]) => data[key] === value);
}

export function buildAbility(me: AuthMe | null | undefined): AppAbility {
  const rules: CaslRule[] = me
    ? me.rules.length > 0
      ? me.rules
      : me.permissions.map((p) => ({
          action: p.action,
          subject: p.resource,
        }))
    : [];

  return {
    rules,
    can(action, resource, data) {
      let allowed = false;
      for (const rule of rules) {
        if (!ruleAllows(rule, action, resource)) continue;
        if (!conditionsMatch(rule.conditions, data)) continue;
        if (rule.inverted) return false;
        allowed = true;
      }
      return allowed;
    },
  };
}
