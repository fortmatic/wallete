import { FmProvider } from '../core/fm-provider';
import { JsonRpcRequestPayload } from '../types';
/**
 * Emit a payload to the provider asynchronously using native JavaScript
 * Promises.
 */
export declare function emitWeb3Payload<ResultType = any>(provider: FmProvider, method: string, params?: any[]): Promise<ResultType>;
/**
 * Emit a custom Formatic payload asynchronously using native JavaScript
 * Promises.
 */
export declare function emitFortmaticPayload<ResultType = any>(provider: FmProvider, payload: JsonRpcRequestPayload): Promise<ResultType>;
