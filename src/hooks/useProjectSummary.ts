import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/data/projects';

interface SummaryState {
  summary: string | null;
  loading: boolean;
  error: string | null;
}

interface CachedRow {
  summary: string | null;
}

/**
 * Loads (or generates + caches) a short AI summary for a project.
 * Re-runs only when the project id changes — not on every parent re-render.
 */
export function useProjectSummary(project: Project): SummaryState {
  const [state, setState] = useState<SummaryState>({
    summary: null,
    loading: true,
    error: null,
  });

  // Always read the latest project payload without re-triggering the effect.
  const projectRef = useRef(project);
  projectRef.current = project;

  useEffect(() => {
    let cancelled = false;
    setState({ summary: null, loading: true, error: null });

    (async () => {
      try {
        const { data: cached } = await supabase
          .from('project_summaries' as never)
          .select('summary')
          .eq('project_id', project.id)
          .maybeSingle<CachedRow>();

        if (cancelled) return;
        if (cached?.summary) {
          setState({ summary: cached.summary, loading: false, error: null });
          return;
        }

        const p = projectRef.current;
        const { data, error } = await supabase.functions.invoke('project-summary', {
          body: {
            projectId: p.id,
            title: p.title,
            description: p.description,
            longDescription: p.longDescription,
            technologies: p.technologies,
            metrics: p.metrics,
          },
        });
        if (cancelled) return;
        if (error) throw error;
        setState({
          summary: (data as { summary?: string } | null)?.summary ?? null,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          summary: null,
          loading: false,
          error: e instanceof Error ? e.message : 'Failed to load summary',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [project.id]);

  return state;
}
