import type { Database } from '~/database/types';

export type TablesName = keyof Database['public']['Tables']; // 取得所有資料表名稱
