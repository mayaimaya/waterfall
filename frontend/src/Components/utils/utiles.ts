import { PSDPoint, PSDStrategy } from "../interfaces/interfaces";

export const calcPsdData = (
    data: number[][],
    startFrequency: number,
    endFrequency: number,
    strategy: PSDStrategy 
): PSDPoint[] => {
    const flattened = data.flat();
    const totalChunks = endFrequency - startFrequency + 1;
    const chunkSize = flattened.length / totalChunks;
    return Array.from({ length: totalChunks }, (_, volumeIndex) => {
        const start = Math.floor(volumeIndex * chunkSize);
        const end = volumeIndex === totalChunks - 1
            ? flattened.length
            : Math.floor((volumeIndex + 1) * chunkSize);
        const chunk = flattened.slice(start, end);
        // console.log(chunk);
        
        const value = strategy === PSDStrategy.Mean
            ? chunk.reduce((sum, val) => sum + val, 0) / chunk.length
            : Math.max(...chunk) + (-20 - Math.random() * -10);
        // console.log("vvvalue", value);
        // TODO: DELETE  (-20 - Math.random() * -10); I DID IT TO 
        // MALE RANDON VALUES INSTEAD OF PARMANENT GRAPH
        return {
            x: startFrequency + volumeIndex,
            y: value,
        };
    });
};

