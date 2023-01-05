let index = 0;
export const logger = (log: string, ...args: any) => {
  if (__DEV__) {
    if (args.length !== 0) {
      console.log(`[DEBUG(${index})] ${log}`, args);
    } else {
      console.log(`[DEBUG(${index})] ${log}`);
    }
    index++;
  }
};

// README
// I reccomend using this only on first calls, don't use this on the nested functions.
// The HOF itself has a performance counter in ms. So having calls on the nested function will slow down everything
// The logs will only work during Dev and will just return function calls during release.
// Please don't tinker unless you know what you're doing, it might break the whole app in general.

export const debugLogger =
  (fn: (...args: any) => any, filename: string) =>
  (...args: any) => {
    if (__DEV__) {
      logger(`${filename} -> ${fn.name}`, ...args);
      let start = performance.now();
      try {
        const toReturn = fn(...args);
        logger(`Performance: ${fn.name} ${performance.now() - start} ms`);
        return toReturn;
      } catch (error) {
        logger(`Performance: ${fn.name} ${performance.now() - start} ms`);
        logger(`Error: ${fn.name}: `, error);
        throw error;
      }
    } else {
      return fn(...args);
    }
  };
