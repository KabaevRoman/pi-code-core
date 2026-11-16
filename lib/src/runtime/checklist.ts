import type { Task } from './state.ts';

// Structural component: pi-tui is not a runtime dependency, so widgets/renderers use this shape directly.
export interface ChecklistComponent { render(width: number): string[]; invalidate(): void }

export function checklistHeader(tasks: Task[], theme: any): string {
  const completed = tasks.filter(task => task.status === 'completed').length;
  const width = 10, filled = tasks.length ? Math.round((completed / tasks.length) * width) : 0;
  const bar = theme.fg(tasks.length && completed === tasks.length ? 'success' : 'accent', '█'.repeat(filled)) + theme.fg('dim', '░'.repeat(width - filled));
  return `${theme.fg('toolTitle', theme.bold('Tasks'))} ${bar} ${theme.fg('muted', `${completed}/${tasks.length} completed`)}`;
}

export function checklistLines(tasks: Task[], theme: any, opts: { maxRows?: number } = {}): string[] {
  const rows: string[] = [];
  const shown = opts.maxRows !== undefined ? tasks.slice(0, opts.maxRows) : tasks;
  for (const task of shown) {
    const id = theme.fg('dim', `#${task.id}`);
    const suffix = `${task.owner ? theme.fg('dim', ` · ${task.owner}`) : ''}${task.blockedBy.length ? theme.fg('dim', ` · deps: ${task.blockedBy.map(dep => '#' + dep).join(', ')}`) : ''}`;
    if (task.status === 'completed') rows.push(`${theme.fg('success', '☑')} ${id} ${theme.fg('muted', task.subject)}${suffix}`);
    else if (task.status === 'in_progress') rows.push(`${theme.fg('accent', '▶')} ${id} ${theme.fg('text', task.subject)}${suffix}`);
    else rows.push(`${theme.fg('muted', '☐')} ${id} ${theme.fg('text', task.subject)}${suffix}`);
  }
  if (tasks.length > shown.length) rows.push(theme.fg('muted', `… (${tasks.length - shown.length} more)`));
  return rows;
}

export function checklistComponent(theme: any, tasks: Task[], opts: { header?: string; footer?: string; maxRows?: number } = {}): ChecklistComponent {
  const lines = [opts.header ?? checklistHeader(tasks, theme), ...checklistLines(tasks, theme, opts), ...(opts.footer ? [theme.fg('muted', opts.footer)] : [])];
  return { render: () => lines, invalidate: () => {} };
}
