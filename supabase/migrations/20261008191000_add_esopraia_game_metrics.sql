-- Isolated analytics schema for É Só Pedir pra IA (Prototype Metrics / Supa1).
CREATE SCHEMA IF NOT EXISTS esopraia_metrics;
REVOKE ALL ON SCHEMA esopraia_metrics FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA esopraia_metrics TO service_role;

CREATE TABLE IF NOT EXISTS esopraia_metrics.sessions (
  session_id uuid PRIMARY KEY,
  visitor_id uuid NOT NULL,
  current_game text NOT NULL CHECK (current_game IN ('original', 'delivery')),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE esopraia_metrics.sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON esopraia_metrics.sessions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON esopraia_metrics.sessions TO service_role;
CREATE INDEX IF NOT EXISTS esopraia_metrics_sessions_last_seen_idx ON esopraia_metrics.sessions(last_seen_at);

CREATE TABLE IF NOT EXISTS esopraia_metrics.events (
  event_id text PRIMARY KEY,
  visitor_id uuid NOT NULL,
  session_id uuid NOT NULL,
  game text NOT NULL CHECK (game IN ('original', 'delivery')),
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'game_start', 'game_finish')),
  play_id uuid,
  path text NOT NULL CHECK (path IN ('/', '/index.html', '/entrega.html')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((event_type = 'page_view' AND play_id IS NULL) OR (event_type <> 'page_view' AND play_id IS NOT NULL))
);
ALTER TABLE esopraia_metrics.events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON esopraia_metrics.events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON esopraia_metrics.events TO service_role;
CREATE INDEX IF NOT EXISTS esopraia_metrics_events_created_idx ON esopraia_metrics.events(created_at);
CREATE INDEX IF NOT EXISTS esopraia_metrics_events_visitor_idx ON esopraia_metrics.events(visitor_id, game, event_type);

CREATE OR REPLACE FUNCTION public.prototype_metrics_record_game_event(
  p_event_id text,
  p_visitor_id uuid,
  p_session_id uuid,
  p_game text,
  p_event_type text,
  p_play_id uuid,
  p_path text
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO esopraia_metrics.sessions(session_id, visitor_id, current_game, last_seen_at)
  VALUES (p_session_id, p_visitor_id, p_game, pg_catalog.now())
  ON CONFLICT (session_id) DO UPDATE
    SET visitor_id = EXCLUDED.visitor_id,
        current_game = EXCLUDED.current_game,
        last_seen_at = EXCLUDED.last_seen_at;

  IF p_event_type <> 'heartbeat' THEN
    INSERT INTO esopraia_metrics.events(event_id, visitor_id, session_id, game, event_type, play_id, path)
    VALUES (p_event_id, p_visitor_id, p_session_id, p_game, p_event_type, p_play_id, p_path)
    ON CONFLICT (event_id) DO NOTHING;
  END IF;
END;
$function$;
REVOKE ALL ON FUNCTION public.prototype_metrics_record_game_event(text, uuid, uuid, text, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prototype_metrics_record_game_event(text, uuid, uuid, text, text, uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.prototype_metrics_game_report(p_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_since timestamptz;
  v_active bigint;
  v_visitors bigint;
  v_games jsonb;
  v_played_both bigint;
  v_finished_both bigint;
  v_daily jsonb;
BEGIN
  IF p_days NOT IN (0, 7, 30, 90) THEN
    RAISE EXCEPTION 'Invalid period';
  END IF;
  v_since := CASE WHEN p_days = 0 THEN '-infinity'::timestamptz ELSE pg_catalog.now() - pg_catalog.make_interval(days => p_days) END;

  SELECT pg_catalog.count(DISTINCT session_id) INTO v_active
  FROM esopraia_metrics.sessions WHERE last_seen_at >= pg_catalog.now() - interval '5 minutes';
  SELECT pg_catalog.count(DISTINCT visitor_id) INTO v_visitors
  FROM esopraia_metrics.events WHERE event_type = 'page_view' AND created_at >= v_since;

  SELECT pg_catalog.jsonb_object_agg(g.game, pg_catalog.jsonb_build_object(
    'starts', g.starts, 'starters', g.starters, 'finishes', g.finishes, 'finishers', g.finishers
  )) INTO v_games
  FROM (
    SELECT names.game,
      COALESCE(counts.starts, 0) AS starts,
      COALESCE(counts.starters, 0) AS starters,
      COALESCE(counts.finishes, 0) AS finishes,
      COALESCE(counts.finishers, 0) AS finishers
    FROM (VALUES ('original'::text), ('delivery'::text)) AS names(game)
    LEFT JOIN LATERAL (
      SELECT
        pg_catalog.count(*) FILTER (WHERE e.event_type = 'game_start') AS starts,
        pg_catalog.count(DISTINCT e.visitor_id) FILTER (WHERE e.event_type = 'game_start') AS starters,
        pg_catalog.count(*) FILTER (WHERE e.event_type = 'game_finish') AS finishes,
        pg_catalog.count(DISTINCT e.visitor_id) FILTER (WHERE e.event_type = 'game_finish') AS finishers
      FROM esopraia_metrics.events e
      WHERE e.game = names.game AND e.created_at >= v_since
    ) counts ON true
  ) g;

  SELECT pg_catalog.count(*) INTO v_played_both FROM (
    SELECT visitor_id FROM esopraia_metrics.events
    WHERE event_type = 'game_start' AND created_at >= v_since
    GROUP BY visitor_id HAVING pg_catalog.count(DISTINCT game) = 2
  ) visitors;
  SELECT pg_catalog.count(*) INTO v_finished_both FROM (
    SELECT visitor_id FROM esopraia_metrics.events
    WHERE event_type = 'game_finish' AND created_at >= v_since
    GROUP BY visitor_id HAVING pg_catalog.count(DISTINCT game) = 2
  ) visitors;

  SELECT COALESCE(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
    'day', d.day, 'visitors', d.visitors, 'starts', d.starts, 'finishes', d.finishes
  ) ORDER BY d.day), '[]'::jsonb) INTO v_daily
  FROM (
    SELECT (e.created_at AT TIME ZONE 'UTC')::date AS day,
      pg_catalog.count(DISTINCT e.visitor_id) FILTER (WHERE e.event_type = 'page_view') AS visitors,
      pg_catalog.count(*) FILTER (WHERE e.event_type = 'game_start') AS starts,
      pg_catalog.count(*) FILTER (WHERE e.event_type = 'game_finish') AS finishes
    FROM esopraia_metrics.events e
    WHERE e.created_at >= v_since
    GROUP BY (e.created_at AT TIME ZONE 'UTC')::date
  ) d;

  RETURN pg_catalog.jsonb_build_object(
    'periodDays', CASE WHEN p_days = 0 THEN NULL ELSE p_days END,
    'activeSessions', COALESCE(v_active, 0),
    'uniqueVisitors', COALESCE(v_visitors, 0),
    'games', COALESCE(v_games, '{}'::jsonb),
    'playedBoth', COALESCE(v_played_both, 0),
    'finishedBoth', COALESCE(v_finished_both, 0),
    'daily', COALESCE(v_daily, '[]'::jsonb)
  );
END;
$function$;
REVOKE ALL ON FUNCTION public.prototype_metrics_game_report(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prototype_metrics_game_report(integer) TO service_role;

