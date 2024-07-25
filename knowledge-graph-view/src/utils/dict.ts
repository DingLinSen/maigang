import useDictStore from '@/store/modules/appDict'
import { getDictsApi } from '@/api/dict'
import { ref, toRefs } from 'vue'

/**
 * 获取字典数据
 */
export const useDict = (...args: any[]) => {
    const res = ref({});
    return (() => {
        args.forEach((dictType, _index) => {
            res.value[dictType] = [];
            const dicts = useDictStore().getDict(dictType);
            if (dicts) {
                res.value[dictType] = dicts;
            } else {
                getDictsApi(dictType).then(resp => {
                    res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
                    useDictStore().setDict(dictType, res.value[dictType]);
                })
            }
        })
        return toRefs(res.value);
    })()
}