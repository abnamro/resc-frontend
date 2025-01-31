import type { Ref } from "vue";

export function useSorting(sortBy: Ref<undefined|string>, sortOrder: Ref<1 | -1>) {

    function alphaNumSort(a: Record<string,number|string|undefined>, b: Record<string,number|string|undefined>)
    {
        if (sortBy.value === undefined) {
            throw new Error('sortBy is undefined!')
        }

        let x = a[sortBy.value]; let y = b[sortBy.value];
        if (x === undefined && y == undefined) {
        return 0;
        }
        if (x === undefined) {
        return sortOrder.value
        }
        if (y === undefined) {
        return -sortOrder.value
        }
    
        // This is to make sure that upper case and lower case are not impacting the sort
        if (typeof x === 'string' && typeof y === 'string') {
        x = x.toUpperCase();
        y = y.toUpperCase();
        }
    
        return ((x < y) ? -sortOrder.value : ((x > y) ? sortOrder.value : 0));
    }

    return {alphaNumSort}
}