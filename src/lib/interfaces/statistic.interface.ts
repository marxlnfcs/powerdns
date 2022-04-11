export type IPowerDNSStatistic = IPowerDNSStatisticItem|IPowerDNSStatisticMapItem|IPowerDNSStatisticRingItem;

export interface IPowerDNSStatisticItem {

    /** Set to "StatisticItem" */
    type: 'StatisticItem';

    /** Item name */
    name: string;

    /** Item value */
    value: string;

}

export interface IPowerDNSStatisticMapItem {

    /** Set to "MapStatisticItem" */
    type: 'MapStatisticItem';

    /** Item name */
    name: string;

    /** Named values */
    value: IPowerDNSStatisticSimpleItem[];

}

export interface IPowerDNSStatisticRingItem {

    /** Set to "RingStatisticItem" */
    type: 'RingStatisticItem';

    /** Item name */
    name: string;

    /** Ring size */
    size: number;

    /** Named values */
    value: IPowerDNSStatisticSimpleItem[];

}

export interface IPowerDNSStatisticSimpleItem {

    /** Item name */
    name: string;

    /** Item value */
    value: string;

}