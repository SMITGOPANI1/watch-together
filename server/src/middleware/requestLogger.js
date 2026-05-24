export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Listen for the response finish trigger to log final status
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    let color = '\x1b[32m'; // Green for 2xx success
    if (statusCode >= 400) color = '\x1b[31m'; // Red for 4xx errors
    else if (statusCode >= 300) color = '\x1b[33m'; // Yellow for 3xx redirects
    
    const reset = '\x1b[0m';
    console.log(`[API REQUEST]: ${method} ${originalUrl} -> ${color}${statusCode}${reset} (${elapsed}ms)`);
  });
  
  next();
};

export default requestLogger;
