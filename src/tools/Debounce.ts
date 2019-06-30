
/** Create a function to limit function callbacks to a minimum number of milliseconds. Binds the returned
 * function to the current context. */
export function Debounce(ms: number, hold: boolean, callback: (...args: any[]) => any): (...args: any[]) => any {
  
  let lastTime: number = 0;
  let waiting: boolean = false;
  let lastArgs: any[] | null;
  let debounce: (...args: any[]) => any;
  
  debounce = function(this: any, ...args: any[]) {
    let now = Date.now();
    if (hold && !waiting || now - lastTime < ms) {
      if (waiting) {
        lastArgs = args;
        return;
      }
      lastTime = now;
      waiting = true;
      setTimeout(
        debounce.bind(this),
        Math.max(0, ms - (now - lastTime)),
        ...args
      );
    } else {
      waiting = false;
      lastTime = now;
      // use the last arguments
      if (lastArgs) {
        args = lastArgs;
        lastArgs = null;
      }
      return callback.call(this, ...args);
    }
  };
  
  return debounce;
}
