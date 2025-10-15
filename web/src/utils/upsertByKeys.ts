/** Insert or update values into array by keys */
export const upsertByKeys = <T>(currentValues: T[], newValue: T, keys: keyof T | keyof T[]) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];

        const index = currentValues.findIndex((item) =>
            keysArray.every((k) => item[k as keyof T] === newValue[k as keyof T])
        );
      
        if (index === -1) {
            // not found → insert
            return [...currentValues, newValue];
        }

        // found → replace
        const updated = [...currentValues];
        updated[index] = newValue;
        return updated;
}
