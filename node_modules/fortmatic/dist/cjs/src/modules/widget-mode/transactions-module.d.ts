import { ComposeTransactionConfig } from '../../types';
import { BaseModule } from '../base-module';
/**
 *
 */
export declare class TransactionsModule extends BaseModule {
    /** */
    send(config: ComposeTransactionConfig, cb: any): void;
}
