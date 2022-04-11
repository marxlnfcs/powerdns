import {IPowerDNSSimpleRecord} from "../interfaces/simple/simple-record.interface";
import {isNil, isArray} from "lodash";
import {arrayIncludes, isEqual} from "./validations";

/** @internal */
export function mergeSimpleRecords(records: IPowerDNSSimpleRecord[]): IPowerDNSSimpleRecord[] {
    const recordList: IPowerDNSSimpleRecord[] = [];
    for(let record of (records || [])){
        const addedRecord = recordList.find(r => {
            if(!isNil(record.name) && (isNil(r.name) || !isEqual(r.name, record.name))){
                return false;
            }
            return isEqual(r.type, record.type);
        });
        if(addedRecord){
            addedRecord.content = addedRecord.content || [];
            for(let content of (record.content || [])){
                if(!arrayIncludes(addedRecord.content, content)){
                    addedRecord.content.push(content);
                }
            }
            continue;
        }
        recordList.push({
            name: record.name,
            type: record.type,
            ttl: record.ttl,
            content: !isNil(record.content) ? isArray(record.content) ? record.content : [record.content] : [],
            comment: !isNil(record.comment) ? isArray(record.comment) ? record.comment : [record.comment] : [],
        });
    }
    return recordList.map(record => {
        record.content = Array.from(new Set(record.content));
        record.comment = record.comment.slice(0, record.content.length);
        return record;
    });
}

/** @internal */
export function findSimpleRecord(records: IPowerDNSSimpleRecord[], type: string, name?: string): IPowerDNSSimpleRecord {
    return (records || []).find(r => {
        if(!isNil(name) && (isNil(r.name) || !isEqual(r.name, name))){
            return false;
        }
        return isEqual(r.type, type);
    })
}