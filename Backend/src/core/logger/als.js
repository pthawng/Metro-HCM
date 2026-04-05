import { AsyncLocalStorage } from 'async_hooks';

/**
 * Staff-level Traceability: AsyncLocalStorage
 * Automatically propagates Request IDs across the execution context 
 * without manual passing through every function call.
 */
const als = new AsyncLocalStorage();

export default als;
