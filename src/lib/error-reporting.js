function reportError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__retailedgeEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
  const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : void 0;
  window.__retailedgeReportRuntimeError?.({
    message,
    ...stack !== void 0 && { stack },
    filename: window.location.pathname
  });
}
export {
  reportError
};
